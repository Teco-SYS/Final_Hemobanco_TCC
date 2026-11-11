import { useEffect, useState } from 'react'
import { doacoesApi, doadoresApi, tiposDoacaoApi } from '../lib/api'
import { getUser } from '../lib/storage'
import { digits, formatDate, maskCpf, todayIso } from '../lib/utils'

export default function CadastroDoacao() {
  const user = getUser()
  const [doadores, setDoadores] = useState([])
  const [tipos, setTipos] = useState([])
  const [doacoes, setDoacoes] = useState([])
  const [form, setForm] = useState({
    cpf: '',
    doador_id: '',
    data_doacao: todayIso(),
    tipo_doacao_id: '',
  })
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  async function carregar() {
    const [d, t, list] = await Promise.all([
      doadoresApi.listar(),
      tiposDoacaoApi.listar(),
      doacoesApi.listar(),
    ])
    setDoadores(d || [])
    setTipos(t || [])
    setDoacoes((list || []).slice().reverse())
  }

  useEffect(() => {
    carregar().catch((e) =>
      setAlert({ kind: 'error', text: `API: ${e.message}. Suba o backend na porta 3000.` })
    )
  }, [])

  function onChange(field) {
    return (e) => {
      let value = e.target.value
      if (field === 'cpf') value = maskCpf(value)
      setForm((f) => {
        const next = { ...f, [field]: value }
        if (field === 'cpf') {
          const found = doadores.find((d) => digits(d.cpf) === digits(value))
          next.doador_id = found ? String(found.id) : ''
        }
        if (field === 'doador_id') {
          const found = doadores.find((d) => String(d.id) === value)
          next.cpf = found ? maskCpf(found.cpf) : f.cpf
        }
        return next
      })
    }
  }

  async function submit(e) {
    e.preventDefault()
    setAlert(null)

    if (!form.doador_id || !form.data_doacao || !form.tipo_doacao_id) {
      setAlert({ kind: 'error', text: 'Selecione doador, data e tipo de doação.' })
      return
    }

    const funcionario_id = user?.funcionario_id
    if (!funcionario_id) {
      setAlert({
        kind: 'error',
        text: 'Faça login como Colaborador (matrícula, ex.: FUNC-0001) para registrar doações.',
      })
      return
    }

    setLoading(true)
    try {
      const data_doacao = form.data_doacao.includes('T')
        ? form.data_doacao
        : `${form.data_doacao}T10:00:00`

      await doacoesApi.criar({
        data_doacao,
        doador_id: Number(form.doador_id),
        funcionario_id: Number(funcionario_id),
        tipo_doacao_id: Number(form.tipo_doacao_id),
        situacao_id: null,
      })

      await carregar()
      setForm((f) => ({ ...f, cpf: '', doador_id: '', tipo_doacao_id: '' }))
      setAlert({ kind: 'success', text: 'Doação registrada no banco!' })
    } catch (err) {
      setAlert({ kind: 'error', text: err.message || 'Erro ao registrar doação.' })
    } finally {
      setLoading(false)
    }
  }

  const nomeDoador = (id) => doadores.find((d) => d.id === id)?.nome || id
  const tipoLabel = (id) => tipos.find((t) => t.id === id)?.descricao || id

  return (
    <section className="page-section">
      <h2 className="page-title">Cadastro de doação</h2>
      {alert ? <div className={`alert alert-${alert.kind} show`}>{alert.text}</div> : null}

      <div className="form-container">
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>CPF do doador</label>
              <input value={form.cpf} onChange={onChange('cpf')} placeholder="000.000.000-00" />
            </div>
            <div className="form-group">
              <label>Doador *</label>
              <select value={form.doador_id} onChange={onChange('doador_id')} required>
                <option value="">Selecione o doador...</option>
                {doadores.map((d) => (
                  <option key={d.id} value={d.id}>{d.nome} — CPF {d.cpf}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Data da doação *</label>
              <input type="date" value={form.data_doacao} onChange={onChange('data_doacao')} required />
            </div>
            <div className="form-group">
              <label>Tipo de doação *</label>
              <select value={form.tipo_doacao_id} onChange={onChange('tipo_doacao_id')} required>
                <option value="">Selecione...</option>
                {tipos.map((t) => (
                  <option key={t.id} value={t.id}>{t.descricao}</option>
                ))}
              </select>
            </div>
          </div>

          <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
            Funcionário logado: <strong>{user?.nome || '—'}</strong>
            {user?.funcionario_id ? ` (id ${user.funcionario_id})` : ' — login de colaborador necessário'}
          </p>

          <div className="form-actions">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? 'Salvando...' : 'Registrar doação'}
            </button>
          </div>
        </form>
      </div>

      <h3 className="page-title" style={{ marginTop: 32, fontSize: 18 }}>Últimas doações (banco)</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Doador</th>
              <th>Data</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {doacoes.length === 0 ? (
              <tr><td colSpan={4} className="text-center">Nenhuma doação registrada.</td></tr>
            ) : (
              doacoes.slice(0, 15).map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{nomeDoador(d.doador_id)}</td>
                  <td>{formatDate(String(d.data_doacao).slice(0, 10))}</td>
                  <td>{tipoLabel(d.tipo_doacao_id)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
