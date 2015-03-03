@echo ON

SET source=C:\Users\Christian\git
SET tools=C:\Users\Christian\Development\Tools

call deployCreanvas
call deployNodeServer
call deployCreanvasNodeModule

cd %source%\WebClientApp-collision
call %source%\www\deployWebClientApp.bat

cd %source%\WebClientApp-flipper
call %source%\www\deployWebClientApp.bat

cd %source%\WebClientApp-solarSystem
call %source%\www\deployWebClientApp.bat

cd %source%\WebClientApp-tictactoe
call %source%\www\deployWebClientApp.bat

cd %source%\WebServerApp-Chat
call %source%\www\deployWebServerApp.bat

cd %source%\WebServerApp-Collision
call %source%\www\deployWebServerApp.bat

cd %source%\WebServerApp-Tictactoe
call %source%\www\deployWebServerApp.bat

cd %source%\WebServerApp-Pong
call %source%\www\deployWebServerApp.bat

cd %source%\www
