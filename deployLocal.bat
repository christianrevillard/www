@echo ON

call deployCreanvas
call deployNodeServer
call deployCreanvasNodeModule

cd \Users\Christian\Development\Projects\WebClientApps
cd chess
call ..\..\www\deployWebClientApp.bat
cd ..
cd collision
call ..\..\www\deployWebClientApp.bat
cd ..
cd flipper
call ..\..\www\deployWebClientApp.bat
cd ..
cd jsevents
call ..\..\www\deployWebClientApp.bat
cd ..
cd performance
call ..\..\www\deployWebClientApp.bat
cd ..
cd solarSystem
call ..\..\www\deployWebClientApp.bat
cd ..
cd testSuite
call ..\..\www\deployWebClientApp.bat
cd ..
cd tictactoe
call ..\..\www\deployWebClientApp.bat
cd ..
cd ..\www

cd ..\WebServerApps
cd ajaxTest
call ..\..\www\deployWebServerApp.bat
cd ..
cd chat
call ..\..\www\deployWebServerApp.bat
cd ..
cd collision
call ..\..\www\deployWebServerApp.bat
cd ..
cd tictactoe
call ..\..\www\deployWebServerApp.bat
cd ..
cd pong
call ..\..\www\deployWebServerApp.bat
cd ..
cd testSuite
call ..\..\www\deployWebServerApp.bat
cd ..
cd ..\www
