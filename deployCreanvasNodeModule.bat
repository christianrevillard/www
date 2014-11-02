@echo ON

cd \Users\Christian\Development\Projects\Libs\CreanvasNodeModule\Client


java ^
-jar ..\..\..\..\Tools\closure-compiler\compiler.jar ^
--js ^
	./*.js ^
--js_output_file ..\..\..\www\resources\lib\CreanvasNodeClient.js ^
--define TEST=false ^
--define DEBUG=true ^
--compilation_level WHITESPACE_ONLY

REM --compilation_level ADVANCED_OPTIMIZATIONS
REM --compilation_level SIMPLE_OPTIMIZATIONS

cd ..

copy Server\* ..\..\www\CreanvasNodeModule\
if not exist ..\..\www\CreanvasNodeModule\Decorators mkdir ..\..\www\CreanvasNodeModule\Decorators
copy Server\Decorators\* ..\..\www\CreanvasNodeModule\Decorators\

cd ..\..\www
