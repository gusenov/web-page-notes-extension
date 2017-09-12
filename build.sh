increment_version() {
 local v=$1
 if [ -z $2 ]; then 
    local rgx='^((?:[0-9]+\.)*)([0-9]+)($)'
 else 
    local rgx='^((?:[0-9]+\.){'$(($2-1))'})([0-9]+)(\.|$)'
    for (( p=`grep -o "\."<<<".$v"|wc -l`; p<$2; p++)); do 
       v+=.0; done; fi
 val=`echo -e "$v" | perl -pe 's/^.*'$rgx'.*$/$2/'`
 echo "$v" | perl -pe s/$rgx.*$'/${1}'`printf %0${#val}s $(($val+1))`/
}

version=$(jq --raw-output '.version' manifest.json)
newVersion=$(increment_version $version)
jq ".version = \"$newVersion\"" manifest.json | sponge manifest.json

release="WebPageNotes-$newVersion.zip"

if [ ! -f $release ]; then
    :
else
    rm $release
fi

zip --quiet -r $release \
                "manifest.json" \
                "icons.iconarchive.com/" \
                "node_modules/web-store/web-store.js" \
                "background.html" \
                "background.js" \
                "note.html" \
                "note.js" \
                "notes.html"

echo $release
