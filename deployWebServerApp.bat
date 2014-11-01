@echo ON
if exist Client\css\*.css copy Client\css\* ..\..\www\resources\css\
if exist Client\html\*.html copy Client\html\* ..\..\www\resources\html\
if exist Client\js\*.js copy Client\js\* ..\..\www\resources\js\
if exist Server\Pages\*.js copy Server\Pages\* ..\..\www\Handlers\Pages\
if exist Server\Sockets\*.js copy Server\Sockets\* ..\..\www\Handlers\Sockets\
if exist Server\Ajax\*.js copy Server\Ajax\* ..\..\www\Handlers\Ajax\
