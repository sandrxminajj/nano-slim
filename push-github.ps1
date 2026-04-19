# ===================================================================
# Nano Slim — push automatizado para GitHub
# Uso: abre PowerShell nesta pasta e executa: .\push-github.ps1
# ===================================================================
# Pede GitHub username + email + PAT (Personal Access Token)
# Configura o remote e faz push. Token fica no Credential Manager do Windows.
# ===================================================================

$ErrorActionPreference = 'Stop'

# Cor helpers
function Info($msg)    { Write-Host "→ $msg" -ForegroundColor Cyan }
function Ok($msg)      { Write-Host "OK $msg" -ForegroundColor Green }
function Warn($msg)    { Write-Host "⚠ $msg" -ForegroundColor Yellow }
function Fail($msg)    { Write-Host "✗ $msg" -ForegroundColor Red; exit 1 }

# Verificar que estamos numa pasta git
if (-not (Test-Path .\.git)) {
    Fail "Nao e um repositorio git. Executa na pasta nano-slim."
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  NANO SLIM - PUSH GITHUB AUTOMATICO"   -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# 1) Perguntar GitHub username
$currentUser = git config user.name 2>$null
if ($currentUser) {
    $ghUser = Read-Host "GitHub username (Enter para manter '$currentUser')"
    if ([string]::IsNullOrWhiteSpace($ghUser)) { $ghUser = $currentUser }
} else {
    $ghUser = Read-Host "GitHub username"
}
if ([string]::IsNullOrWhiteSpace($ghUser)) { Fail "Username e obrigatorio." }

# 2) Perguntar email
$currentEmail = git config user.email 2>$null
if ($currentEmail) {
    $email = Read-Host "Email Git (Enter para manter '$currentEmail')"
    if ([string]::IsNullOrWhiteSpace($email)) { $email = $currentEmail }
} else {
    $email = Read-Host "Email Git"
}
if ([string]::IsNullOrWhiteSpace($email)) { Fail "Email e obrigatorio." }

# 3) Perguntar nome do repo
$defaultRepo = Split-Path (Get-Location) -Leaf
$repo = Read-Host "Nome do repo GitHub (Enter para '$defaultRepo')"
if ([string]::IsNullOrWhiteSpace($repo)) { $repo = $defaultRepo }

# 4) Perguntar PAT (Personal Access Token) - input escondido
Write-Host ""
Write-Host "Precisas de um Personal Access Token (PAT):"  -ForegroundColor Yellow
Write-Host "  1. Vai a https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "  2. Generate new token (classic)"             -ForegroundColor Gray
Write-Host "  3. Scopes: marca 'repo' (tudo)"              -ForegroundColor Gray
Write-Host "  4. Copia o token que comeca com 'ghp_'"      -ForegroundColor Gray
Write-Host ""
$tokenSecure = Read-Host "Cola o PAT (ghp_...) (input escondido)" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($tokenSecure)
$token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
if ([string]::IsNullOrWhiteSpace($token)) { Fail "Token e obrigatorio." }

# 5) Configurar git user
Info "A configurar Git user..."
git config user.name $ghUser
git config user.email $email
Ok "user.name = $ghUser"
Ok "user.email = $email"

# 6) Construir URL com token embutido (apenas pra este push, depois removemos)
$remoteUrlWithToken = "https://$($ghUser):$($token)@github.com/$ghUser/$repo.git"
$remoteUrlClean     = "https://github.com/$ghUser/$repo.git"

# 7) Verificar se origin ja existe
$existingRemote = git remote 2>$null | Select-String "^origin$"
if ($existingRemote) {
    Info "Remote 'origin' ja existe. A substituir..."
    git remote set-url origin $remoteUrlWithToken
} else {
    Info "A adicionar remote 'origin'..."
    git remote add origin $remoteUrlWithToken
}
Ok "Remote configurado"

# 8) Garantir branch main
Info "A garantir branch 'main'..."
git branch -M main | Out-Null
Ok "Branch = main"

# 9) Fazer push
Write-Host ""
Info "A fazer push para GitHub..."
try {
    git push -u origin main
    Ok "Push concluido!"
} catch {
    # Limpar token do remote mesmo em caso de erro
    git remote set-url origin $remoteUrlClean
    Fail "Push falhou. Verifica: repo existe no GitHub? PAT tem permissao 'repo'? Username correto?"
}

# 10) Limpar token do remote (fica so URL limpa; credenciais passam pra Credential Manager)
Info "A limpar token do remote (fica no Windows Credential Manager)..."
git remote set-url origin $remoteUrlClean
Ok "Remote agora: $remoteUrlClean"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Green
Write-Host "  PUSH FEITO COM SUCESSO"                -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:"
Write-Host "  1. Abre https://vercel.com/new"
Write-Host "  2. Import Git Repository -> seleciona '$repo'"
Write-Host "  3. Environment Variables:"
Write-Host "       WAYMB_CLIENT_ID"
Write-Host "       WAYMB_CLIENT_SECRET"
Write-Host "       WAYMB_ACCOUNT_EMAIL"
Write-Host "  4. Deploy"
Write-Host ""
Write-Host "Para atualizacoes futuras:"
Write-Host "  - Duplo clique em deploy.bat"
Write-Host "  OU"
Write-Host "  - git add -A ; git commit -m 'update' ; git push"
Write-Host ""
