@echo off
chcp 65001 >nul
cd /d "C:\Users\Eliezer\Desktop\nano-slim"

echo.
echo ========================================
echo   DEPLOY NANO SLIM -^> VERCEL
echo ========================================
echo.

echo [1/4] A verificar alteracoes...
git status --short
echo.

set /p msg="Descreve a mudanca (ex: novo preco): "

if "%msg%"=="" (
    echo.
    echo [ERRO] Mensagem vazia. A cancelar.
    pause
    exit /b 1
)

echo.
echo [2/4] A adicionar ficheiros...
git add .

echo.
echo [3/4] A criar commit...
git commit -m "%msg%"

echo.
echo [4/4] A enviar para GitHub...
git push

echo.
echo ========================================
echo   CONCLUIDO! Vercel vai atualizar em ~30s
echo   Ve em: https://nano-slim-alpha.vercel.app
echo ========================================
echo.

pause
