::[Bat To Exe Converter]
::
::fBE1pAF6MU+EWHreyHcjLQlHcDGROXmGIrAP4/z0/9agq1k1QeB/SJ3U0LGNNPMvx2bMYJRg5mhTi8QCH1Z6cQaXbQA5pG9Msnfl
::fBE1pAF6MU+EWHreyHcjLQlHcDGROXmGIrAP4/z0/9agq1k1QeB/SJ3U0LGNNPMvx2bMYJRg5mhTi8QCH1Z6cQaXZg46rWJHpHfl
::fBE1pAF6MU+EWHreyHcjLQlHcDGROXmGIrAP4/z0/9agq1k1QeB/SJ3U0LGNNPMvx2bMYJRg5mhTi8QCH1Z6cQaXYw49pyBIpQQ=
::fBE1pAF6MU+EWHreyHcjLQlHcDGROXmGIrAP4/z0/9agq1k1QeB/SJ3U0LGNNPMvx2bMYJRg5mhTi8QCH1Z6cQaXQywcvGwChnaMJMiSoE/DRVzH41M1ew==
::fBE1pAF6MU+EWHreyHcjLQlHcDGROXmGIrAP4/z0/9agq1k1QeB/SJ3U0LGNNPMvx2bMYJRg5mhTi8QCH1Z6cQaXfg43om9FsyqPJMiS0w==
::fBE1pAF6MU+EWHreyHcjLQlHcDGROXmGIrAP4/z0/9agq1k1QeB/SJ3U0LGNNPMvx2bMYJRg5mhTi8QCH1Z6cQaXfg43om9FsymJOMSX/QXyRUbp
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGyX8VAjFC5HSRa+GGStCLkT6ezo08+JqkwTV+c7R8L2w6CGbcwc7UqpSqI/13RJiMoeCRVMMzCMUUE9qmEi
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSjk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+IeA==
::cxY6rQJ7JhzQF1fEqQJhZksaHErSXA==
::ZQ05rAF9IBncCkqN+0xwdVsFAlTMbCXqZg==
::ZQ05rAF9IAHYFVzEqQIdCzNBTkSyLmKpCbsPqMr0+6qurF4JVe4zfZ27
::eg0/rx1wNQPfEVWB+kM9LVsJDCmhFH64RoUO4fv04fnHgEIJFMsxa5va1riLMoA=
::fBEirQZwNQPfEVWB+kM9LVsJDCmhFH64RoUO4fv04fnHgEIJFMsxa5va1riLMoA=
::cRolqwZ3JBvQF1fEqQIRaChdQRSOOSueD6Yf5/r/r8iItg0pW6IedIrJzvS3L/VTy0frYIJt9XJbjIspGh5WagHrWgc1vS5qt3SVMsmZt0/ORAikxWMlGSU5x0LEgCo1dNpr2vMR2jOx8l6f
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRmn4VEkJxYUbwuGOW/6JKxc2eH25u+go0AYR4I=
::Zh4grVQjdCyDJGyX8VAjFC5HSRa+GG6pDaET+NTc5v6vt09dZPAwcorYzqeyDcM7/0epRYQkxXVUi4YuAw9kUzGDew10mXxLpWuLJIe+vBuhY0aa8ko8F2BmyWbIiUs=
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
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