import { useMemo, useState } from 'react'
import { getBloqueados, setBloqueados, HEMOCENTROS } from '../lib/storage'
import { digits, formatDate, maskCpf, todayIso, uid } from '../lib/utils'

const emptyAdd = {
  cpf: '',
  rg: '',
  nome: '',
  motivo: '',
  dataBloqueio: todayIso(),
  periodo: '12 meses',
  ultimaDoacao: '',
  hemocentro: HEMOCENTROS[0],
}

export default function DoadoresBloqueados() {
  const [lista, setLista] = useState(() => getBloqueados())
  const [form, setForm] = useState(emptyAdd)
  const [query, setQuery] = useState({ cpf: '', nome: '', motivo: '' })
  const [applied, setApplied] = useState({ cpf: '', nome: '', motivo: '' })
  const [alert, setAlert] = useState(null)

  const filtered = useMemo(() => {
    const cpf = digits(applied.cpf)
    const nome = applied.nome.trim().toLowerCase()
    const motivo = applied.motivo.trim().toLowerCase()
    return lista.filter((b) => {
      if (cpf && !digits(b.cpf).includes(cpf)) return false
      if (nome && !b.nome.toLowerCase().includes(nome)) return false
      if (motivo && !b.motivo.toLowerCase().includes(motivo)) return false
      return true
    })
  }, [lista, applied])

  function onAddChange(field) {
    return (e) => {
      const value = field === 'cpf' ? maskCpf(e.target.value) : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function submitAdd(e) {
    e.preventDefault()
    if (!form.cpf || !form.nome || !form.motivo || !form.dataBloqueio || !form.periodo) {
      setAlert({ kind: 'error', text: 'Preencha CPF, nome, motivo, data e período do bloqueio.' })
      return
    }
    if (lista.some((b) => digits(b.cpf) === digits(form.cpf))) {
      setAlert({ kind: 'error', text: 'Já existe um bloqueio para este CPF.' })
      return
    }
    const next = [{ ...form, id: uid() }, ...lista]
    setBloqueados(next)
    setLista(next)
    setForm({ ...emptyAdd, dataBloqueio: todayIso() })
    setAlert({ kind: 'success', text: 'Doador adicionado à lista de bloqueados.' })
  }

  function remover(id) {
    const next = lista.filter((b) => b.id !== id)
    setBloqueados(next)
    setLista(next)
    setAlert({ kind: 'success', text: 'Bloqueio removido.' })
  }

  return (
    <section className="page-section">
      <div className="content-logo">
      </div>
      <h2 className="page-title">Doadores bloqueados</h2>
      {alert ? <div className={`alert alert-${alert.kind} show`}>{alert.text}</div> : null}

      <div className="form-container bloqueio-card">
        <h3 className="section-subtitle">
          <span className="i i-cross" /> Adicionar doador bloqueado
        </h3>
        <form onSubmit={submitAdd}>
          <div className="form-row">
            <div className="form-group">
              <label>CPF *</label>
              <input value={form.cpf} onChange={onAddChange('cpf')} placeholder="000.000.000-00" required />
            </div>
            <div className="form-group">
              <label>RG</label>
              <input value={form.rg} onChange={onAddChange('rg')} placeholder="00.000.000-0" />
            </div>
          </div>
          <div className="form-group">
            <label>Nome completo *</label>
            <input value={form.nome} onChange={onAddChange('nome')} required />
          </div>
          <div className="form-group">
            <label>Motivo do bloqueio *</label>
            <input
              value={form.motivo}
              onChange={onAddChange('motivo')}
              placeholder="Ex: Tatuagem recente, Anemia..."
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Data do bloqueio *</label>
              <input type="date" value={form.dataBloqueio} onChange={onAddChange('dataBloqueio')} required />
            </div>
            <div className="form-group">
              <label>Período do bloqueio *</label>
              <select value={form.periodo} onChange={onAddChange('periodo')}>
                <option>3 meses</option>
                <option>6 meses</option>
                <option>12 meses</option>
                <option>24 meses</option>
                <option>Indeterminado</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Última doação</label>
              <input type="date" value={form.ultimaDoacao} onChange={onAddChange('ultimaDoacao')} />
            </div>
            <div className="form-group">
              <label>Hemocentro (RMSP)</label>
              <select value={form.hemocentro} onChange={onAddChange('hemocentro')}>
                {HEMOCENTROS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-dark">
              Adicionar à lista de bloqueados
            </button>
          </div>
        </form>
      </div>

      <div className="form-container bloqueio-card" style={{ marginTop: 20 }}>
        <h3 className="section-subtitle">
          <span className="i i-search" /> Pesquisar
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setApplied(query)
          }}
        >
          <div className="form-row">
            <div className="form-group">
              <label>CPF</label>
              <input
                value={query.cpf}
                onChange={(e) => setQuery({ ...query, cpf: maskCpf(e.target.value) })}
                placeholder="000.000.000-00"
              />
            </div>
            <div className="form-group">
              <label>Nome</label>
              <input
                value={query.nome}
                onChange={(e) => setQuery({ ...query, nome: e.target.value })}
                placeholder="Nome para consulta"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Motivo</label>
            <input
              value={query.motivo}
              onChange={(e) => setQuery({ ...query, motivo: e.target.value })}
              placeholder="Tatuagem, anemia..."
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-dark">
              Pesquisar
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ marginLeft: 10 }}
              onClick={() => {
                setQuery({ cpf: '', nome: '', motivo: '' })
                setApplied({ cpf: '', nome: '', motivo: '' })
              }}
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>CPF</th>
              <th>Nome</th>
              <th>Motivo do Impedimento</th>
              <th>Período</th>
              <th>Hemocentro (RMSP)</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Nenhum doador bloqueado encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id}>
                  <td>{b.cpf}</td>
                  <td>{b.nome}</td>
                  <td>
                    <span className="badge-motivo">{b.motivo}</span>
                  </td>
                  <td>
                    {b.periodo}
                    {b.dataBloqueio ? (
                      <>
                        <br />
                        <small style={{ color: '#888' }}>desde {formatDate(b.dataBloqueio)}</small>
                      </>
                    ) : null}
                  </td>
                  <td>{b.hemocentro || '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-remover"
                      title="Remover bloqueio"
                      onClick={() => remover(b.id)}
                    >
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
