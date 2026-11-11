import { useEffect, useMemo, useState } from 'react'
import { doadoresApi, situacoesApi, tiposBloqueioApi } from '../lib/api'
import { digits, formatDate, maskCpf, todayIso } from '../lib/utils'

export default function DoadoresBloqueados() {
  const [situacoes, setSituacoes] = useState([])
  const [doadores, setDoadores] = useState([])
  const [tiposBloqueio, setTiposBloqueio] = useState([])
  const [query, setQuery] = useState({ cpf: '', nome: '', motivo: '' })
  const [applied, setApplied] = useState({ cpf: '', nome: '', motivo: '' })
  const [form, setForm] = useState({
    doador_id: '',
    tipo_bloqueio_id: '',
    motivo: '',
    data_limite: '',
    descricao: 'Bloqueado temporariamente',
  })
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  async function carregar() {
    const [s, d, t] = await Promise.all([
      situacoesApi.listar(),
      doadoresApi.listar(),
      tiposBloqueioApi.listar(),
    ])
    setSituacoes(s || [])
    setDoadores(d || [])
    setTiposBloqueio(t || [])
  }

  useEffect(() => {
    carregar().catch((e) =>
      setAlert({ kind: 'error', text: `API: ${e.message}. Suba o backend na porta 3000.` })
    )
  }, [])

  const bloqueios = useMemo(
    () => (situacoes || []).filter((s) => s.tipo_bloqueio_id != null),
    [situacoes]
  )

  const filtrados = useMemo(() => {
    const cpf = digits(applied.cpf)
    const nome = applied.nome.trim().toLowerCase()
    const motivo = applied.motivo.trim().toLowerCase()
    return bloqueios.filter((s) => {
      const doador = doadores.find((d) => d.id === s.doador_id)
      if (cpf && !digits(doador?.cpf || '').includes(cpf)) return false
      if (nome && !(doador?.nome || '').toLowerCase().includes(nome)) return false
      if (motivo && !(s.motivo || s.descricao || '').toLowerCase().includes(motivo)) return false
      return true
    })
  }, [bloqueios, doadores, applied])

  function onForm(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function submitAdd(e) {
    e.preventDefault()
    setAlert(null)
    if (!form.doador_id || !form.tipo_bloqueio_id || !form.motivo) {
      setAlert({ kind: 'error', text: 'Selecione doador, tipo de bloqueio e informe o motivo.' })
      return
    }
    setLoading(true)
    try {
      await situacoesApi.criar({
        descricao: form.descricao || 'Bloqueado temporariamente',
        tipo_bloqueio_id: Number(form.tipo_bloqueio_id),
        motivo: form.motivo.trim(),
        data_limite: form.data_limite || null,
        doador_id: Number(form.doador_id),
      })
      await carregar()
      setForm({
        doador_id: '',
        tipo_bloqueio_id: '',
        motivo: '',
        data_limite: '',
        descricao: 'Bloqueado temporariamente',
      })
      setAlert({ kind: 'success', text: 'Bloqueio registrado no banco (tabela situacoes).' })
    } catch (err) {
      setAlert({ kind: 'error', text: err.message || 'Erro ao bloquear doador.' })
    } finally {
      setLoading(false)
    }
  }

  async function remover(id) {
    try {
      await situacoesApi.deletar(id)
      await carregar()
      setAlert({ kind: 'success', text: 'Bloqueio removido.' })
    } catch (err) {
      setAlert({ kind: 'error', text: err.message })
    }
  }

  const doadorLabel = (id) => {
    const d = doadores.find((x) => x.id === id)
    return d ? `${d.nome} (${d.cpf})` : `Doador #${id}`
  }
  const tipoLabel = (id) => tiposBloqueio.find((t) => t.id === id)?.descricao || id

  return (
    <section className="page-section">
      <h2 className="page-title">Doadores bloqueados</h2>
      {alert ? <div className={`alert alert-${alert.kind} show`}>{alert.text}</div> : null}

      <div className="form-container bloqueio-card">
        <h3 className="section-subtitle"><span className="i i-plus" /> Adicionar bloqueio (situações)</h3>
        <form onSubmit={submitAdd}>
          <div className="form-group">
            <label>Doador *</label>
            <select value={form.doador_id} onChange={onForm('doador_id')} required>
              <option value="">Selecione...</option>
              {doadores.map((d) => (
                <option key={d.id} value={d.id}>{d.nome} — {d.cpf}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo de bloqueio *</label>
              <select value={form.tipo_bloqueio_id} onChange={onForm('tipo_bloqueio_id')} required>
                <option value="">Selecione...</option>
                {tiposBloqueio.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.descricao}{t.prazo_dias != null ? ` (${t.prazo_dias} dias)` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Data limite</label>
              <input type="date" value={form.data_limite} onChange={onForm('data_limite')} />
            </div>
          </div>
          <div className="form-group">
            <label>Motivo *</label>
            <input value={form.motivo} onChange={onForm('motivo')} required />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar bloqueio'}
            </button>
          </div>
        </form>
      </div>

      <div className="form-container bloqueio-card" style={{ marginTop: 20 }}>
        <h3 className="section-subtitle"><span className="i i-search" /> Pesquisar</h3>
        <form onSubmit={(e) => { e.preventDefault(); setApplied(query) }}>
          <div className="form-row">
            <div className="form-group">
              <label>CPF</label>
              <input value={query.cpf} onChange={(e) => setQuery({ ...query, cpf: maskCpf(e.target.value) })} />
            </div>
            <div className="form-group">
              <label>Nome</label>
              <input value={query.nome} onChange={(e) => setQuery({ ...query, nome: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Motivo</label>
            <input value={query.motivo} onChange={(e) => setQuery({ ...query, motivo: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-dark">Pesquisar</button>
            <button type="button" className="btn btn-outline" style={{ marginLeft: 10 }}
              onClick={() => { setQuery({ cpf: '', nome: '', motivo: '' }); setApplied({ cpf: '', nome: '', motivo: '' }) }}>
              Limpar
            </button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Doador</th>
              <th>Tipo bloqueio</th>
              <th>Motivo</th>
              <th>Data limite</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr><td colSpan={5} className="text-center">Nenhum bloqueio encontrado.</td></tr>
            ) : (
              filtrados.map((s) => (
                <tr key={s.id}>
                  <td>{doadorLabel(s.doador_id)}</td>
                  <td><span className="badge-motivo">{tipoLabel(s.tipo_bloqueio_id)}</span></td>
                  <td>{s.motivo || s.descricao}</td>
                  <td>{s.data_limite ? formatDate(s.data_limite) : 'Indeterminado'}</td>
                  <td>
                    <button type="button" className="btn-remover" title="Remover" onClick={() => remover(s.id)}>
                      <span className="i i-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
