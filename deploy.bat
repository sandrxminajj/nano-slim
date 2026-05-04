@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo ========================================
echo   DEPLOY NANO SLIM -^> VERCEL
echo ========================================
echo.

echo [1/5] A verificar alteracoes...
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
echo [2/5] A adicionar ficheiros...
git add .

echo.
echo [3/5] A criar commit...
git commit -m "%msg%"

echo.
echo [4/5] A sincronizar com GitHub (pull --rebase)...
git pull --rebase origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo   [AVISO] Conflito no rebase
    echo ========================================
    echo.
    echo O GitHub tem commits que o local nao tem.
    echo Opcoes:
    echo   S - Forcar push (sobrescreve GitHub com o que tens local)
    echo   N - Abortar e resolver manualmente
    echo.
    set /p force="Forcar push? (S/N): "
    if /i "%force%"=="S" (
        git rebase --abort 2>nul
        echo.
        echo A forcar push...
        git push --force-with-lease
        goto done
    ) else (
        git rebase --abort 2>nul
        echo.
        echo Abortado. Resolve os conflitos manualmente:
        echo   git status
        echo   (edita ficheiros em conflito^)
        echo   git add .
        echo   git rebase --continue
        echo   git push
        pause
        exit /b 1
    )
)

echo.
echo [5/5] A enviar para GitHub...
git push
if errorlevel 1 (
    echo.
    echo [AVISO] Push normal falhou. A tentar com force-with-lease...
    git push --force-with-lease
)

:done
echo.
echo ========================================
echo   CONCLUIDO! Vercel vai atualizar em ~30s
echo   Ve em: https://nano-slim-alpha.vercel.app
echo ========================================
echo.

pause
