@ECHO OFF
TITLE MCHub Prisons Bot Installer - Custom Coded By QimieGames
ECHO [MCHPB] This bot is completely allowed on MCHub - Atlantic Prisons. However, editing this bot's source code may get you banned on MCHub. Do you wish to install the bot? (Y/N)
SET /p userAgreement=[MCHPB] User's Agreement: 
if %userAgreement% EQU Y (
    ECHO [MCHPB] Installing dependencies...
    ECHO.
    ECHO.
    ECHO.
    ECHO ============================================================================================================
    CALL npm install
    TITLE MCHub Prisons Bot Installer - Custom Coded By QimieGames
        if %ERRORLEVEL% GTR 0 (
            SET outcomeMessage=[MCHPB] Error occured while installing dependencies! You can close this window manually or by pressing Enter on your keyboard.
        ) ELSE (
            SET outcomeMessage=[MCHPB] Successfully installed dependencies. You can close this window manually or by pressing Enter on your keyboard.
        )
    ECHO ============================================================================================================
    TITLE MCHub Prisons Bot Installer - Custom Coded By QimieGames
    ECHO.
    ECHO.
    ECHO.
) ELSE (
    SET outcomeMessage=[MCHPB] MCHub Prisons Bot was not installed! You can close this window manually or by pressing Enter on your keyboard.
)
SET /p endInstaller=%outcomeMessage%
EXIT