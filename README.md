### Waze dos Animais Abandonados 🐾

Aplicação web responsiva (web + mobile) para **mapear cães em situação de rua**, permitindo que qualquer pessoa registre um animal encontrado e que ONGs / protetores possam visualizar e organizar resgates.

---

### 1. Visão Geral (Resumo)

| Campo            | Descrição                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Nome**         | Waze dos Animais Abandonados                                                             |
| **Objetivo**     | Mapear, de forma colaborativa, cães em situação de rua para facilitar resgates e ajuda. |
| **Tipo**         | Aplicação Web Responsiva (SPA em React).                                                |
| **Público-alvo** | Pessoas que encontram animais na rua, ONGs, protetores independentes e adotantes.       |

---

### 2. Funcionalidades (MVP e Futuro)

| Funcionalidade                     | Descrição                                                                                                      | Status            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------- |
| **Mapa interativo**               | Exibe animais cadastrados em um mapa com **pins coloridos** por nível de urgência.                            | Planejado (MVP)   |
| **Níveis de urgência (🟢🟡🔴)**     | Classificação visual: saudável, precisa de atenção, urgente (ferido/doente).                                  | Planejado (MVP)   |
| **Registro de animal encontrado** | Formulário para enviar **foto**, **descrição**, **nível de urgência** e **localização** (via navegador/mapa). | Planejado (MVP)   |
| **Lista de animais próximos**     | Lista mostrando animais próximos à localização do usuário, com filtros simples.                               | Planejado         |
| **Layout responsivo**             | Interface desenhada para funcionar bem em **celulares e desktops** (mobile-first).                            | Planejado (MVP)   |
| **Login básico**                  | Diferenciar usuários comuns de ONGs/protetores.                                                               | Futuro            |
| **Marcar como resgatado**        | Atualizar status de um caso para resgatado/não encontrado.                                                    | Futuro            |
| **Comentários/atualizações**      | Permitir que usuários adicionem atualizações em cada caso.                                                    | Futuro            |

Detalhamento completo das funcionalidades: ver `docs/requisitos.md`.

---

### 3. Tecnologias e Arquitetura

| Camada               | Tecnologia / Ferramenta                                | Papel no projeto                                                                 |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Frontend Web**     | HTML5, CSS3, JavaScript                               | Estrutura, estilo e interatividade básica da aplicação.                          |
| **Framework Web**    | React                                                 | Construção da interface SPA, componentes reutilizáveis e estado do app.         |
| **Mapa**             | Leaflet **ou** Google Maps JavaScript API            | Exibição do mapa, pins e interação com a localização.                            |
| **Banco de Dados**   | Supabase (PostgreSQL + APIs)                          | Armazenamento de animais, usuários e dados do sistema.                           |
| **Autenticação**     | Supabase Auth (futuro)                                | Gerenciar usuários (ONGs, protetores, usuários comuns).                          |
| **Versionamento**    | Git + GitHub (`PI5-FACULDADE-UCL`)                    | Histórico do código e documentação do projeto.                                   |
| **Hospedagem (web)** | Serviço compatível com build React (ex.: static host) | Disponibilizar o site para acesso público em navegador e mobile.                 |

---

### 4. Cronograma (Resumo em Tabela)

Cronograma completo em: `docs/cronograma.md`.

| Data      | Etapa / Foco Principal          | Entregas esperadas                                                                                     |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **10/fev** | Planejamento                     | Tema definido, escopo inicial do MVP, escolha de tecnologias, decisão por web responsivo.             |
| **24/fev** | Modelo do projeto                | Protótipos das telas principais, modelagem da tabela `animais` no Supabase, criação do repositório.  |
| **03/mar** | Primeira parte construída (agora) | Estrutura inicial do projeto React, layout básico responsivo, mapa exibindo área padrão da cidade.   |
| **10/mar** | Desenvolvimento – Parte 2        | Cadastro de animal com foto e urgência, integração com Supabase, pins sendo exibidos a partir do BD. |
| **17/mar** | Refinamento e entrega            | Melhorias de UX/UI, filtros/lista de animais próximos, projeto publicado no host escolhido.           |

---

### 5. Estrutura do Repositório

| Caminho             | Conteúdo                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `README.md`         | Visão geral do projeto, resumo do cronograma, stack de tecnologias e links úteis.        |
| `docs/cronograma.md` | Cronograma detalhado semana a semana, com tarefas e entregas.                            |
| `docs/requisitos.md` | Requisitos funcionais e não funcionais, descrição das telas e regras de negócio.         |
| `docs/` (imagens)   | Rascunhos / prints de telas (wireframes, protótipos).                                     |
| `frontend/`         | Projeto React (Vite) com o código da aplicação web (SPA + Tailwind + Leaflet + Supabase).|

