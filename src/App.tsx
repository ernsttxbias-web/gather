import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import { GameProvider } from './context/GameContext'
import { ToastContainer } from './components/ui/Toast'
import { LandingPage } from './pages/LandingPage'
import { SettingsPage } from './pages/SettingsPage'
import { RoomPage } from './pages/RoomPage'
import { GamePage } from './pages/GamePage'
import { ResultsPage } from './pages/ResultsPage'
import { TikTokCallbackPage } from './pages/TikTokCallbackPage'
import './lib/i18n'

export default function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/auth/tiktok/callback" element={<TikTokCallbackPage />} />
            <Route path="/room/:code" element={<RoomPage />} />
            <Route path="/room/:code/game" element={<GamePage />} />
            <Route path="/room/:code/results" element={<ResultsPage />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </GameProvider>
    </ThemeProvider>
  )
}
