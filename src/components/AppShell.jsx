const NAV = [
  { id: 'painel', label: 'Painel de Controle', icon: 'i-home' },
  { id: 'cadastro-doadores', label: 'Cadastro de doadores', icon: 'i-user' },
  { id: 'cadastro-doacao', label: 'Cadastro de doação', icon: 'i-cross' },
  { id: 'doadores-bloqueados', label: 'Doadores bloqueados', icon: 'i-block' },
  { id: 'gerar-declaracoes', label: 'Gerar declarações', icon: 'i-doc' },
  { id: 'notificacoes', label: 'Notificações', icon: 'i-bell' },
]

export default function AppShell({ user, page, onNavigate, onLogout, children }) {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">{(user?.nome || 'U').charAt(0).toUpperCase()}</div>
          <div className="user-info">
            <h3>{user?.nome || 'Usuário'}</h3>
            <span>{user?.tipo === 'empresa' ? 'Empresa / Hemocentro' : 'Doador'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item) => (
            <a
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(item.id)
              }}
            >
              <span className={`i ${item.icon}`} /> {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-sair" type="button" onClick={onLogout}>
            <span className="i i-exit" /> Sair
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-bar">
          <div className="region">
            <span className="i i-pin" /> Região Metropolitana de SP
            <span className="badge">39 Municípios</span>
          </div>
          <div className="brand">
            <span className="i i-cross" /> Hemobanco
          </div>
        </header>
        <div className="content-area">{children}</div>
      </div>
    </div>
  )
}
