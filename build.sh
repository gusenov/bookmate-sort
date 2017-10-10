version=$(jq --raw-output '.version' manifest.json)
newVersion=$(./increment_version.sh $version)
jq ".version = \"$newVersion\"" manifest.json | sponge manifest.json

release="BookmateSort-$newVersion.zip"

if [ ! -f $release ]; then
    :
else
    rm $release
fi

zip --quiet -r $release \
                "node_modules/seq-exec/seq-exec.js" \
                "books.css" \
                "books.html" \
                "books.js" \
                "commons.js" \
                "images/icon16.png" \
                "images/icon24.png"\
                "images/icon32.png" \
                "images/icon48.png" \
                "images/icon128.png" \
                "manifest.json" \
                "popup.html" \
                "popup.js"

echo $release
