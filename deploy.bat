call npm run build
cd dist
git init
git add -A
git commit -m "deploy"
git push -f git@github.com:busheezy/mhud-settings-editor.git master:gh-pages
cd ..
