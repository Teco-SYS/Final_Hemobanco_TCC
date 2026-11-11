# Hemobanco (React) + API SQLite

Frontend React/Vite integrado à API Express + SQLite do TCC.

## Subir o backend (obrigatório)

```bash
cd hemobanco-tcc-main   # pasta da API
npm install
npx knex migrate:latest
npx knex seed:run
npm run dev
# API em http://localhost:3000
```

## Subir o frontend

```bash
cd hemobanco-react-app
npm install
npm run dev
# http://localhost:5173
```

## Login

| Aba | Como entrar |
|-----|-------------|
| **Hemocentro** | qualquer e-mail/senha (opcionalmente e-mail de uma instituição do seed) |
| **Colaborador** | matrícula do seed: `FUNC-0001` … `FUNC-0004` (+ qualquer senha) |

Colaborador é necessário para **registrar doações** (`funcionario_id`).

## Alinhamento com o banco

| Tela front | Tabelas API |
|------------|-------------|
| Cadastro de doadores | `enderecos` + `doadores` (+ `tipos_sanguineos`) |
| Cadastro de doação | `doacoes` (valida bloqueio e intervalo no backend) |
| Doadores bloqueados | `situacoes` com `tipo_bloqueio_id` |
| Login colaborador | `funcionarios` por `matricula` |

CPF no banco: **11 dígitos sem máscara**. Tipo sanguíneo: `A+`, `A-`, etc. (não separado de RH).
