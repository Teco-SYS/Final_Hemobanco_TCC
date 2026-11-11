import { useState } from 'react'
import { HEMOCENTROS, pushDeclaracao } from '../lib/storage'
import { formatDate, gerarProtocolo, maskCpf, todayIso } from '../lib/utils'

function montarHtml(d) {
  const tipoTexto =
    d.tipo === 'Comparecimento' ? 'comparecimento (sem coleta)' : `doação de ${d.tipo}`

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Declaração ${d.protocolo} — ${d.nome}</title>
<style>
  @page { margin: 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #222;
    max-width: 700px;
    margin: 0 auto;
    padding: 32px 28px;
    line-height: 1.55;
  }
  .header { display: flex; gap: 16px; align-items: center; margin-bottom: 12px; }
  .logo { font-size: 36px; }
  h1 { margin: 0; font-size: 22px; color: #6b0f1a; letter-spacing: 0.04em; }
  .sub { margin: 2px 0; font-size: 12px; color: #666; font-family: Arial, sans-serif; }
  hr { border: none; border-top: 2px solid #6b0f1a; margin: 16px 0 20px; }
  h2 { text-align: center; font-size: 16px; letter-spacing: 0.06em; margin: 0 0 8px; color: #6b0f1a; }
  .protocolo { text-align: center; font-size: 13px; font-family: Arial, sans-serif; margin-bottom: 24px; }
  .body { font-size: 15px; text-align: center; }
  .nome { font-size: 20px; font-weight: bold; margin: 14px 0; color: #6b0f1a; }
  .final { margin-top: 22px; text-align: justify; font-size: 13px; color: #444; }
  .footer { margin-top: 40px; text-align: center; }
  .assinatura { margin: 36px auto 8px; width: 260px; }
  .linha { border-top: 1px solid #333; margin-bottom: 6px; }
  .rodape { margin-top: 28px; font-size: 11px; color: #888; font-family: Arial, sans-serif; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>HEMOBANCO</h1>
      <p class="sub">Rede Metropolitana de São Paulo — RMSP</p>
      <p class="sub">Sistema unificado de doadores de sangue e hemocomponentes</p>
    </div>
  </div>
  <hr>
  <h2>DECLARAÇÃO DE DOAÇÃO / COMPARECIMENTO</h2>
  <p class="protocolo">Protocolo: <strong>${d.protocolo}</strong></p>
  <div class="body">
    <p>Declaramos, para os devidos fins, que o(a) Sr(a).</p>
    <p class="nome">${d.nome}</p>
    <p>portador(a) do CPF nº <strong>${d.cpf}</strong>,</p>
    <p>compareceu e realizou <strong>${tipoTexto}</strong></p>
    <p>na data de <strong>${formatDate(d.data)}</strong>,</p>
    <p>no estabelecimento <strong>${d.hemocentro}</strong>.</p>
    <p class="final">
      Esta declaração é emitida pelo sistema Hemobanco e serve como comprovante
      oficial de comparecimento/doação junto à rede de hemocentros da
      Região Metropolitana de São Paulo.
    </p>
  </div>
  <div class="footer">
    <p>Documento emitido em <strong>${d.emissao}</strong></p>
    <div class="assinatura">
      <div class="linha"></div>
      <p>Hemobanco — Rede RMSP</p>
      <p class="sub">Documento gerado eletronicamente</p>
    </div>
    <p class="rodape">Sistema Hemobanco • Região Metropolitana de São Paulo • 39 Municípios</p>
  </div>
</body>
</html>`
}

export default function Declaracoes() {
  const [form, setForm] = useState({
    cpf: '',
    nome: '',
    data: todayIso(),
    tipo: 'Sangue total',
    hemocentro: HEMOCENTROS[0],
  })
  const [doc, setDoc] = useState(null)
  const [alert, setAlert] = useState(null)

  function onChange(field) {
    return (e) => {
      const value = field === 'cpf' ? maskCpf(e.target.value) : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function submit(e) {
    e.preventDefault()
    if (!form.cpf || !form.nome || !form.data) {
      setAlert({ kind: 'error', text: 'Preencha todos os campos obrigatórios.' })
      return
    }
    const gerado = {
      ...form,
      protocolo: gerarProtocolo(),
      emissao: new Date().toLocaleString('pt-BR'),
    }
    pushDeclaracao(gerado)
    setDoc(gerado)
    setAlert({
      kind: 'success',
      text: 'Declaração gerada com sucesso! Você pode imprimir ou baixar o documento.',
    })
  }

  function imprimir() {
    if (!doc) return
    const html = montarHtml(doc)
    const janela = window.open('', '_blank', 'width=800,height=900')
    if (!janela) {
      setAlert({ kind: 'error', text: 'Permita pop-ups no navegador para imprimir.' })
      return
    }
    janela.document.open()
    janela.document.write(html)
    janela.document.close()
    janela.focus()
    setTimeout(() => janela.print(), 300)
  }

  function baixar() {
    if (!doc) return
    const html = montarHtml(doc)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Declaracao_${doc.nome.replace(/\s+/g, '_')}_${doc.protocolo}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setAlert({
      kind: 'success',
      text: 'Arquivo baixado. Abra e use Imprimir → Salvar como PDF se quiser em PDF.',
    })
  }

  const tipoTexto =
    doc?.tipo === 'Comparecimento' ? 'comparecimento (sem coleta)' : `doação de ${doc?.tipo}`

  return (
    <section className="page-section">
      <h2 className="page-title">Gerar declarações</h2>
      {alert ? <div className={`alert alert-${alert.kind} show`}>{alert.text}</div> : null}

      <div className="form-container">
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>CPF do doador *</label>
              <input value={form.cpf} onChange={onChange('cpf')} placeholder="000.000.000-00" required />
            </div>
            <div className="form-group">
              <label>Nome completo *</label>
              <input value={form.nome} onChange={onChange('nome')} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data da doação / comparecimento *</label>
              <input type="date" value={form.data} onChange={onChange('data')} required />
            </div>
            <div className="form-group">
              <label>Tipo de doação</label>
              <select value={form.tipo} onChange={onChange('tipo')}>
                <option>Sangue total</option>
                <option>Plaquetas</option>
                <option>Plasma</option>
                <option>Comparecimento</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Hemocentro / Posto</label>
            <select value={form.hemocentro} onChange={onChange('hemocentro')}>
              {HEMOCENTROS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-dark">
              Gerar Declaração
            </button>
          </div>
        </form>
      </div>

      {doc ? (
        <div className="declaracao-preview">
          <div className="declaracao-documento" id="declaracao-documento">
            <div className="decl-header">
              <div>
                <h3>HEMOBANCO</h3>
                <p className="decl-sub">Rede Metropolitana de São Paulo — RMSP</p>
                <p className="decl-sub">Sistema unificado de doadores de sangue e hemocomponentes</p>
              </div>
            </div>
            <hr className="decl-line" />
            <h4 className="decl-title">DECLARAÇÃO DE DOAÇÃO / COMPARECIMENTO</h4>
            <p className="decl-protocolo">
              Protocolo: <strong>{doc.protocolo}</strong>
            </p>
            <div className="decl-body">
              <p>Declaramos, para os devidos fins, que o(a) Sr(a).</p>
              <p className="decl-destaque">{doc.nome}</p>
              <p>
                portador(a) do CPF nº <strong>{doc.cpf}</strong>,
              </p>
              <p>
                compareceu e realizou <strong>{tipoTexto}</strong>
              </p>
              <p>
                na data de <strong>{formatDate(doc.data)}</strong>,
              </p>
              <p>
                no estabelecimento <strong>{doc.hemocentro}</strong>.
              </p>
              <p className="decl-texto-final">
                Esta declaração é emitida pelo sistema Hemobanco e serve como comprovante oficial de
                comparecimento/doação junto à rede de hemocentros da Região Metropolitana de São
                Paulo.
              </p>
            </div>
            <div className="decl-footer">
              <p>
                Documento emitido em <strong>{doc.emissao}</strong>
              </p>
              <div className="decl-assinatura">
                <div className="decl-linha-assinatura" />
                <p>Hemobanco — Rede RMSP</p>
                <p className="decl-sub">Documento gerado eletronicamente</p>
              </div>
              <p className="decl-rodape">
                Sistema Hemobanco • Região Metropolitana de São Paulo • 39 Municípios
              </p>
            </div>
          </div>
          <div className="form-actions mt-20 no-print">
            <button type="button" className="btn btn-dark" onClick={imprimir}>
              🖨 Imprimir / Salvar PDF
            </button>
            <button type="button" className="btn btn-outline" style={{ marginLeft: 10 }} onClick={baixar}>
              ⬇ Baixar declaração
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
