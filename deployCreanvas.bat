@echo ON

SET source=C:\Users\Christian\git
SET tools=C:\Users\Christian\Development\Tools

java ^
-jar %tools%\closure-compiler\compiler.jar ^
--js ^
	%source%\CreanvasJS/Core/*.js ^
	%source%\CreanvasJS/Creanvas/*.js ^
	%source%\CreanvasJS/Creanvas/ElementDecorators/*.js ^
	%source%\CreanvasJS/Creevents/*.js ^
	%source%\CreanvasJS/CreHelpers/*.js ^
	%source%\CreanvasJS/Crelog/*.js ^
	%source%\CreanvasJS/CreanvasNodeClient/*.js ^
--js_output_file %source%\www\resources\lib\Creanvas.js ^
--define TEST=false ^
--define DEBUG=false ^
--externs %source%\CreanvasJS/externs.js ^
--compilation_level ADVANCED_OPTIMIZATIONS
REM --compilation_level WHITESPACE_ONLY
REM --compilation_level SIMPLE_OPTIMIZATIONS
REM --formatting=pretty_print ^
