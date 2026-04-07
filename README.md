## Plataforma de Gestão de Fretes e Rotas

Simulador de logística que implementa um pipeline de processamento de pedidos: validação de entrada, otimização de distribuição através de seleção inteligente de depósitos baseada em proximidade geográfica e monitoramento de status de entregas. Desenvolvido com fins educacionais para demonstrar conceitos de arquitetura de microsserviços.

### Pré-requisitos
- Python 3.10 ou superior
- Terminal bash ou PowerShell
- Acesso de escrita ao sistema de arquivos

### Arquitetura de Componentes
- **`functions/recebe_pedido.py`**: Handler responsável por receber pedidos novos, validá-los e encaminhá-los à fila de processamento
- **`functions/processa_rotas.py`**: Motor de roteamento que determina a melhor estratégia de despacho através de análise de proximidade
- **`functions/atualiza_status_pedido.py`**: Módulo de controle de estado que gerencia transições de status do ciclo de vida do pedido
- **`scripts/simular.py`**: Simulador integrado para testes end-to-end ou execução de etapas específicas
- **`scripts/lib/distancia.py`**: Biblioteca matemática para cálculo de distâncias geográficas e ranking de depósitos
- **`data/` e `events/`**: Armazenamento em formato JSON simulando bancos NoSQL, filas de mensagens e eventos de sistema

### Guia de Execução

#### Modo Integrado (Pipeline Completo)
Execute o script principal para processar todo o fluxo:

```bash
python scripts/simular.py reset   # inicializa ambiente limpo
python scripts/simular.py         # executa pipeline: entrada -> roteamento -> atualização
```

#### Modo Modular (Execução por Etapas)
Para testar componentes individuais ou debug:

```bash
python scripts/simular.py reset
python scripts/simular.py recebe   # processa eventos de pedidos novos
python scripts/simular.py rotas    # executa algoritmo de otimização
python scripts/simular.py status   # aplica mudanças de estado
```

#### Resposta Padrão do Sistema
Após processamento bem-sucedido:

```json
{
  "r1": {"ok": true,  "pedidoId": "p-0100"},
  "r2": {"ok": true,  "pedidoId": "p-0100", "rota": "R-PREMIUM-GALPAO-CENTRO"},
  "r3": {"ok": true,  "pedidoId": "p-0100", "status": "EM_ROTA"}
}
```

### Algoritmo de Seleção de Rota

O motor de roteamento opera seguindo esta lógica determinística:

1. **Coleta de Dados Geográficos**: Sistema recupera coordenadas do destinatário (`latitude`, `longitude`) do repositório de clientes
2. **Inventário de Capacidade**: Consulta pool de depósitos disponíveis e suas respectivas localizações
3. **Cálculo de Proximidade**: Para cada depósito candidato, computa métrica de distância planar:

   \(distância = \sqrt{(lat_{cliente} - lat_{depósito})^2 + (lon_{cliente} - lon_{depósito})^2}\)

4. **Ranking e Seleção**: Identifica depósito com menor distância euclidiana
5. **Classificação de Serviço**: Define tipo de transporte baseado em valor da transação:
   - Pedidos acima de R$ 150,00 → Serviço `R-PREMIUM`
   - Demais pedidos → Serviço `R-ECONOMICA`
6. **Geração de Identificador**: Concatena tipo de serviço com código do depósito (ex: `R-PREMIUM-GALPAO-CENTRO`)

A implementação matemática reside em `scripts/lib/distancia.py`, enquanto a orquestração ocorre em `functions/processa_rotas.py`.

### Persistência de Dados

Durante a execução, o sistema gera os seguintes artefatos:

- **`data/filas/*.json`**: Buffer FIFO para pedidos aguardando processamento ou já processados
- **`data/notificacoes/filaNotificacoes.json`**: Auditório de eventos e notificações emitidas
- **`data/logs/TabelaLogs.json`**: Rastreamento de execução para debugging e auditoria
- **`data/dynamodb/bancoLogistico.json`**: Estado persistente contendo situação atual de cada pedido

### Personalização e Configuração

#### Customizar Cenários de Teste
Para simular diferentes condições:

- Modifique `events/pedido.processado.json` para alterar critérios de roteamento
- Ajuste coordenadas em `data/dynamodb/bancoClientes.json` e `data/dynamodb/bancoGalpoes.json` para testar algoritmos de proximidade

#### Execução Direta de Handlers
Cada função em `functions/` possui contexto standalone: ao executar diretamente, configura automaticamente paths relativos para ambiente de desenvolvimento.

---
**Nota**: Este projeto é desenvolvido para fins acadêmicos, priorizando legibilidade, simplicidade conceitual e demonstração prática de padrões de integração entre componentes.


