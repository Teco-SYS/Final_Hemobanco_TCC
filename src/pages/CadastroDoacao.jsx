import { useMemo, useState } from 'react'
import { getBloqueados, getDoacoes, setDoacoes, HEMOCENTROS } from '../lib/storage'
import { digits, formatDate, maskCpf, todayIso, uid } from '../lib/utils'

const empty = {
  cpf: '',
  nome: '',
  data: todayIso(),
  tipo: '',
  volume: '450',
  hemocentro: HEMOCENTROS[0],
  observacoes: '',
}

export default function CadastroDoacao() {
  const [form, setForm] = useState(empty)
  const [alert, setAlert] = useState(null)
  const [doacoes, setLista] = useState(() => getDoacoes())

  const recent = useMemo(() => [...doacoes].reverse().slice(0, 10), [doacoes])

  function onChange(field) {
    return (e) => {
      const value = field === 'cpf' ? maskCpf(e.target.value) : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function submit(e) {
    e.preventDefault()
    if (!form.cpf || !form.data || !form.tipo) {
      setAlert({ kind: 'error', text: 'Preencha CPF, data e tipo de doação.' })
      return
    }
    const bloqueado = getBloqueados().find((b) => digits(b.cpf) === digits(form.cpf))
    if (bloqueado) {
      setAlert({
        kind: 'error',
        text: `Doador bloqueado: ${bloqueado.motivo}. Período: ${bloqueado.periodo}`,
      })
      return
    }
    const next = [...doacoes, { ...form, id: uid() }]
    setDoacoes(next)
    setLista(next)
    setForm(empty)
    setAlert({ kind: 'success', text: 'Doação registrada com sucesso!' })
  }

  return (
    <section className="page-section">
      <div className="content-logo">
      </div>
      <h2 className="page-title">Cadastro de doação</h2>
      {alert ? <div className={`alert alert-${alert.kind} show`}>{alert.text}</div> : null}

      <div className="form-container">
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>CPF do doador *</label>
              <input value={form.cpf} onChange={onChange('cpf')} placeholder="000.000.000-00" required />
            </div>
            <div className="form-group">
              <label>Nome do doador</label>
              <input value={form.nome} onChange={onChange('nome')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data da doação *</label>
              <input type="date" value={form.data} onChange={onChange('data')} required />
            </div>
            <div className="form-group">
              <label>Tipo de doação *</label>
              <select value={form.tipo} onChange={onChange('tipo')} required>
                <option value="">Selecione...</option>
                <option>Sangue total</option>
                <option>Plaquetas</option>
                <option>Plasma</option>
                <option>Dupla-eritrócitos</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Volume (ml)</label>
              <input type="number" min={100} max={600} value={form.volume} onChange={onChange('volume')} />
            </div>
            <div className="form-group">
              <label>Hemocentro</label>
              <select value={form.hemocentro} onChange={onChange('hemocentro')}>
                {HEMOCENTROS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Observações</label>
            <textarea rows={3} value={form.observacoes} onChange={onChange('observacoes')} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-dark">
              Registrar Doação
            </button>
          </div>
        </form>
      </div>

      <h3 className="page-title" style={{ marginTop: 40, fontSize: 18 }}>
        Últimas doações registradas
      </h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>CPF</th>
              <th>Nome</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Hemocentro</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Nenhuma doação registrada ainda.
                </td>
              </tr>
            ) : (
              recent.map((d) => (
                <tr key={d.id}>
                  <td>{d.cpf}</td>
                  <td>{d.nome || '—'}</td>
                  <td>{formatDate(d.data)}</td>
                  <td>{d.tipo}</td>
                  <td>{d.hemocentro}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
