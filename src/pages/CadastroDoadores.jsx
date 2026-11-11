import { useState } from 'react'
import { getDoadores, setDoadores, MUNICIPIOS } from '../lib/storage'
import { digits, maskCpf } from '../lib/utils'

const empty = {
  cpf: '',
  rg: '',
  nome: '',
  endereco: '',
  municipio: MUNICIPIOS[0],
  telefone: '',
  recado: '',
  email: '',
  tipoSanguineo: '',
  fatorRH: '',
}

export default function CadastroDoadores() {
  const [form, setForm] = useState(empty)
  const [alert, setAlert] = useState(null)

  function onChange(field) {
    return (e) => {
      const value = field === 'cpf' ? maskCpf(e.target.value) : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  function submit(e) {
    e.preventDefault()
    if (!form.cpf || !form.nome || !form.tipoSanguineo || !form.fatorRH) {
      setAlert({ kind: 'error', text: 'Preencha CPF, nome, tipo sanguíneo e fator RH.' })
      return
    }
    const lista = getDoadores()
    if (lista.some((d) => digits(d.cpf) === digits(form.cpf))) {
      setAlert({ kind: 'error', text: 'Já existe um doador cadastrado com este CPF.' })
      return
    }
    lista.push({
      ...form,
      dataCadastro: new Date().toLocaleDateString('pt-BR'),
    })
    setDoadores(lista)
    setForm(empty)
    setAlert({ kind: 'success', text: 'Doador cadastrado com sucesso!' })
  }

  return (
    <section className="page-section">
      <div className="content-logo">
      </div>
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
              <label>RG</label>
              <input value={form.rg} onChange={onChange('rg')} placeholder="00.000.000-0" />
            </div>
          </div>
          <div className="form-group">
            <label>Nome completo do doador *</label>
            <input value={form.nome} onChange={onChange('nome')} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Endereço</label>
              <input
                value={form.endereco}
                onChange={onChange('endereco')}
                placeholder="Logradouro, número e bairro"
              />
            </div>
            <div className="form-group">
              <label>Município</label>
              <select value={form.municipio} onChange={onChange('municipio')}>
                {MUNICIPIOS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Telefone</label>
              <input value={form.telefone} onChange={onChange('telefone')} placeholder="(11) 90000-0000" />
            </div>
            <div className="form-group">
              <label>Recado</label>
              <input value={form.recado} onChange={onChange('recado')} />
            </div>
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={form.email} onChange={onChange('email')} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Tipo sanguíneo *</label>
              <select value={form.tipoSanguineo} onChange={onChange('tipoSanguineo')} required>
                <option value="">Selecione...</option>
                <option>A</option>
                <option>B</option>
                <option>AB</option>
                <option>O</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fator RH *</label>
              <select value={form.fatorRH} onChange={onChange('fatorRH')} required>
                <option value="">Selecione...</option>
                <option value="+">Positivo (+)</option>
                <option value="-">Negativo (-)</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-dark">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
