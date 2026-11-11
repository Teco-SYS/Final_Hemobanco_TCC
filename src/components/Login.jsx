import { useState } from 'react'
import { setUser } from '../lib/storage'
import { maskCpf } from '../lib/utils'


export default function Login({ onLogin }) {
  const [tab, setTab] = useState('empresa')
  const [email, setEmail] = useState('')
  const [senhaEmp, setSenhaEmp] = useState('')
  const [cpf, setCpf] = useState('')
  const [senhaDoa, setSenhaDoa] = useState('')
  const [error, setError] = useState('')

  function submitEmpresa(e) {
    e.preventDefault()
    if (!email || !senhaEmp) {
      setError('Preencha todos os campos.')
      return
    }
    const user = { tipo: 'empresa', nome: 'Operador RMSP', email }
    setUser(user)
    onLogin(user)
  }

  function submitDoador(e) {
    e.preventDefault()
    if (!cpf || !senhaDoa) {
      setError('Preencha todos os campos.')
      return
    }
    const user = { tipo: 'doador', nome: 'Doador', cpf }
    setUser(user)
    onLogin(user)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-visual">
          <img className="login-visual-img" src={"/img/Banner doação.png"} alt="Hemobanco" />
          <div className="login-visual-overlay">
            {/*<span className="i i-cross i-xl" />
            <h2>Hemobanco</h2>
            <p>Doação que salva vidas na Região Metropolitana de São Paulo</p>*/}
          </div>
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
              onClick={() => {
                setTab('empresa')
                setError('')
              }}
            >
              Hemocentro
            </div>
            <div
              className={`login-tab ${tab === 'doador' ? 'active' : ''}`}
              onClick={() => {
                setTab('doador')
                setError('')
              }}
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
                  placeholder="exemplo@hemocentro.org.br"
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
              <button type="submit" className="btn-primary">
                Entrar como Hemocentro
              </button>
            </form>
          ) : (
            <form className="login-form active" onSubmit={submitDoador}>
              <div className="form-group">
                <label htmlFor="doador-cpf">CPF</label>
                <input
                  type="text"
                  id="doador-cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(maskCpf(e.target.value))}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="doador-senha">Senha</label>
                <input
                  type="password"
                  id="doador-senha"
                  placeholder="••••••••"
                  value={senhaDoa}
                  onChange={(e) => setSenhaDoa(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Entrar como Colaborador
              </button>
            </form>
          )}

          <div className="login-footer">Protótipo de sistema</div>
        </div>
      </div>
    </div>
  )
}
