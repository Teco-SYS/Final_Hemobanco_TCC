/**
 * Sessão do usuário logado (frontend).
 * Dados de negócio (doadores, doações, bloqueios) vêm da API/SQLite — ver api.js
 */

const USER_KEY = 'hemobanco_user'

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export function setUser(user) {
  if (!user) {
    localStorage.removeItem(USER_KEY)
    return
  }
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** Seed agora é responsabilidade do backend (knex seeds) */
export function ensureSeed() {
  // no-op
}
