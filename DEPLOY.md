# Deploy — Nano Slim

Guia passo-a-passo pra colocar esta oferta no ar (Vercel + WayMB).

---

## Primeira vez (setup inicial, ~5 min)

### 1. Criar repositório no GitHub
- Vai em https://github.com/new
- Nome: `nano-slim`
- **Privado** recomendado
- NÃO marques "Initialize with README" (já temos commit inicial)
- Depois do submit, copia a URL (ex: `git@github.com:teuuser/nano-slim.git`)

### 2. Conectar a pasta local ao GitHub
Abre terminal (PowerShell ou Git Bash) na pasta `C:\Users\Eliezer\Desktop\nano-slim\` e corre:

```bash
git remote add origin git@github.com:teuuser/nano-slim.git
git branch -M main
git push -u origin main
```

(Se usares HTTPS em vez de SSH: `git remote add origin https://github.com/teuuser/nano-slim.git`)

### 3. Conectar ao Vercel
- Vai em https://vercel.com/new
- Clica **Import Git Repository**
- Seleciona o repo `nano-slim` que acabaste de criar
- Deixa tudo no default — Vercel detecta automáticamente as funções serverless em `/api/`
- Clica **Deploy**
- Ao fim de ~40 segundos vai gerar URL tipo `https://nano-slim.vercel.app`

### 4. Adicionar as 3 env vars do WayMB
No Vercel dashboard do projeto → **Settings** → **Environment Variables**, adiciona:

| Key | Value |
|-----|-------|
| `WAYMB_CLIENT_ID` | (teu client id do WayMB) |
| `WAYMB_CLIENT_SECRET` | (teu client secret) |
| `WAYMB_ACCOUNT_EMAIL` | (email da tua conta WayMB) |

Depois de adicionar as 3, vai em **Deployments** → botão **Redeploy** no último deploy.
(Tem que ser redeploy — senão as envs novas não aparecem às funções.)

### 5. (Opcional) Apontar domínio próprio
- Compras o domínio onde preferires (registrar.pt, Namecheap, etc.)
- No Vercel do projeto → **Settings** → **Domains** → **Add**
- Adiciona o teu domínio (ex: `nano-slim.pt`)
- Vercel mostra os DNS records que tens que adicionar no registrador:
  - **A record:** `76.76.21.21`
  - **OU CNAME:** `cname.vercel-dns.com`
- Adicionas no teu registrador, esperas ~5 min, fica verde ✓
- (Opcional) Depois de termines domínio custom, adiciona env var `CALLBACK_URL=https://teudominio.pt/api/webhook` no Vercel e faz Redeploy, para o callback do WayMB ir para o domínio próprio em vez de `.vercel.app`

### 6. Testar
- Abre a URL (`nano-slim.vercel.app` ou domínio custom)
- Escolhe um kit → preenche dados → testa MB WAY com pequeno valor
- Verifica logs em Vercel → Deployments → último → **Logs**

---

## Deploy diário (depois do setup inicial)

1. Edita o que quiseres na pasta `C:\Users\Eliezer\Desktop\nano-slim\`
2. **Duplo-clique em `deploy.bat`**
3. Escreves mensagem curta ("novo preço", "troca foto", etc.)
4. Enter — ele faz `git add . && git commit && git push`
5. Vercel deteta o push e atualiza em ~30s

---

## Placeholders a verificar antes do primeiro deploy

- [ ] Imagens reais em `images/` (já tens: hero-produto.png, produto-trio.jpg, etc.)
- [ ] Emails em `js/legal.js` apontam pra teu servidor de email (já preenchido: `contacto@nano-slim.pt`, `privacidade@nano-slim.pt`, `reembolso@nano-slim.pt`) — **confirma que controlas estes emails ou muda para os teus**
- [ ] Tracking IDs (Clarity, Google Ads, TikTok, Meta) — todos vazios por agora. Descomenta os blocos em `checkout.html` e `index.html` quando tiveres contas activas
- [ ] `favicon` aponta para `images/produto-thumb.png` — se quiseres outro favicon dedicado, substitui

---

## Segurança já configurada

Este deploy já vem com:
- ✓ Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) via `vercel.json`
- ✓ CORS restrito à origem própria (anti-abuso cross-origin)
- ✓ Rate limiting no endpoint `/api/checkout` (10 req/min por IP)
- ✓ Logs sanitizados (email/telemóvel mascarados nos logs)
- ✓ Env vars **nunca** no código (só no Vercel dashboard, criptografadas)
- ✓ HTTPS forçado (default Vercel)
- ✓ `.gitignore` protege `.env` e secrets

---

## Problemas comuns

**"Webhook não chega"** → verifica que `/api/webhook` responde 200. Testa com:
```bash
curl -X POST https://nano-slim.vercel.app/api/webhook -H "Content-Type: application/json" -d "{}"
```

**"Pagamento dá erro 502"** → confirma que as 3 env vars WayMB estão preenchidas no Vercel dashboard. Depois **Redeploy**.

**"Checkout abre em branco / mostra 'Precisas escolher um kit'"** → Significa que `sessionStorage.ck_product` não foi populado. Vem da landing: só funciona se chegar ao checkout vindo de um botão de kit na `index.html`.

**"Logs não aparecem"** → Vercel dashboard → Deployments → clica deploy → aba **Logs** (streaming).

**"A página está a dar 404 em /api/..."** → verifica que `vercel.json` está na raiz (não dentro de subpasta).

---

## Estrutura final do projeto

```
nano-slim/
├── index.html              # Landing (gerada pelo html-designer-pt)
├── checkout.html           # Checkout 3 steps (MB WAY / Multibanco)
├── vercel.json             # Security headers + rewrites das APIs
├── deploy.bat              # Windows: duplo-clique para git push
├── DEPLOY.md               # Este ficheiro
├── .env.example            # Template das env vars WayMB
├── .gitignore              # Protege .env e secrets
├── oferta.config.json      # Fonte da verdade (config completa)
├── api/
│   ├── checkout.js         # Cria pagamento WayMB
│   ├── transaction-status.js  # Poll de status
│   ├── webhook.js          # Callback WayMB
│   └── tracking.js         # Log de eventos
├── css/
│   └── mobile.css          # Optimizações mobile
├── js/
│   ├── legal.js            # Modais Privacidade/Termos/Reembolso/Envios/Contacto
│   ├── events.js           # Eventos TikTok
│   ├── fbevents.js         # Meta Pixel
│   ├── latest.js           # Utmify
│   └── utmify_latest.js    # Utmify
└── images/
    ├── hero-produto.png
    ├── produto-trio.jpg
    ├── produto-aberto.jpg
    ├── produto-thumb.png
    ├── como-usar-1.jpg
    ├── como-usar-2.jpg
    ├── lifestyle-mao.jpg
    ├── lifestyle-janela.jpg
    ├── lifestyle-fita-metrica.jpg
    ├── logo-mbway.svg
    └── logo-multibanco.svg
```

---

## Suporte técnico

Se quebrar algo, abre novo chat Claude Code neste projeto e explica o erro.
