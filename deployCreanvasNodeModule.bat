@echo ON

SET source=C:\Users\Christian\git
SET tools=C:\Users\Christian\Development\Tools

java ^
-jar %tools%\closure-compiler\compiler.jar ^
--js ^
	%source%\CreanvasNodeModule\Client\*.js ^
--js_output_file %source%\www\resources\lib\CreanvasNodeClient.js ^
--define TEST=false ^
--define DEBUG=true ^
--formatting=pretty_print ^
--compilation_level WHITESPACE_ONLY

REM --compilation_level ADVANCED_OPTIMIZATIONS
REM --compilation_level SIMPLE_OPTIMIZATIONS

copy %source%\CreanvasNodeModule\Server\* %source%\www\CreanvasNodeModule\

if not exist %source%\www\CreanvasNodeModule\Decorators mkdir %source%\www\CreanvasNodeModule\Decorators
copy %source%\CreanvasNodeModule\Server\Decorators\* %source%\www\CreanvasNodeModule\Decorators\

if not exist %source%\www\CreanvasNodeModule\CollisionSolver mkdir %source%\www\CreanvasNodeModule\CollisionSolver
copy %source%\CreanvasNodeModule\Server\CollisionSolver\* %source%\www\CreanvasNodeModule\CollisionSolver\

if not exist %source%\www\CreanvasNodeModule\ElementTypes mkdir %source%\www\CreanvasNodeModule\ElementTypes
copy %source%\CreanvasNodeModule\Server\ElementTypes\* %source%\www\CreanvasNodeModule\ElementTypes\
