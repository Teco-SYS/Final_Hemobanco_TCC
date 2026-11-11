# Hemobanco (React)

Sistema de hemocentro da RMSP feito com **React + Vite**.

## Como rodar

```bash
cd hemobanco-react-app
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (geralmente http://localhost:5173).

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  App.jsx                 # login + navegação
  components/
    Login.jsx             # tela de login (2 colunas)
    AppShell.jsx          # sidebar + layout
  pages/
    Painel.jsx
    CadastroDoadores.jsx
    CadastroDoacao.jsx
    DoadoresBloqueados.jsx
    Declaracoes.jsx
    Notificacoes.jsx
  lib/
    storage.js            # localStorage
    utils.js              # CPF, datas, protocolo
public/img/               # coloque Doando-sangue.png aqui
```

## Imagem do login

Coloque a imagem em:

```
public/img/Doando-sangue.png
```

## Funcionalidades

- Login empresa / doador
- Cadastro de doadores e doações
- Bloqueios (adicionar, pesquisar, remover)
- Geração de declaração com protocolo, impressão/PDF e download
- Notificações da rede RMSP

Dados ficam no `localStorage` do navegador.
