@echo ON

REM  Staring in Projects/www
cd ..\Libs\CreanvasJS

java ^
-jar ..\..\..\Tools\closure-compiler\compiler.jar ^
--js ^
	./Core/*.js ^
	./Creanvas/*.js ^
	./Creanvas/ElementDecorators/*.js ^
	./Creevents/*.js ^
	./CreHelpers/*.js ^
	./Crelog/*.js ^
	./CreanvasNodeClient/*.js ^
--js_output_file ..\..\www\resources\lib\Creanvas.js ^
--define TEST=false ^
--define DEBUG=false ^
--externs ./externs.js ^
--compilation_level ADVANCED_OPTIMIZATIONS
REM --compilation_level WHITESPACE_ONLY
REM --compilation_level SIMPLE_OPTIMIZATIONS
REM --formatting=pretty_print ^

cd ..\..\www