---

### 6. Ideia das Telas Principais (Visão Rápida)

| Tela                       | Descrição rápida                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Mapa inicial**          | Cabeçalho com nome do projeto, mapa em tela cheia, botão flutuante “+ Registrar animal” e legenda das cores dos pins.    |
| **Registro de animal**    | Formulário simples com upload de foto, descrição, escolha do nível de urgência e localização automática ou selecionada.   |
| **Lista de animais próximos** | Lista de cartões com foto, nível de urgência, distância aproximada e botão para abrir o ponto direto no mapa.              |

Detalhamento visual (campos por tela e fluxos): ver `docs/requisitos.md`.

---

### 7. Próximos Passos (para terça-feira)

| Passo                                     | Responsável | Status sugerido |
| ----------------------------------------- | ----------- | --------------- |
| Subir este `README.md` no GitHub         | Time        | Pendente        |
| Criar pasta `docs/` e adicionar arquivos | Time        | Em andamento    |
| Definir ferramenta de mapa (Leaflet/GM)  | Time        | Pendente        |
| Criar estrutura base do React em `frontend/` (Vite) | Time        | Pendente        |
| Registrar no GitHub o progresso da semana (03/mar) | Time        | Pendente        |

Assim, o repositório já fica **apresentável para a banca/professor** mesmo antes do código final.

---

### 8. Alterações implementadas na branch `dev`

Esta seção resume o que foi desenvolvido na aplicação web (`frontend/`) para o MVP.

