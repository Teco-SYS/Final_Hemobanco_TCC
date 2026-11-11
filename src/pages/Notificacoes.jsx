import { NOTIFICACOES } from '../lib/storage'

export default function Notificacoes() {
  return (
    <section className="page-section">
      <div className="content-logo">
      </div>
      <h2 className="page-title">Notificações</h2>
      <div className="notifications-list">
        {NOTIFICACOES.map((texto, i) => (
          <div className="notification-item" key={texto}>
            <span className="num">{i + 1}.</span>
            <span className="text">{texto}</span>
            <span className="tag">RMSP</span>
          </div>
        ))}
      </div>
    </section>
  )
}
