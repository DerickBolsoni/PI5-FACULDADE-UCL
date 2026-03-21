### Requisitos do Sistema – Waze dos Animais Abandonados 🐾

Este documento descreve os requisitos funcionais, não funcionais e a ideia das telas principais do sistema.

---

### 1. Objetivo do Sistema

| Item              | Descrição                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------- |
| **Problema**      | Animais (principalmente cães) abandonados nas ruas, sem registro centralizado para resgate. |
| **Solução proposta** | Mapa colaborativo onde qualquer pessoa pode registrar um animal encontrado com foto e localização. |
| **Beneficiados**  | ONGs, protetores independentes, população em geral e potenciais adotantes.                  |

---

### 2. Requisitos Funcionais (RF)

| ID   | Nome                                    | Descrição                                                                                                        | Prioridade |
| ---- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- |
| RF01 | Exibir mapa inicial                     | O sistema deve exibir um mapa ao acessar a aplicação, centralizado em uma região padrão (ex.: cidade/faculdade). | Alta       |
| RF02 | Cadastrar animal                        | O usuário deve conseguir cadastrar um animal informando foto, descrição, nível de urgência e localização.       | Alta       |
| RF03 | Níveis de urgência (🟢🟡🔴)            | O sistema deve permitir classificar o animal como saudável, precisa de atenção ou urgente.                      | Alta       |
| RF04 | Listar animais no mapa                  | O sistema deve mostrar no mapa os animais cadastrados como **pins**.                                            | Alta       |
| RF05 | Listar animais em formato de lista      | O sistema deve oferecer uma visualização em lista dos animais cadastrados, com informações resumidas.          | Média      |
| RF06 | Filtrar animais                         | O usuário deve conseguir filtrar animais por nível de urgência e/ou data.                                       | Média      |
| RF07 | Detalhar um animal                      | Ao clicar em um pin ou item da lista, o sistema deve exibir detalhes: foto, descrição, urgência, data, local.  | Alta       |
| RF08 | Registrar data e hora do cadastro       | Cada registro de animal deve armazenar data e hora da criação.                                                  | Alta       |
| RF09 | Marcar animal como resolvido (futuro)   | Permitir marcar o caso como “resgatado” ou “não encontrado” (recurso futuro).                                   | Baixa      |
| RF10 | Autenticação de usuários (futuro)       | Possibilitar login para ONGs/protetores gerenciarem casos com mais controle.                                    | Baixa      |

---

### 3. Requisitos Não Funcionais (RNF)

| ID   | Nome                       | Descrição                                                                                   | Prioridade |
| ---- | -------------------------- | ------------------------------------------------------------------------------------------- | ---------- |
| RNF01| Responsividade             | A interface deve funcionar bem em smartphones, tablets e desktops.                         | Alta       |
| RNF02| Usabilidade                | Interface simples e intuitiva, com poucos cliques para registrar um animal.                | Alta       |
| RNF03| Desempenho                 | Carregamento inicial aceitável mesmo em conexões móveis comuns.                            | Média      |
| RNF04| Segurança básica           | Dados de acesso ao Supabase (chaves) devem ser tratados corretamente (variáveis de ambiente, etc.). | Média      |
| RNF05| Manutenibilidade           | Código organizado em componentes React, facilitando manutenção e evolução.                 | Média      |

---

### 4. Modelagem de Dados (Supabase)

Tabela principal planejada: `animais`.

| Campo           | Tipo        | Descrição                                           |
| --------------- | ----------- | --------------------------------------------------- |
| `id`            | UUID / int  | Identificador único do registro.                   |
| `foto_url`      | string      | URL da foto armazenada (Supabase Storage ou outro). |
| `descricao`     | text        | Descrição do animal e situação observada.          |
| `nivel_urgencia`| string      | Nível de urgência (`verde`, `amarelo`, `vermelho`). |
| `latitude`      | number      | Latitude da localização do animal.                 |
| `longitude`     | number      | Longitude da localização do animal.                |
| `data_registro` | datetime    | Data e hora do registro.                           |

Tabelas futuras (ideia):

- `usuarios`: dados básicos de login de ONGs/protetores;
- `interacoes`: comentários/atualizações sobre cada animal.

---

### 5. Ideia das Telas (Wireframes Conceituais)

#### 5.1. Tela – Mapa Inicial

| Elemento                 | Descrição                                                                                     |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Cabeçalho                | Nome do projeto e, futuramente, menu simples (sobre, contato, login).                        |
| Mapa                     | Ocupa a maior parte da tela, exibindo pins de animais.                                       |
| Botão flutuante “+”      | Botão para abrir o fluxo de **“Registrar animal”**.                                          |
| Legenda                  | Caixa pequena explicando significados de 🟢, 🟡, 🔴.                                          |

Fluxo básico:

1. Usuário abre o site → vê mapa;
2. Observa pins com cores diferentes;
3. Clica em um pin → aparece card com resumo do animal.

---

#### 5.2. Tela / Modal – Registro de Animal

| Campo/Elemento        | Descrição                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------ |
| Foto do animal        | Upload ou escolha de arquivo (apenas 1 foto no MVP).                                      |
| Descrição             | Campo de texto curto descrevendo aparência e situação.                                    |
| Nível de urgência     | Seleção entre 🟢 saudável, 🟡 atenção, 🔴 urgente.                                         |
| Localização           | Pega localização atual (via navegador) ou permite clicar no mapa para ajustar o ponto.    |
| Botão “Salvar”        | Envia os dados para o Supabase.                                                            |

Fluxo básico:

1. Usuário clica em “+ Registrar animal”;
2. Preenche os campos;
3. Confirma → registro salvo no Supabase → pin aparece no mapa.

---

#### 5.3. Tela – Lista de Animais Próximos

| Elemento          | Descrição                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------- |
| Lista de cartões  | Cada cartão mostra foto, nível de urgência, descrição curta e distância aproximada.      |
| Filtros           | Filtros por urgência (🟢, 🟡, 🔴) e, opcionalmente, por data (hoje, últimos 7 dias, etc.). |
| Ação “Ver no mapa”| Botão que centraliza o mapa no ponto daquele animal.                                     |

---

### 6. Ideia de Implementação Técnica (Resumo)

| Parte              | Como será feito (ideia)                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------- |
| Mapa               | Componente React usando Leaflet ou Google Maps, recebendo dados de `animais` do Supabase.   |
| Cadastro           | Formulário em React que chama a API do Supabase para inserir registros na tabela `animais`. |
| Lista              | Componente que consome os mesmos dados e monta cartões ordenados/fIltrados.                 |
| Responsividade     | CSS com abordagem mobile-first (flexbox/grid) e breakpoints simples para desktop.           |

Essas definições já são suficientes para **apresentar o projeto na terça-feira** como bem planejado e estruturado, mesmo que o código ainda esteja em fase inicial.

