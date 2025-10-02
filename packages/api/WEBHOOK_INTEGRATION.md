# Webhook Integration Guide

## Como Funciona o Fluxo de Webhooks

### 🔄 Fluxo Completo

1. **Usuário cria uma integração** na plataforma (Kiwify, Eduzz ou Hotmart)
2. **Sistema gera URL única** com o `integrationId`: 
   ```
   https://api.seudominio.com/webhooks/kiwify/123
   ```
3. **Usuário configura a URL** no painel da plataforma
4. **Plataforma envia webhooks** para a URL configurada
5. **Sistema processa** e registra o webhook

---

## 📍 Endpoints de Webhook

### 🎯 Endpoint Unificado (RECOMENDADO)

**Todas as plataformas usam o mesmo endpoint:**

```
POST /webhooks/:integrationId
```

O sistema identifica automaticamente a plataforma pela integração no banco de dados.

#### Headers aceitos:
- `X-Kiwify-Signature` - Para webhooks da Kiwify
- `X-Hotmart-Hottok` - Para webhooks da Hotmart
- Body com `token` - Para webhooks da Eduzz

#### Exemplos de URLs:

**Kiwify:**
```
https://api.seudominio.com/webhooks/123
Header: X-Kiwify-Signature: xxx
```

**Eduzz:**
```
https://api.seudominio.com/webhooks/456
Body: { "token": "xxx", ... }
```

**Hotmart:**
```
https://api.seudominio.com/webhooks/789
Header: X-Hotmart-Hottok: xxx
```

### ✨ Vantagens do Endpoint Unificado:

1. **Uma única URL** para configurar em todas as plataformas
2. **Identificação automática** da plataforma pela integração
3. **Menos código duplicado** no controller
4. **Mais simples de manter** e testar
5. **Flexível** - aceita múltiplos métodos de autenticação

---

## 🔐 Segurança

Cada plataforma usa um método diferente de validação:

### Kiwify
- **Método**: HMAC SHA256
- **Header**: `X-Kiwify-Signature`
- **Cálculo**: `hmac('sha256', apiKey, JSON.stringify(payload))`
- **Secret**: `apiKey` da integração

### Eduzz
- **Método**: HMAC SHA256
- **Header**: `X-Signature`
- **Cálculo**: `hmac('sha256', apiKey, JSON.stringify(payload))`
- **Secret**: `apiKey` da integração (chave secreta do webhook)
- **Documentação**: [Eduzz Webhook Security](https://developers.eduzz.com/docs/webhook/security)

### Hotmart
- **Método**: Hottok Validation
- **Header**: `X-Hotmart-Hottok`
- **Secret**: `apiKey` da integração

---

## 💾 Logging de Webhooks

Todos os webhooks são registrados na tabela `webhook_logs`:

- ✅ **PENDING**: Webhook recebido, processamento iniciado
- ⚙️ **PROCESSING**: Em processamento
- ✅ **SUCCESS**: Processado com sucesso
- ❌ **FAILED**: Falha no processamento
- ⏭️ **IGNORED**: Evento ignorado (não implementado)

---

## 🎯 Fluxo de Dados

```
┌─────────────┐
│  Plataforma │
│ (Kiwify)    │
└──────┬──────┘
       │ POST /webhooks/kiwify/123
       │ X-Kiwify-Signature: xxx
       │ { "event": "order.paid", ... }
       ▼
┌────────────────────────────────────┐
│   WebhookController                │
│   - Extrai integrationId da URL    │
│   - Extrai signature do header     │
│   - Registra webhook (PENDING)     │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│   ProcessWebhookUseCase            │
│   - Busca integração por ID        │
│   - Seleciona strategy (Kiwify)    │
│   - Valida assinatura              │
│   - Processa evento                │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│   KiwifyStrategy                   │
│   - Identifica tipo de evento      │
│   - Cria/atualiza venda            │
│   - Cria/encontra produto          │
│   - Retorna resultado              │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│   CreateWebhookLogUseCase          │
│   - Atualiza log (SUCCESS/FAILED)  │
│   - Registra erro (se houver)      │
└────────────────────────────────────┘
```

---

## 🛠️ Como Testar

### 1. Criar uma integração
```bash
POST /integrations
{
  "platformName": "KIWIFY",
  "apiKey": "sua-api-key-aqui",
  "status": "active"
}
# Resposta: { "id": 123, ... }
```

### 2. Configurar webhook na plataforma
- Acesse o painel da Kiwify/Eduzz/Hotmart
- Configure a URL única: `https://api.seudominio.com/webhooks/123`
- Ative a integração

### 3. Testar manualmente (desenvolvimento)
```bash
# Kiwify
curl -X POST http://localhost:3001/webhooks/123 \
  -H "Content-Type: application/json" \
  -H "X-Kiwify-Signature: <hmac_sha256_signature>" \
  -d '{"order_id":"da292c35-c6fc-44e7-ad19-ff7865bc2d89",...}'

# Eduzz  
curl -X POST http://localhost:3001/webhooks/456 \
  -H "Content-Type: application/json" \
  -H "X-Signature: <hmac_sha256_signature>" \
  -d '{"id":"zszf0uk65g701io8dbsckfeld","event":"myeduzz.invoice_paid",...}'

# Hotmart
curl -X POST http://localhost:3001/webhooks/789 \
  -H "Content-Type: application/json" \
  -H "X-Hotmart-Hottok: <hottok_signature>" \
  -d '{"id":"1234567890123456789","event":"PURCHASE_APPROVED",...}'
```

**Gerando assinaturas para teste:**

```typescript
// Kiwify e Eduzz (HMAC SHA256)
const crypto = require('crypto');
const payload = JSON.stringify({ /* seu payload */ });
const secret = 'sua-api-key';
const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
console.log('Signature:', signature);
``` \
  -H "X-Hotmart-Hottok: xxx" \
  -d '{"event":"PURCHASE_COMPLETE",...}'
```

### 4. Verificar logs
```bash
GET /webhook-logs?integrationId=123
```

---

## ⚠️ Importante

1. **Cada integração tem sua própria URL** - isso permite identificar qual usuário/integração está recebendo o webhook
2. **O `integrationId` vem da URL**, não do payload da plataforma
3. **A plataforma não precisa saber nossos IDs internos**
4. **URLs devem ser HTTPS em produção** para segurança
5. **Sempre validar assinaturas** antes de processar webhooks

---

## 📊 Monitoramento

### Métricas Úteis
- Total de webhooks por status
- Taxa de sucesso/falha por plataforma
- Tempo médio de processamento
- Webhooks falhados recentes

### Consultas Úteis
```typescript
// Webhooks falhados das últimas 24h
await webhookLogRepository.findFailedLogs(100);

// Estatísticas por plataforma
await webhookLogRepository.countByPlatform('KIWIFY');

// Limpeza de logs antigos (90 dias)
await webhookLogRepository.deleteOlderThan(90);
```
