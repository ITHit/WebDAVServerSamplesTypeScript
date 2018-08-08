#!/bin/bash

mkdir -p docs_wiki
cp -r docs_md/* docs_wiki
cd docs_wiki
find ./ -type f -exec sed -i 's|\.\./||g' {} \;
find ./ -type f -exec sed -i 's|classes/||g' {} \;
find ./ -type f -exec sed -i 's|interfaces/||g' {} \;
find ./ -type f -exec sed -i 's|enums/||g' {} \;
find ./ -type f -exec sed -i 's|modules/||g' {} \;
find ./ -type f -exec sed -i 's|\.md||g' {} \;
find ./ -type f -exec sed -i 's|README|\.\./wiki|g' {} \;
mv README.md _Sidebar.md