const NOTIFICACOES = [
  'Fundação Pró-Sangue: estoque crítico de sangue O- e plaquetas.',
  'Hemocentro Regional de Osasco: campanha emergencial tipo A+.',
  'Hemocentro do ABC: convocação para cirurgias cardíacas.',
  'Rede RMSP Hemobanco: sincronização de cadastros entre hemocentros.',
]

export default function Notificacoes() {
  return (
    <section className="page-section">
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