- **Estrutura do frontend**
  - Projeto criado em `frontend/` usando **Vite + React + JavaScript**.
  - Configuração de **Tailwind CSS** (mobile-first) e PostCSS.
  - Integração com **Supabase** via `src/lib/supabaseClient.js`, usando variáveis de ambiente:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`

- **Layout base**
  - Componente `Navbar` com nome do projeto e subtítulo explicando o objetivo.
  - Layout em tela cheia (`h-screen`) com mapa ocupando o fundo e um painel inferior/lateral de lista de animais.

- **Mapa interativo (Leaflet)**
  - Implementação com **react-leaflet** em `src/components/MapView.jsx`.
  - Uso da localização inicial do usuário (quando permitido pelo navegador) via `navigator.geolocation`.
  - Pins coloridos por urgência (verde, amarelo, vermelho) usando ícones customizados:
    - `low` → saudável / observação.
    - `medium` → atenção.
    - `high` → urgente.
  - Clique no mapa registra coordenadas para o formulário.

- **Fluxo de cadastro de animal**
  - Botão flutuante `FloatingButton` (`+`) para abrir o formulário.
  - `AnimalFormModal` com:
    - Nome (opcional).
    - Upload de foto.
    - Descrição (obrigatória).
    - Seleção de urgência.
    - Seleção de localização (minha localização ou clique no mapa).
  - Upload de foto para bucket `animais-fotos` no Supabase Storage e gravação do `foto_url` na tabela `animais`.
  - Inserção na tabela `animais` com campos: `nome`, `descricao`, `urgencia`, `foto_url`, `lat`, `lng`, `criado_em`.

- **Lista de animais próximos**
  - Componente `AnimalList` exibindo cartões com:
    - Foto (ou placeholder).
    - Nome / título.
    - Descrição curta.
    - Badge de urgência com cor correspondente.
    - Data/hora de criação formatada.
  - Os dados são carregados do Supabase em ordem decrescente de `criado_em`.

- **Experiência em celular**
  - Layout mobile-first com mapa em tela cheia e painel de lista como “bottom sheet”.
  - Botão extra `LocateButton` para centralizar o mapa na localização atual do usuário.
  - Ajustes de CSS e `invalidateSize()` no Leaflet para evitar tiles quebrados em telas altas (como Galaxy S23).

### Waze dos Animais Abandonados 🐾

Aplicação web responsiva (web + mobile) para **mapear cães em situação de rua**, permitindo que qualquer pessoa registre um animal encontrado e que ONGs / protetores possam visualizar e organizar resgates.

---

### 1. Visão Geral (Resumo)

| Campo            | Descrição                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Nome**         | Waze dos Animais Abandonados                                                             |
| **Objetivo**     | Mapear, de forma colaborativa, cães em situação de rua para facilitar resgates e ajuda. |
| **Tipo**         | Aplicação Web Responsiva (SPA em React).                                                |
| **Público-alvo** | Pessoas que encontram animais na rua, ONGs, protetores independentes e adotantes.       |

---

### 2. Funcionalidades (MVP e Futuro)

| Funcionalidade                     | Descrição                                                                                                      | Status            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------- |
| **Mapa interativo**               | Exibe animais cadastrados em um mapa com **pins coloridos** por nível de urgência.                            | Planejado (MVP)   |
| **Níveis de urgência (🟢🟡🔴)**     | Classificação visual: saudável, precisa de atenção, urgente (ferido/doente).                                  | Planejado (MVP)   |
| **Registro de animal encontrado** | Formulário para enviar **foto**, **descrição**, **nível de urgência** e **localização** (via navegador/mapa). | Planejado (MVP)   |
| **Lista de animais próximos**     | Lista mostrando animais próximos à localização do usuário, com filtros simples.                               | Planejado         |
| **Layout responsivo**             | Interface desenhada para funcionar bem em **celulares e desktops** (mobile-first).                            | Planejado (MVP)   |
| **Login básico**                  | Diferenciar usuários comuns de ONGs/protetores.                                                               | Futuro            |
| **Marcar como resgatado**        | Atualizar status de um caso para resgatado/não encontrado.                                                    | Futuro            |
| **Comentários/atualizações**      | Permitir que usuários adicionem atualizações em cada caso.                                                    | Futuro            |

Detalhamento completo das funcionalidades: ver `docs/requisitos.md`.

---

### 3. Tecnologias e Arquitetura

| Camada               | Tecnologia / Ferramenta                                | Papel no projeto                                                                 |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Frontend Web**     | HTML5, CSS3, JavaScript                               | Estrutura, estilo e interatividade básica da aplicação.                          |
| **Framework Web**    | React                                                 | Construção da interface SPA, componentes reutilizáveis e estado do app.         |
| **Mapa**             | Leaflet **ou** Google Maps JavaScript API            | Exibição do mapa, pins e interação com a localização.                            |
| **Banco de Dados**   | Supabase (PostgreSQL + APIs)                          | Armazenamento de animais, usuários e dados do sistema.                           |
| **Autenticação**     | Supabase Auth (futuro)                                | Gerenciar usuários (ONGs, protetores, usuários comuns).                          |
| **Versionamento**    | Git + GitHub (`PI5-FACULDADE-UCL`)                    | Histórico do código e documentação do projeto.                                   |
| **Hospedagem (web)** | Serviço compatível com build React (ex.: static host) | Disponibilizar o site para acesso público em navegador e mobile.                 |

---

### 4. Cronograma (Resumo em Tabela)

Cronograma completo em: `docs/cronograma.md`.

| Data      | Etapa / Foco Principal          | Entregas esperadas                                                                                     |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **10/fev** | Planejamento                     | Tema definido, escopo inicial do MVP, escolha de tecnologias, decisão por web responsivo.             |
| **24/fev** | Modelo do projeto                | Protótipos das telas principais, modelagem da tabela `animais` no Supabase, criação do repositório.  |
| **03/mar** | Primeira parte construída (agora) | Estrutura inicial do projeto React, layout básico responsivo, mapa exibindo área padrão da cidade.   |
| **10/mar** | Desenvolvimento – Parte 2        | Cadastro de animal com foto e urgência, integração com Supabase, pins sendo exibidos a partir do BD. |
| **17/mar** | Refinamento e entrega            | Melhorias de UX/UI, filtros/lista de animais próximos, projeto publicado no host escolhido.           |

---

### 5. Estrutura do Repositório (Planejada)

| Caminho             | Conteúdo                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `README.md`         | Visão geral do projeto, resumo do cronograma, stack de tecnologias e links úteis.        |
| `docs/cronograma.md` | Cronograma detalhado semana a semana, com tarefas e entregas.                            |
| `docs/requisitos.md` | Requisitos funcionais e não funcionais, descrição das telas e regras de negócio.         |
| `docs/` (imagens)   | Rascunhos / prints de telas (wireframes, protótipos).                                     |
| `frontend/`         | Projeto React (Vite ou CRA) com o código da aplicação web.                               |

---

### 6. Ideia das Telas Principais (Visão Rápida)

| Tela                       | Descrição rápida                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Mapa inicial**          | Cabeçalho com nome do projeto, mapa em tela cheia, botão flutuante “+ Registrar animal” e legenda das cores dos pins.    |
| **Registro de animal**    | Formulário simples com upload de foto, descrição, escolha do nível de urgência e localização automática ou selecionada.   |
| **Lista de animais próximos** | Lista de cartões com foto, nível de urgência, distância aproximada e botão para abrir o ponto direto no mapa.              |

Detalhamento visual (campos por tela e fluxos): ver `docs/requisitos.md`.

---

### 7. Próximos Passos (para terça-feira)

| Passo                                     | Responsável | Status sugerido |
| ----------------------------------------- | ----------- | --------------- |
| Subir este `README.md` no GitHub         | Time        | Pendente        |
| Criar pasta `docs/` e adicionar arquivos | Time        | Em andamento    |
| Definir ferramenta de mapa (Leaflet/GM)  | Time        | Pendente        |
| Criar estrutura base do React em `frontend/` (Vite) | Time        | Pendente        |
| Registrar no GitHub o progresso da semana (03/mar) | Time        | Pendente        |

Assim, o repositório já fica **apresentável para a banca/professor** mesmo antes do código final.

---

### 8. Alterações implementadas na branch `dev`

Esta seção resume o que foi desenvolvido na aplicação web (`frontend/`) para o MVP.

- **Estrutura do frontend**
  - Projeto criado em `frontend/` usando **Vite + React + JavaScript**.
  - Configuração de **Tailwind CSS** (mobile-first) e PostCSS.
  - Integração com **Supabase** via `src/lib/supabaseClient.js`, usando variáveis de ambiente:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`

