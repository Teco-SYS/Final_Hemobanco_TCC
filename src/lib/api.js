/**
 * Cliente HTTP da API Hemobanco (Express + SQLite).
 * Backend padrão: http://localhost:3000
 *
 * Campos alinhados ao banco:
 * - doadores: cpf (11 dígitos), nome, sexo (M|F), tipo_sanguineo_id, endereco_id
 * - enderecos: logradouro, numero, complemento, bairro, cidade, estado, cep
 * - doacoes: data_doacao, doador_id, funcionario_id, tipo_doacao_id, situacao_id?
 * - situacoes (bloqueios): descricao, tipo_bloqueio_id, motivo, data_limite, doador_id
 */

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000' : 'http://localhost:3000')

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (res.status === 204) return null

  let data = null
  const text = await res.text()
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { error: text || res.statusText }
  }

  if (!res.ok) {
    const msg = data?.error || data?.message || `Erro ${res.status}`
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export const api = {
  url: API_URL,
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
}

// ---- Recursos da API ----

export const doadoresApi = {
  listar: () => api.get('/doadores'),
  buscar: (id) => api.get(`/doadores/${id}`),
  criar: (dados) => api.post('/doadores', dados),
  atualizar: (id, dados) => api.put(`/doadores/${id}`, dados),
  deletar: (id) => api.del(`/doadores/${id}`),
}

export const enderecosApi = {
  listar: () => api.get('/enderecos'),
  criar: (dados) => api.post('/enderecos', dados),
  atualizar: (id, dados) => api.put(`/enderecos/${id}`, dados),
  deletar: (id) => api.del(`/enderecos/${id}`),
}

export const doacoesApi = {
  listar: () => api.get('/doacoes'),
  criar: (dados) => api.post('/doacoes', dados),
  deletar: (id) => api.del(`/doacoes/${id}`),
}

export const situacoesApi = {
  listar: () => api.get('/situacoes'),
  criar: (dados) => api.post('/situacoes', dados),
  deletar: (id) => api.del(`/situacoes/${id}`),
}

export const tiposSanguineosApi = {
  listar: () => api.get('/tipos-sanguineos'),
}

export const tiposDoacaoApi = {
  listar: () => api.get('/tipos-doacao'),
}

export const tiposBloqueioApi = {
  listar: () => api.get('/tipos-bloqueio'),
}

export const funcionariosApi = {
  listar: () => api.get('/funcionarios'),
}

export const instituicoesApi = {
  listar: () => api.get('/instituicoes'),
}
