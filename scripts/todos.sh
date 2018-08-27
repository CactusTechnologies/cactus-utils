#!/bin/bash
if [ $# -ne 0 ] && [ "$1" == "--write" ]; then
	npx leasot '*/**' '!**/node_modules/**' -Sx --reporter vscode >TODOS.md
elif [ $# -ne 0 ] && [ "$1" == "--append" ]; then
  sed -in '1,/---/!d' README.md
	npx leasot '*/**' '!**/node_modules/**' -Sx --reporter vscode >> README.md
  rm README.mdn
else
	npx leasot '*/**' '!**/node_modules/**' -Sx
fi
