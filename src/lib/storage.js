const KEYS = {
  user: 'hemobanco_user',
  doadores: 'hemobanco_doadores',
  doacoes: 'hemobanco_doacoes',
  bloqueados: 'hemobanco_bloqueados',
  declaracoes: 'hemobanco_declaracoes',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const SEED_BLOQUEADOS = [
  {
    id: 'seed-1',
    cpf: '456.789.123-44',
    rg: '',
    nome: 'Rodrigo Almeida Pires',
    motivo: 'Tatuagem recente realizada há menos de 12 meses',
    dataBloqueio: '2024-02-15',
    periodo: '12 meses (Até 15/02/2025)',
    hemocentro: 'Fundação Pró-Sangue - Posto Clínicas',
    ultimaDoacao: '',
  },
  {
    id: 'seed-2',
    cpf: '789.123.456-55',
    rg: '',
    nome: 'Juliana Ferreira Lima',
    motivo: 'Tratamento com medicação contraindicada (Isotretinoína)',
    dataBloqueio: '2024-03-01',
    periodo: '6 meses (Até 01/09/2024)',
    hemocentro: 'Hemocentro Regional de Osasco',
    ultimaDoacao: '',
  },
  {
    id: 'seed-3',
    cpf: '321.654.987-22',
    rg: '',
    nome: 'Lucas Mendes de Souza',
    motivo: 'Viagem recente para área endêmica de malária',
    dataBloqueio: '2024-04-10',
    periodo: '12 meses (Até 10/04/2025)',
    hemocentro: 'Banco de Sangue de Guarulhos',
    ultimaDoacao: '',
  },
]

export function ensureSeed() {
  if (!localStorage.getItem(KEYS.bloqueados)) {
    write(KEYS.bloqueados, SEED_BLOQUEADOS)
  }
  if (!localStorage.getItem(KEYS.doadores)) write(KEYS.doadores, [])
  if (!localStorage.getItem(KEYS.doacoes)) write(KEYS.doacoes, [])
}

export function getUser() {
  return read(KEYS.user, null)
}

export function setUser(user) {
  if (!user) {
    localStorage.removeItem(KEYS.user)
    return
  }
  write(KEYS.user, user)
}

export function getDoadores() {
  return read(KEYS.doadores, [])
}

export function setDoadores(data) {
  write(KEYS.doadores, data)
}

export function getDoacoes() {
  return read(KEYS.doacoes, [])
}

export function setDoacoes(data) {
  write(KEYS.doacoes, data)
}

export function getBloqueados() {
  const list = read(KEYS.bloqueados, null)
  if (!list) {
    write(KEYS.bloqueados, SEED_BLOQUEADOS)
    return SEED_BLOQUEADOS
  }
  return list
}

export function setBloqueados(data) {
  write(KEYS.bloqueados, data)
}

export function pushDeclaracao(item) {
  const hist = read(KEYS.declaracoes, [])
  hist.unshift(item)
  write(KEYS.declaracoes, hist.slice(0, 50))
}

export const HEMOCENTROS = [
  'Fundação Pró-Sangue - Posto Clínicas',
  'Fundação Pró-Sangue - Dante Pazzanese',
  'Hemocentro Regional de Osasco',
  'Hemocentro do ABC',
  'Hemocentro de Guarulhos',
  'Hemocentro de São Bernardo',
  'Banco de Sangue de Guarulhos',
]

export const MUNICIPIOS = [
  'São Paulo (Capital)',
  'Guarulhos',
  'Osasco',
  'Santo André',
  'São Bernardo do Campo',
  'São Caetano do Sul',
  'Diadema',
  'Mauá',
  'Barueri',
  'Outro município da RMSP',
]

export const NOTIFICACOES = [
  'Fundação Pró-Sangue (Posto Clínicas - SP): Estoque crítico de sangue O- e plaquetas.',
  'Hemocentro Regional de Osasco: Campanha emergencial para captação de sangue tipo A+.',
  'Hemocentro do ABC (Santo André): Convocação de doadores cadastrados para cirurgias cardíacas.',
  'Hemocentro de Guarulhos: Atualização do protocolo sanitário Anvisa para triagem clínica.',
  'Fundação Pró-Sangue (Posto Dante Pazzanese): Atendimento prioritário aos sábados das 8h às 16h.',
  'Hemocentro Regional de São Bernardo do Campo: Alerta de baixo estoque de hemocomponentes B-.',
  'Hospital São Paulo (UNIFESP): Campanha universitária de incentivo à primeira doação de sangue.',
  'Rede RMSP Hemobanco: Sincronização de 1.480 cadastros efetuada com sucesso entre 10 hemocentros.',
]
