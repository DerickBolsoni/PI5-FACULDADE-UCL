### Cronograma Detalhado – Waze dos Animais Abandonados 🐾

Este documento descreve, semana a semana, o que será feito no projeto.

---

### Visão Geral do Cronograma

| Data      | Etapa                      | Foco principal                                      |
| --------- | -------------------------- | --------------------------------------------------- |
| **10/fev** | Planejamento               | Definir tema, escopo inicial e tecnologias.        |
| **24/fev** | Modelo do projeto          | Desenhar telas, modelar dados e organizar o repositório. |
| **03/mar** | Primeira parte construída  | Subir documentação, iniciar frontend e mapa.       |
| **10/mar** | Desenvolvimento – Parte 2  | Cadastro de animal + integração com Supabase.      |
| **17/mar** | Refinamento e entrega      | Melhorias, filtros, publicação e preparação para apresentação. |

---

### 10/fev – Planejamento

| Item                      | Descrição                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| **Definição do tema**    | Escolha do problema a ser resolvido: animais abandonados nas ruas.                        |
| **Ideia central**        | Criar um “Waze dos animais abandonados” (mapa colaborativo de cães em situação de rua).  |
| **Escopo inicial (MVP)** | Focar em: mapa interativo, cadastro de animal com foto + localização + urgência.         |
| **Tecnologias**          | HTML, CSS, JavaScript, React, Supabase, biblioteca de mapa (Leaflet ou Google Maps).     |
| **Tipo de sistema**      | Aplicação web responsiva, acessível tanto em desktop quanto em dispositivos móveis.      |

---

### 24/fev – Modelo do Projeto

| Item                              | Descrição                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Protótipo de telas**           | Desenhar (no papel ou ferramenta) as telas: mapa inicial, cadastro de animal, lista de animais. |
| **Fluxo principal do usuário**   | Usuário encontra animal → abre site → vê mapa → clica em “Registrar animal” → envia dados.    |
| **Modelagem de dados (Supabase)** | Definir tabela `animais` com campos principais: `id`, `foto_url`, `descricao`, `nivel_urgencia`, `latitude`, `longitude`, `data_registro`. |
| **Tabelas futuras (ideia)**      | Planejar possível `usuarios` (ONGs, protetores, pessoas comuns) e `interacoes` (comentários/atualizações). |
| **Organização do repositório**   | Criar repositório no GitHub, subir README inicial, planejar pastas `docs/` e `frontend/`.     |

---

### 03/mar – Primeira Parte Construída (Situação Atual Esperada)

| Item                                     | Descrição                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Documentação pronta e organizada**    | `README.md` com visão geral, tabelas e links para `docs/`.                                             |
| **Arquivo `docs/cronograma.md`**        | Documento (este) com o cronograma detalhado, pronto para apresentação na faculdade.                    |
| **Arquivo `docs/requisitos.md`**        | Descrição das funcionalidades, telas e regras básicas do sistema.                                      |
| **Estrutura base do frontend (planejada)** | Decisão por Vite (ou CRA) e estruturação inicial da pasta `frontend/` (mesmo que ainda sem código final). |
| **Visão do mapa**                       | Definição de qual biblioteca será usada (Leaflet ou Google Maps) e como o mapa será integrado ao React. |

Sugestão para apresentação nesta data:

- Mostrar o repositório GitHub [`PI5-FACULDADE-UCL`](https://github.com/DerickBolsoni/PI5-FACULDADE-UCL);
- Apresentar o `README.md` com as tabelas;
- Abrir este `cronograma.md` e explicar semana a semana;
- Comentar rapidamente como o React, o mapa e o Supabase serão conectados.

---

### 10/mar – Desenvolvimento (Parte 2)

| Item                              | Descrição                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Projeto React funcional**      | Projeto criado na pasta `frontend/` com Vite ou CRA, rodando localmente.                                  |
| **Componentes principais**       | `App`, `Header`, `Mapa`, `Footer`, e (se possível) um componente `CardAnimal` para exibir animais.        |
| **Tela de mapa inicial**         | Página com mapa centralizado na região da cidade/faculdade, pronta para receber pins.                     |
| **Cadastro de animal (frontend)** | Formulário/modal com campos: foto (upload), descrição, nível de urgência (🟢🟡🔴) e localização.          |
| **Integração com Supabase (CRUD)** | Criar tabela `animais` no Supabase e implementar, no frontend, a criação e listagem básica de registros. |

Ao final dessa semana, espera-se:

- Conseguir **cadastrar um animal** pela interface;
- Visualizar esses animais cadastrados **pelo menos em uma lista** (mesmo que os pins no mapa ainda estejam simples).

---

### 17/mar – Refinamento e Entrega

| Item                                  | Descrição                                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **UX/UI e responsividade**           | Ajustar layout para mobile, melhorar espaçamentos, tipografia, cores e ícones.                            |
| **Pins no mapa com status**          | Exibir pins com cores de acordo com o nível de urgência (🟢 saudável, 🟡 atenção, 🔴 urgente).             |
| **Lista de animais próximos**        | Implementar uma lista (lateral ou tela separada) com animais ordenados por urgência e/ou distância.       |
| **Filtros básicos**                  | Permitir filtrar por nível de urgência e, opcionalmente, por data.                                       |
| **Publicação**                       | Fazer o build do projeto React e publicar em um host (por exemplo, um serviço de static hosting).         |
| **Atualização da documentação**      | Atualizar `README.md` com prints das telas, instruções de uso e status final do que foi implementado.    |
| **Preparação para apresentação final** | Organizar uma sequência de demonstração: abrir site, mostrar mapa, cadastrar animal, ver registro criado. |

---

### Observações Finais

- O cronograma pode ser ajustado conforme a evolução do time, mas **as datas e marcos principais** devem ser mantidos para a entrega acadêmica.
- É importante que, a cada semana, o progresso seja **registrado com commits no GitHub** (mensagens de commit claras ajudam na avaliação).

