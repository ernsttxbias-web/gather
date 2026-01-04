import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { exchangeCodeForToken } from '../lib/tiktok'

export function TikTokCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const errorParam = searchParams.get('error')

        // Check for OAuth errors
        if (errorParam) {
          setError(`TikTok authorization failed: ${errorParam}`)
          setTimeout(() => navigate('/settings'), 3000)
          return
        }

        // Validate state token for CSRF protection
        const storedState = sessionStorage.getItem('tiktok_oauth_state')
        if (!state || state !== storedState) {
          setError('State token mismatch. Please try again.')
          setTimeout(() => navigate('/settings'), 3000)
          return
        }

        if (!code) {
          setError('No authorization code received')
          setTimeout(() => navigate('/settings'), 3000)
          return
        }

        // Exchange code for token
        const auth = await exchangeCodeForToken(code)
        if (!auth) {
          setError('Failed to exchange code for token')
          setTimeout(() => navigate('/settings'), 3000)
          return
        }

        // Clean up state token
        sessionStorage.removeItem('tiktok_oauth_state')

        // Redirect to settings with success
        navigate('/settings')
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError('An unexpected error occurred')
        setTimeout(() => navigate('/settings'), 3000)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      <div className="text-center">
        {error ? (
          <>
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-sm text-[var(--text-tertiary)]">Redirecting...</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-[var(--text-secondary)]">Connecting TikTok...</p>
          </>
        )}
      </div>
    </div>
  )
}
