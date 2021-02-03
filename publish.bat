set clientapp=%~dp0..\webapi\clientapp\

::call npm run-script build --prefix %~dp0
cmd /c "npm run-script build --prefix %~dp0"
del /q "%~dp0build\static\css\*.map"
del /q "%~dp0build\static\js\*.map"
rmdir /s /q  "%clientapp%static"
del /q "%clientapp%*"
xcopy %~dp0build %clientapp% /s /e /h /d