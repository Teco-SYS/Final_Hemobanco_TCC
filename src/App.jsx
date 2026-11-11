import { useEffect, useState } from 'react'
import Login from './components/Login'
import AppShell from './components/AppShell'
import Painel from './pages/Painel'
import CadastroDoadores from './pages/CadastroDoadores'
import CadastroDoacao from './pages/CadastroDoacao'
import DoadoresBloqueados from './pages/DoadoresBloqueados'
import Declaracoes from './pages/Declaracoes'
import Notificacoes from './pages/Notificacoes'
import { ensureSeed, getUser, setUser } from './lib/storage'

export default function App() {
  const [ready, setReady] = useState(false)
  const [user, setUserState] = useState(null)
  const [page, setPage] = useState('painel')

  useEffect(() => {
    ensureSeed()
    setUserState(getUser())
    setReady(true)
  }, [])

  if (!ready) {
    return (
      <div className="login-page">
        <p style={{ color: '#fff', fontSize: 18 }}>Hemobanco</p>
      </div>
    )
  }

  if (!user) {
    return (
      <Login
        onLogin={(u) => {
          setUserState(u)
          setPage('painel')
        }}
      />
    )
  }

  return (
    <AppShell
      user={user}
      page={page}
      onNavigate={setPage}
      onLogout={() => {
        setUser(null)
        setUserState(null)
        setPage('painel')
      }}
    >
      {page === 'painel' && <Painel onNavigate={setPage} />}
      {page === 'cadastro-doadores' && <CadastroDoadores />}
      {page === 'cadastro-doacao' && <CadastroDoacao />}
      {page === 'doadores-bloqueados' && <DoadoresBloqueados />}
      {page === 'gerar-declaracoes' && <Declaracoes />}
      {page === 'notificacoes' && <Notificacoes />}
    </AppShell>
  )
}
