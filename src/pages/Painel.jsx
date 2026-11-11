import MapaRmsp from '../components/MapaRmsp'

export default function Painel() {
  return (
    <section className="page-section">
      <div className="content-logo" />
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
    </section>
  )
}
