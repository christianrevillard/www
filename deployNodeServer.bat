 @echo ON

cd \Users\Christian\Development\Projects\Libs\NodeServer

copy Handlers\Generic\* ..\..\www\Handlers\Generic\
copy Handlers\Sockets\* ..\..\www\Handlers\Sockets\
copy ServerCore\* ..\..\www\ServerCore\

cd ..\..\www
