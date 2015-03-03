@echo ON

SET source=C:\Users\Christian\git

if exist css\*.csss copy css\* %source%\www\resources\css\
if exist html\*.html copy html\* %source%\www\resources\html\
if exist js\*.js copy js\* %source%\www\resources\js\
