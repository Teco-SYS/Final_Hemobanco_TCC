import MapaRmsp from '../components/MapaRmsp'

const CARDS = [
  {
    id: 'cadastro-doadores',
    icon: 'i-user',
    title: 'Cadastro de doadores',
    text: 'Cadastrar novo doador no banco da RMSP.',
  },
  {
    id: 'cadastro-doacao',
    icon: 'i-cross',
    title: 'Cadastro de doação',
    text: 'Registrar coleta e intervalo regulatório.',
  },
  {
    id: 'doadores-bloqueados',
    icon: 'i-block',
    title: 'Doadores bloqueados',
    text: 'Consultar e incluir impedimentos clínicos.',
  },
  {
    id: 'gerar-declaracoes',
    icon: 'i-doc',
    title: 'Declaração',
    text: 'Emitir comprovante de comparecimento.',
  },
  {
    id: 'notificacoes',
    icon: 'i-bell',
    title: 'Notificações',
    text: 'Alertas de estoque e convocações da rede.',
  },
]

export default function Painel({ onNavigate }) {
  return (
    <section className="page-section">
      <div className="content-logo">
        
      </div>
      <h2 className="page-title">Painel de Controle Hemobanco</h2>
      <p className="page-subtitle">
        Sistema unificado de informações de doadores de sangue e hemocomponentes.
      </p>

      <div className="info-box">
        <strong>
          <span className="i i-pin" /> Área de Abrangência do Sistema: Região Metropolitana de São
          Paulo (RMSP) - Brasil
        </strong>
        <br />
        O Hemobanco centraliza em tempo real as fichas de doadores, coletas e impedimentos clínicos
        de <strong>39 municípios integrados</strong> na Grande São Paulo, cobrindo uma população de
        mais de 22 milhões de cidadãos. Redes conectadas incluem a Fundação Pró-Sangue (Clínicas,
        Dante Pazzanese, Mandaqui, Osasco, Barueri), Hemocentro do ABC, Hemocentro de Guarulhos,
        Hemocentro de São Bernardo e hospitais de alta complexidade.
      </div>

      <MapaRmsp />

      <div className="cards-grid">
        {CARDS.map((c) => (
          <div key={c.id} className="card" onClick={() => onNavigate(c.id)}>
            <div className="card-icon">
              <span className={`i ${c.icon}`} />
            </div>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
