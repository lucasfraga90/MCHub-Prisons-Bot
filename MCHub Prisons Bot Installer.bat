@ECHO OFF
TITLE MCHub Prisons Bot Installer - Custom Coded By QimieGames
ECHO [MCHPB] Installing dependencies...
ECHO.
ECHO.
ECHO.
ECHO ============================================================================================================
CALL npm install
TITLE MCHub Prisons Bot Installer - Custom Coded By QimieGames
if %ERRORLEVEL% GTR 0 (
    SET outcomeMessage=[MCHPB] Error occured while installing dependencies! You can close this window manually or by pressing any key.
) ELSE (
    SET outcomeMessage=[MCHPB] Successfully installed dependencies. You can close this window manually or by pressing any key.
)
ECHO ============================================================================================================
TITLE MCHub Prisons Bot Installer - Custom Coded By QimieGames
ECHO.
ECHO.
ECHO.
SET /p endInstaller=%outcomeMessage%
EXIT
