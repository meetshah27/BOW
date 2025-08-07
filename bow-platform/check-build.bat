@echo off
echo Checking build output...

echo.
echo File sizes:
dir build\index.html
dir build\static\js\main.*.js

echo.
echo First 10 lines of index.html:
type build\index.html | findstr /n "^" | findstr "^[1-10]:"

echo.
echo Build verification complete!
pause 