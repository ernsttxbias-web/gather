import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getSettings } from './storage'

const resources = {
  en: {
    translation: {
      app: {
        name: 'Gather',
        tagline: 'Who Liked That?',
        description: 'Share TikTok videos and guess who liked them!'
      },
      landing: {
        createRoom: 'Create Room',
        joinRoom: 'Join Room',
        enterCode: 'Enter room code',
        join: 'Join',
        invalidCode: 'Invalid room code'
      },
      settings: {
        title: 'Settings',
        profile: 'Profile',
        name: 'Name',
        avatar: 'Avatar',
        sound: 'Sound',
        masterVolume: 'Master Volume',
        mute: 'Mute',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        language: 'Language',
        save: 'Save',
        tiktok: 'TikTok',
        connectTikTok: 'Connect TikTok',
        disconnectTikTok: 'Disconnect TikTok',
        tiktokConnected: 'TikTok connected',
        tiktokNotConnected: 'Not connected'
      },
      room: {
        lobby: 'Lobby',
        code: 'Room Code',
        players: 'Players',
        host: 'Host',
        waiting: 'Waiting for host to start...',
        startGame: 'Start Game',
        minPlayers: 'At least 3 players required',
        copied: 'Copied!',
        leave: 'Leave Room'
      },
      game: {
        round: 'Round',
        of: 'of',
        yourTurn: 'Your turn to share!',
        enterLink: 'Paste TikTok link',
        submit: 'Submit',
        watching: 'Watch the video!',
        timeLeft: 'Time left',
        guessing: 'Who liked this?',
        selectPlayer: 'Tap a player to guess',
        reveal: 'It was',
        correct: 'Correct!',
        wrong: 'Wrong!',
        points: 'points',
        waiting: 'Waiting for others...',
        scores: 'Scores',
        correctGuesses: 'Correct Guesses',
        totalPoints: 'Total Points'
      },
      results: {
        title: 'Game Over!',
        winner: 'Winner',
        podium: 'Top 3',
        rankings: 'Rankings',
        stats: 'Statistics',
        totalRounds: 'Total Rounds',
        correctGuesses: 'Correct Guesses',
        accuracy: 'Accuracy',
        awards: 'Awards',
        mostCorrect: 'Most Correct',
        fastest: 'Fastest Guesser',
        trickiest: 'Trickiest Picker',
        playAgain: 'Play Again',
        backToLobby: 'Back to Lobby',
        share: 'Share Results'
      },
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        done: 'Done'
      }
    }
  },
  de: {
    translation: {
      app: {
        name: 'Gather',
        tagline: 'Wer hat das geliked?',
        description: 'Teile TikTok-Videos und errate, wer sie geliked hat!'
      },
      landing: {
        createRoom: 'Raum erstellen',
        joinRoom: 'Raum beitreten',
        enterCode: 'Raum-Code eingeben',
        join: 'Beitreten',
        invalidCode: 'Ungültiger Raum-Code'
      },
      settings: {
        title: 'Einstellungen',
        profile: 'Profil',
        name: 'Name',
        avatar: 'Avatar',
        sound: 'Sound',
        masterVolume: 'Lautstärke',
        mute: 'Stumm',
        theme: 'Design',
        light: 'Hell',
        dark: 'Dunkel',
        system: 'System',
        language: 'Sprache',
        save: 'Speichern',
        tiktok: 'TikTok',
        connectTikTok: 'TikTok verbinden',
        disconnectTikTok: 'Trennen',
        tiktokConnected: 'TikTok verbunden',
        tiktokNotConnected: 'Nicht verbunden'
      },
      room: {
        lobby: 'Lobby',
        code: 'Raum-Code',
        players: 'Spieler',
        host: 'Host',
        waiting: 'Warte auf Host...',
        startGame: 'Spiel starten',
        minPlayers: 'Mindestens 3 Spieler erforderlich',
        copied: 'Kopiert!',
        leave: 'Raum verlassen'
      },
      game: {
        round: 'Runde',
        of: 'von',
        yourTurn: 'Du bist dran!',
        enterLink: 'TikTok-Link einfügen',
        submit: 'Absenden',
        watching: 'Schau das Video!',
        timeLeft: 'Verbleibende Zeit',
        guessing: 'Wer hat das geliked?',
        selectPlayer: 'Tippe auf einen Spieler',
        reveal: 'Es war',
        correct: 'Richtig!',
        wrong: 'Falsch!',
        points: 'Punkte',
        waiting: 'Warte auf andere...',
        scores: 'Punktestand',
        correctGuesses: 'Richtige Tipps',
        totalPoints: 'Gesamt Punkte'
      },
      results: {
        title: 'Spiel vorbei!',
        winner: 'Gewinner',
        podium: 'Top 3',
        rankings: 'Rangliste',
        stats: 'Statistiken',
        totalRounds: 'Runden gesamt',
        correctGuesses: 'Richtige Tipps',
        accuracy: 'Genauigkeit',
        awards: 'Auszeichnungen',
        mostCorrect: 'Meiste Treffer',
        fastest: 'Schnellster',
        trickiest: 'Trickreichster',
        playAgain: 'Nochmal spielen',
        backToLobby: 'Zurück zur Lobby',
        share: 'Ergebnisse teilen'
      },
      common: {
        loading: 'Lädt...',
        error: 'Etwas ist schiefgelaufen',
        retry: 'Erneut versuchen',
        cancel: 'Abbrechen',
        confirm: 'Bestätigen',
        back: 'Zurück',
        next: 'Weiter',
        done: 'Fertig'
      }
    }
  }
}

const settings = getSettings()

i18n.use(initReactI18next).init({
  resources,
  lng: settings.language,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
