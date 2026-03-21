### Cronograma Detalhado – Waze dos Animais Abandonados 🐾

Este documento descreve, semana a semana, o planejamento completo do projeto seguindo o calendário acadêmico oficial.

---

### Visão Geral do Cronograma

| Data      | Etapa                          | Foco Principal                                           |
| --------- | ------------------------------ | -------------------------------------------------------- |
| **03/mar** | **Documentação Inicial** | Finalizar README, Requisitos e Cronograma atualizado.    |
| **10/mar** | **Setup Frontend** | Estrutura React/Vite e componentes base da interface.    |
| **17/mar** | **Integração do Mapa** | Implementar Leaflet ou Google Maps no frontend.          |
| **24/mar** | **Backend e Banco** | Configuração do Supabase e modelagem das tabelas.        |
| **31/mar** | **Cadastro (Parte 1)** | Formulário de registro de animais (Envio de texto).      |
| **07/abr** | **Listagem (Parte 1)** | Exibição dos animais cadastrados em lista e no mapa.     |
| **14/abr** | **Upload de Mídia** | Integração de fotos com o Supabase Storage.              |
| **21/abr** | **(Feriado)** | Revisão técnica e ajustes de bugs acumulados.            |
| **28/abr** | **UX e Status** | Implementar pins coloridos por nível de urgência.        |
| **05/mai** | **Filtros e Busca** | Sistema de busca por urgência, data e localização.       |
| **12/mai** | **Responsividade** | Ajustes finos para uso em dispositivos móveis (Rua).     |
| **19/mai** | **Funcionalidades Extras** | Detalhes do animal e sistema de status "Encontrado".     |
| **26/mai** | **Testes e QA** | Testes de usabilidade e correção final de falhas.        |
| **02/jun** | **Deploy e Documentação** | Publicação oficial e manual de uso do sistema.           |
| **09/jun** | **Entrega Final** | Apresentação oficial do projeto concluído.               |

---

### 03/mar – Documentação Inicial (Situação Atual)

| Item                            | Descrição                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Organização do Repositório** | Estruturação das pastas no GitHub conforme padrão do projeto.                               |
| **Cronograma Atualizado** | Ajuste das datas conforme o calendário oficial fornecido pelo professor.                    |
| **Levantamento de Requisitos** | Definição clara das funcionalidades que serão entregues até o final do semestre.            |

---

### 10/mar a 17/mar – Frontend e Interface de Mapas

| Item                            | Descrição                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Setup React/Vite (10/mar)** | Criação do projeto base, instalação de dependências e limpeza de arquivos desnecessários.   |
| **Componentes Base (10/mar)** | Desenvolvimento do Header, Footer e estrutura de navegação principal.                       |
| **Renderização do Mapa (17/mar)**| Implementação da biblioteca de mapas e centralização na região de interesse.                |

---

### 24/mar a 14/abr – Backend e Persistência de Dados

| Item                            | Descrição                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Banco de Dados (24/mar)** | Criação da tabela `animais` no Supabase com campos para coordenadas e urgência.             |
| **Fluxo de Cadastro (31/mar)** | Desenvolvimento do formulário que permite salvar um novo animal no banco de dados.          |
| **Pins Dinâmicos (07/abr)** | Lógica para ler os dados do banco e transformá-los em marcadores visuais no mapa.           |
| **Gestão de Imagens (14/abr)** | Implementação do upload de fotos para o servidor de arquivos (Storage).                     |

---

### 28/abr a 19/mai – Refinamento de UX e Funcionalidades

| Item                            | Descrição                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Identidade Visual (28/abr)** | Criação dos pins coloridos: 🟢 Saudável, 🟡 Alerta, 🔴 Urgente.                             |
| **Filtros Inteligentes (05/mai)**| Opção para o usuário visualizar apenas animais em situação crítica ou resgatados recentemente.|
| **Mobile First (12/mai)** | Garantir que o botão de cadastro seja fácil de clicar em uma tela de celular.               |
| **Encerramento de Caso (19/mai)**| Possibilidade de marcar o animal como "Resgatado", alterando seu estado no mapa.            |

---

### 26/mai a 09/jun – Finalização e Entrega

| Item                            | Descrição                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------- |
| **Bateria de Testes (26/mai)** | Simulação de múltiplos usuários usando o sistema simultaneamente para correção de erros.     |
| **Deploy (02/jun)** | Hospedagem do site em link público (Vercel/Netlify) para avaliação do professor.            |
| **Apresentação (09/jun)** | Demonstração ao vivo do "Waze dos Animais" funcionando de ponta a ponta.                    |

---

### Observações Finais

- O projeto segue a metodologia ágil, com commits frequentes para registrar o progresso semanal.
- As datas podem sofrer pequenos ajustes caso ocorram imprevistos técnicos no desenvolvimento do backend.