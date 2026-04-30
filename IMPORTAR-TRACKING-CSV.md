# Como importar pedidos pra Track n' Fast (CSV)

## 📋 Passo 1 — Obter os dados dos pedidos pagos

### A) WayMB dashboard
1. Login em [waymb.com](https://www.waymb.com/)
2. Menu → **Transactions** (ou Transações)
3. Filtrar por status: **Paid** (Pago)
4. Anotar para cada pedido:
   - Transaction ID (ex: `s2iHFQ86ByTBa4baAKiF`)
   - Customer name
   - Customer email
   - Customer phone (opcional)

### B) Email recebidos no apoio@nanoslimoficial.com
Como tens o email de confirmação configurado, todos os pedidos que entraram **deixaram email no apoio@nanoslimoficial.com** (cópia do que foi enviado ao cliente). Aí tens:
- Nome cliente
- Email cliente
- Nº Pedido (tx_id)
- Total pago

### C) Dashboard Resend
[resend.com/emails](https://resend.com/emails) → vê a lista de emails enviados → cada um tem os dados do cliente nos metadados.

---

## 📋 Passo 2 — Preencher o CSV

Abre `nano-slim-orders-template.csv` no Excel / Google Sheets / Numbers.

### Estrutura

| Coluna | Exemplo | Notas |
|---|---|---|
| `order_id` | `s2iHFQ86ByTBa4baAKiF` | Transaction ID do WayMB (único) |
| `customer_name` | `Maria Silva` | Nome completo |
| `email` | `maria@example.pt` | Email |
| `shipping_address` | `"Rua das Flores 12, 2º Esq, 1100-100 Lisboa"` | **Endereço completo numa só linha entre aspas** |
| `products` | `Nano Slim 2 POTES + 1 GRÁTIS x1 - 69.00 EUR` | Texto livre descrevendo o produto |

### ⚠️ Atenção ao formato

- **Aspas em volta de campos com vírgula** (ex: morada com vírgulas)
- **UTF-8 encoding** (preserva acentos como ã, ç, é)
- **Encoding correto:** se usares Excel no Windows, ao salvar escolhe "CSV UTF-8 (delimitado por vírgulas)"

### Exemplo preenchido

```csv
order_id,customer_name,email,shipping_address,products
s2iHFQ86ByTBa4baAKiF,Ana Pereira,ana.p@gmail.com,"Rua dos Combatentes 89, 4200-185 Porto",Nano Slim 2+1 GRÁTIS x1 - 69.00 EUR
xY9Hk2L5pQwR8tNb,João Costa,joao.costa@hotmail.com,"Av. Roma 234, 5º Dto, 1700-345 Lisboa",Nano Slim 3+2 GRÁTIS x1 - 99.00 EUR
```

---

## 📋 Passo 3 — Importar no Track n' Fast

1. [fastntrack.lovable.app](https://fastntrack.lovable.app/login) → login
2. Dashboard → **Importação Retroativa** → "Importar pedidos"
3. Upload do CSV
4. Confirmar mapeamento de colunas (deve ser automático)
5. Clicar **Importar**

→ Cada pedido importado consome **1 crédito** (tens 10).

---

## ⚠️ Cuidados

### Só importa pedidos PAGOS
- Não importes pedidos com status "Pending" no WayMB (cliente não pagou ainda)
- Pedidos cancelados também não

### Só importa se já enviaste/vais enviar
- Não vale a pena importar um pedido **já entregue** há semanas (CTT não tem mais histórico)
- Foco nos **últimos 30 dias** que ainda têm relevância

### Limita aos importantes
Tens 10 créditos. Se vendeste 15 pedidos no total mas só 3 estão "em trânsito" agora, importa **só os 3**. Os outros já foram entregues, sem valor.

---

## 🤔 Quando NÃO importar (e usar API automática)

Se preferires que **futuros pedidos** sejam criados automaticamente no Track n' Fast:

1. Abre `api/checkout.js`
2. Descomenta a linha:
   ```js
   // const { createTrackingOrder } = require("./_tracking.js");
   ```
3. Descomenta o bloco `await createTrackingOrder(...)`
4. Deploy

Cada compra paga vai criar tracking automático, mas vai **gastar credito por cada tentativa de compra** (mesmo se cliente não pagar). Por isso desativámos.

---

## 💡 Atalho: pegar dados do email enviado

Cada email de confirmação vai pra `apoio@nanoslimoficial.com` (Reply-To). Se acederes a esse email:

```
De:       Nano Slim <apoio@nanoslimoficial.com>
Para:     ana.p@gmail.com         ← email cliente
Assunto:  Encomenda recebida #S2IHFQ8 · Nano Slim
Corpo:
  Nome:       Ana Pereira          ← customer_name
  Pedido:     s2iHFQ86ByTBa4baAKiF ← order_id
  Total:      69,00 €              ← products price
  Pagamento:  MB Way
```

→ Copia desses emails pra preencher o CSV.

**Para morada:** infelizmente o email não tem (só WayMB sabe). Tens que ir ao painel WayMB pra cada pedido.
