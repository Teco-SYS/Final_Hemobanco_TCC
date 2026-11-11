import { useState } from 'react'
import { funcionariosApi, instituicoesApi } from '../lib/api'
import { setUser } from '../lib/storage'
import { maskCpf } from '../lib/utils'

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('empresa')
  const [email, setEmail] = useState('')
  const [senhaEmp, setSenhaEmp] = useState('')
  const [matricula, setMatricula] = useState('')
  const [senhaColab, setSenhaColab] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submitEmpresa(e) {
    e.preventDefault()
    setError('')
    if (!email || !senhaEmp) {
      setError('Preencha todos os campos.')
      return
    }
    setLoading(true)
    try {
      // tenta associar e-mail a uma instituição do banco (opcional)
      let instituicao = null
      try {
        const lista = await instituicoesApi.listar()
        instituicao = (lista || []).find(
          (i) => (i.email || '').toLowerCase() === email.trim().toLowerCase()
        )
      } catch {
        // backend offline: ainda permite entrar no front
      }
      const user = {
        tipo: 'empresa',
        nome: instituicao?.nome || 'Operador Hemocentro',
        email,
        instituicao_id: instituicao?.id || null,
      }
      setUser(user)
      onLogin(user)
    } finally {
      setLoading(false)
    }
  }

  async function submitColaborador(e) {
    e.preventDefault()
    setError('')
    if (!matricula || !senhaColab) {
      setError('Preencha matrícula e senha.')
      return
    }
    setLoading(true)
    try {
      const lista = await funcionariosApi.listar()
      const func = (lista || []).find(
        (f) => String(f.matricula).toUpperCase() === matricula.trim().toUpperCase()
      )
      if (!func) {
        setError('Matrícula não encontrada no banco. Ex.: FUNC-0001')
        return
      }
      const user = {
        tipo: 'colaborador',
        nome: func.nome,
        matricula: func.matricula,
        funcionario_id: func.id,
        instituicao_id: func.instituicao_id,
      }
      setUser(user)
      onLogin(user)
    } catch (err) {
      setError(`Não foi possível validar matrícula: ${err.message}. Suba a API na porta 3000.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-visual">
          <img className="login-visual-img" src={"/img/Banner doação.png"} alt="Hemobanco" />
          <div className="login-visual-overlay" />
        </div>

        <div className="login-panel">
          <div className="login-header">
            <div className="logo">
              <span className="i i-cross logo-icon" />
              <h1>Hemobanco</h1>
            </div>
            <p>Sistema unificado de informações de doadores de sangue e hemocomponentes</p>
          </div>

          {error ? <div className="alert alert-error show">{error}</div> : null}

          <div className="login-tabs">
            <div
              className={`login-tab ${tab === 'empresa' ? 'active' : ''}`}
              onClick={() => { setTab('empresa'); setError('') }}
            >
              Hemocentro
            </div>
            <div
              className={`login-tab ${tab === 'colaborador' ? 'active' : ''}`}
              onClick={() => { setTab('colaborador'); setError('') }}
            >
              Colaborador
            </div>
          </div>

          {tab === 'empresa' ? (
            <form className="login-form active" onSubmit={submitEmpresa}>
              <div className="form-group">
                <label htmlFor="empresa-email">E-mail institucional</label>
                <input
                  type="email"
                  id="empresa-email"
                  placeholder="contato@hemocentroeste.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="empresa-senha">Senha</label>
                <input
                  type="password"
                  id="empresa-senha"
                  placeholder="••••••••"
                  value={senhaEmp}
                  onChange={(e) => setSenhaEmp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar como Hemocentro'}
              </button>
            </form>
          ) : (
            <form className="login-form active" onSubmit={submitColaborador}>
              <div className="form-group">
                <label htmlFor="colab-matricula">Matrícula do funcionário</label>
                <input
                  type="text"
                  id="colab-matricula"
                  placeholder="FUNC-0001"
                  value={matricula}
                  onChange={(e) => setMatricula(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="colab-senha">Senha</label>
                <input
                  type="password"
                  id="colab-senha"
                  placeholder="••••••••"
                  value={senhaColab}
                  onChange={(e) => setSenhaColab(e.target.value)}
                  required
                />
              </div>
              <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
                Use uma matrícula do seed: FUNC-0001, FUNC-0002, FUNC-0003 ou FUNC-0004
              </p>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Validando...' : 'Entrar como Colaborador'}
              </button>
            </form>
          )}

          <div className="login-footer">Região Metropolitana de São Paulo • 39 Municípios</div>
        </div>
      </div>
    </div>
  )
}
