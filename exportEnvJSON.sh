grep -v "ENV_JSON=" .env > .env.tmp
#echo ENV_JSON=$(jq -c . env.json | jq -R) >> .env.tmp
echo ENV_JSON=$(jq -c . env.json) >> .env.tmp
mv .env.tmp .env