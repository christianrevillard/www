@echo ON

SET source=C:\Users\Christian\git

if exist Client\css\*.css copy Client\css\* %source%\www\resources\css\
if exist Client\html\*.html copy Client\html\* %source%\www\resources\html\
if exist Client\js\*.js copy Client\js\* %source%\www\resources\js\
if exist Server\Pages\*.js copy Server\Pages\* %source%\www\Handlers\Pages\
if exist Server\Sockets\*.js copy Server\Sockets\* %source%\www\Handlers\Sockets\
if exist Server\Ajax\*.js copy Server\Ajax\* %source%\www\Handlers\Ajax\
