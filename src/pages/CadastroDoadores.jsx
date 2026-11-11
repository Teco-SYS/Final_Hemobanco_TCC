import { useEffect, useState } from 'react'
import { doadoresApi, enderecosApi, tiposSanguineosApi } from '../lib/api'
import { digits, maskCpf } from '../lib/utils'

const empty = {
  cpf: '',
  nome: '',
  sexo: 'F',
  tipo_sanguineo_id: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: 'SP',
  cep: '',
}

export default function CadastroDoadores() {
  const [form, setForm] = useState(empty)
  const [tipos, setTipos] = useState([])
  const [lista, setLista] = useState([])
  const [alert, setAlert] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([tiposSanguineosApi.listar(), doadoresApi.listar()])
      .then(([t, d]) => {
        setTipos(t || [])
        setLista(d || [])
      })
      .catch((e) => setAlert({ kind: 'error', text: `API: ${e.message}. Suba o backend (porta 3000).` }))
  }, [])

  function onChange(field) {
    return (e) => {
      let value = e.target.value
      if (field === 'cpf') value = maskCpf(value)
      if (field === 'cep') value = value.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
      if (field === 'estado') value = value.toUpperCase().slice(0, 2)
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  async function submit(e) {
    e.preventDefault()
    setAlert(null)

    const cpfDigits = digits(form.cpf)
    if (cpfDigits.length !== 11) {
      setAlert({ kind: 'error', text: 'CPF deve ter 11 dígitos.' })
      return
    }
    if (!form.nome || !form.tipo_sanguineo_id || !form.logradouro || !form.bairro || !form.cidade || !form.estado || !form.cep) {
      setAlert({ kind: 'error', text: 'Preencha nome, tipo sanguíneo e endereço completo (logradouro, bairro, cidade, UF, CEP).' })
      return
    }

    setLoading(true)
    try {
      const endereco = await enderecosApi.criar({
        logradouro: form.logradouro,
        numero: form.numero || null,
        complemento: form.complemento || null,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        cep: form.cep,
      })

      await doadoresApi.criar({
        cpf: cpfDigits,
        nome: form.nome.trim(),
        sexo: form.sexo,
        tipo_sanguineo_id: Number(form.tipo_sanguineo_id),
        endereco_id: endereco.id,
      })

      const atualizada = await doadoresApi.listar()
      setLista(atualizada || [])
      setForm(empty)
      setAlert({ kind: 'success', text: 'Doador cadastrado no banco com sucesso!' })
    } catch (err) {
      setAlert({ kind: 'error', text: err.message || 'Erro ao cadastrar doador.' })
    } finally {
      setLoading(false)
    }
  }

  const tipoLabel = (id) => tipos.find((t) => t.id === id)?.descricao || id

  return (
    <section className="page-section">
      <h2 className="page-title">Cadastro de doadores</h2>
      {alert ? <div className={`alert alert-${alert.kind} show`}>{alert.text}</div> : null}

      <div className="form-container">
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>CPF *</label>
              <input value={form.cpf} onChange={onChange('cpf')} placeholder="000.000.000-00" required />
            </div>
            <div className="form-group">
              <label>Sexo *</label>
              <select value={form.sexo} onChange={onChange('sexo')} required>
                <option value="F">Feminino (F)</option>
                <option value="M">Masculino (M)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Nome completo *</label>
            <input value={form.nome} onChange={onChange('nome')} required />
          </div>

          <div className="form-group">
            <label>Tipo sanguíneo *</label>
            <select value={form.tipo_sanguineo_id} onChange={onChange('tipo_sanguineo_id')} required>
              <option value="">Selecione...</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>{t.descricao}</option>
              ))}
            </select>
          </div>

          <h3 className="section-subtitle" style={{ marginTop: 12 }}>Endereço</h3>
          <div className="form-group">
            <label>Logradouro *</label>
            <input value={form.logradouro} onChange={onChange('logradouro')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Número</label>
              <input value={form.numero} onChange={onChange('numero')} />
            </div>
            <div className="form-group">
              <label>Complemento</label>
              <input value={form.complemento} onChange={onChange('complemento')} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Bairro *</label>
              <input value={form.bairro} onChange={onChange('bairro')} required />
            </div>
            <div className="form-group">
              <label>Cidade *</label>
              <input value={form.cidade} onChange={onChange('cidade')} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>UF *</label>
              <input value={form.estado} onChange={onChange('estado')} maxLength={2} required />
            </div>
            <div className="form-group">
              <label>CEP *</label>
              <input value={form.cep} onChange={onChange('cep')} placeholder="00000-000" required />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-dark" disabled={loading}>
              {loading ? 'Salvando...' : 'Cadastrar no banco'}
            </button>
          </div>
        </form>
      </div>

      <h3 className="page-title" style={{ marginTop: 32, fontSize: 18 }}>Doadores no banco</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>CPF</th>
              <th>Nome</th>
              <th>Sexo</th>
              <th>Tipo sanguíneo</th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 ? (
              <tr><td colSpan={5} className="text-center">Nenhum doador cadastrado.</td></tr>
            ) : (
              lista.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.cpf}</td>
                  <td>{d.nome}</td>
                  <td>{d.sexo}</td>
                  <td>{tipoLabel(d.tipo_sanguineo_id)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
