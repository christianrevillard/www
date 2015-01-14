@echo ON

cd \Users\Christian\Development\Projects\Libs\CreanvasNodeModule\Client


java ^
-jar ..\..\..\..\Tools\closure-compiler\compiler.jar ^
--js ^
	./*.js ^
--js_output_file ..\..\..\www\resources\lib\CreanvasNodeClient.js ^
--define TEST=false ^
--define DEBUG=true ^
--formatting=pretty_print ^
--compilation_level WHITESPACE_ONLY

REM --compilation_level ADVANCED_OPTIMIZATIONS
REM --compilation_level SIMPLE_OPTIMIZATIONS

cd ..

copy Server\* ..\..\www\CreanvasNodeModule\

if not exist ..\..\www\CreanvasNodeModule\Decorators mkdir ..\..\www\CreanvasNodeModule\Decorators
copy Server\Decorators\* ..\..\www\CreanvasNodeModule\Decorators\

if not exist ..\..\www\CreanvasNodeModule\CollisionSolver mkdir ..\..\www\CreanvasNodeModule\CollisionSolver
copy Server\CollisionSolver\* ..\..\www\CreanvasNodeModule\CollisionSolver\

if not exist ..\..\www\CreanvasNodeModule\ElementTypes mkdir ..\..\www\CreanvasNodeModule\ElementTypes
copy Server\ElementTypes\* ..\..\www\CreanvasNodeModule\ElementTypes\

cd ..\..\www