- **Layout base**
  - Componente `Navbar` com nome do projeto e subtítulo explicando o objetivo.
  - Layout em tela cheia (`h-screen`) com mapa ocupando o fundo e um painel inferior/lateral de lista de animais.

- **Mapa interativo (Leaflet)**
  - Implementação com **react-leaflet** em `src/components/MapView.jsx`.
  - Uso da localização inicial do usuário (quando permitido pelo navegador) via `navigator.geolocation`.
  - Pins coloridos por urgência (verde, amarelo, vermelho) usando ícones customizados:
    - `low` → saudável / observação.
    - `medium` → atenção.
    - `high` → urgente.
  - Clique no mapa registra coordenadas para o formulário.

- **Fluxo de cadastro de animal**
  - Botão flutuante `FloatingButton` (`+`) para abrir o formulário.
  - `AnimalFormModal` com:
    - Nome (opcional).
    - Upload de foto.
    - Descrição (obrigatória).
    - Seleção de urgência.
    - Seleção de localização (minha localização ou clique no mapa).
  - Upload de foto para bucket `animais-fotos` no Supabase Storage e gravação do `foto_url` na tabela `animais`.
  - Inserção na tabela `animais` com campos: `nome`, `descricao`, `urgencia`, `foto_url`, `lat`, `lng`, `criado_em`.

- **Lista de animais próximos**
  - Componente `AnimalList` exibindo cartões com:
    - Foto (ou placeholder).
    - Nome / título.
    - Descrição curta.
    - Badge de urgência com cor correspondente.
    - Data/hora de criação formatada.
  - Os dados são carregados do Supabase em ordem decrescente de `criado_em`.

- **Experiência em celular**
  - Layout mobile-first com mapa em tela cheia e painel de lista como “bottom sheet”.
  - Botão extra `LocateButton` para centralizar o mapa na localização atual do usuário.
  - Ajustes de CSS e `invalidateSize()` no Leaflet para evitar tiles quebrados em telas altas (como Galaxy S23).


### Waze dos Animais Abandonados 🐾

Aplicação web responsiva (web + mobile) para **mapear cães em situação de rua**, permitindo que qualquer pessoa registre um animal encontrado e que ONGs / protetores possam visualizar e organizar resgates.

---

### 1. Visão Geral (Resumo)

| Campo            | Descrição                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Nome**         | Waze dos Animais Abandonados                                                             |
| **Objetivo**     | Mapear, de forma colaborativa, cães em situação de rua para facilitar resgates e ajuda. |
| **Tipo**         | Aplicação Web Responsiva (SPA em React).                                                |
| **Público-alvo** | Pessoas que encontram animais na rua, ONGs, protetores independentes e adotantes.       |

---

### 2. Funcionalidades (MVP e Futuro)

| Funcionalidade                     | Descrição                                                                                                      | Status            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------- |
| **Mapa interativo**               | Exibe animais cadastrados em um mapa com **pins coloridos** por nível de urgência.                            | Planejado (MVP)   |
| **Níveis de urgência (🟢🟡🔴)**     | Classificação visual: saudável, precisa de atenção, urgente (ferido/doente).                                  | Planejado (MVP)   |
| **Registro de animal encontrado** | Formulário para enviar **foto**, **descrição**, **nível de urgência** e **localização** (via navegador/mapa). | Planejado (MVP)   |
| **Lista de animais próximos**     | Lista mostrando animais próximos à localização do usuário, com filtros simples.                               | Planejado         |
| **Layout responsivo**             | Interface desenhada para funcionar bem em **celulares e desktops** (mobile-first).                            | Planejado (MVP)   |
| **Login básico**                  | Diferenciar usuários comuns de ONGs/protetores.                                                               | Futuro            |
| **Marcar como resgatado**        | Atualizar status de um caso para resgatado/não encontrado.                                                    | Futuro            |
| **Comentários/atualizações**      | Permitir que usuários adicionem atualizações em cada caso.                                                    | Futuro            |

Detalhamento completo das funcionalidades: ver `docs/requisitos.md`.

---

### 3. Tecnologias e Arquitetura

| Camada               | Tecnologia / Ferramenta                                | Papel no projeto                                                                 |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Frontend Web**     | HTML5, CSS3, JavaScript                               | Estrutura, estilo e interatividade básica da aplicação.                          |
| **Framework Web**    | React                                                 | Construção da interface SPA, componentes reutilizáveis e estado do app.         |
| **Mapa**             | Leaflet **ou** Google Maps JavaScript API            | Exibição do mapa, pins e interação com a localização.                            |
| **Banco de Dados**   | Supabase (PostgreSQL + APIs)                          | Armazenamento de animais, usuários e dados do sistema.                           |
| **Autenticação**     | Supabase Auth (futuro)                                | Gerenciar usuários (ONGs, protetores, usuários comuns).                          |
| **Versionamento**    | Git + GitHub (`PI5-FACULDADE-UCL`)                    | Histórico do código e documentação do projeto.                                   |
| **Hospedagem (web)** | Serviço compatível com build React (ex.: static host) | Disponibilizar o site para acesso público em navegador e mobile.                 |

---

### 4. Cronograma (Resumo em Tabela)

Cronograma completo em: `docs/cronograma.md`.

| Data      | Etapa / Foco Principal          | Entregas esperadas                                                                                     |
| --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **10/fev** | Planejamento                     | Tema definido, escopo inicial do MVP, escolha de tecnologias, decisão por web responsivo.             |
| **24/fev** | Modelo do projeto                | Protótipos das telas principais, modelagem da tabela `animais` no Supabase, criação do repositório.  |
| **03/mar** | Primeira parte construída (agora) | Estrutura inicial do projeto React, layout básico responsivo, mapa exibindo área padrão da cidade.   |
| **10/mar** | Desenvolvimento – Parte 2        | Cadastro de animal com foto e urgência, integração com Supabase, pins sendo exibidos a partir do BD. |
| **17/mar** | Refinamento e entrega            | Melhorias de UX/UI, filtros/lista de animais próximos, projeto publicado no host escolhido.           |

---

### 5. Estrutura do Repositório (Planejada)

| Caminho             | Conteúdo                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `README.md`         | Visão geral do projeto, resumo do cronograma, stack de tecnologias e links úteis.        |
| `docs/cronograma.md` | Cronograma detalhado semana a semana, com tarefas e entregas.                            |
| `docs/requisitos.md` | Requisitos funcionais e não funcionais, descrição das telas e regras de negócio.         |
| `docs/` (imagens)   | Rascunhos / prints de telas (wireframes, protótipos).                                     |
| `frontend/`         | Projeto React (Vite ou CRA) com o código da aplicação web.                               |

---

### 6. Ideia das Telas Principais (Visão Rápida)

| Tela                       | Descrição rápida                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Mapa inicial**          | Cabeçalho com nome do projeto, mapa em tela cheia, botão flutuante “+ Registrar animal” e legenda das cores dos pins.    |
| **Registro de animal**    | Formulário simples com upload de foto, descrição, escolha do nível de urgência e localização automática ou selecionada.   |
| **Lista de animais próximos** | Lista de cartões com foto, nível de urgência, distância aproximada e botão para abrir o ponto direto no mapa.              |

Detalhamento visual (campos por tela e fluxos): ver `docs/requisitos.md`.

---

### 7. Próximos Passos (para terça-feira)

| Passo                                     | Responsável | Status sugerido |
| ----------------------------------------- | ----------- | --------------- |
| Subir este `README.md` no GitHub         | Time        | Pendente        |
| Criar pasta `docs/` e adicionar arquivos | Time        | Em andamento    |
| Definir ferramenta de mapa (Leaflet/GM)  | Time        | Pendente        |
| Criar estrutura base do React em `frontend/` (Vite) | Time        | Pendente        |
| Registrar no GitHub o progresso da semana (03/mar) | Time        | Pendente        |

Assim, o repositório já fica **apresentável para a banca/professor** mesmo antes do código final.

