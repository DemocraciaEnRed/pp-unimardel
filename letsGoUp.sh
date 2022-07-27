# Arriba el docker de mongo
docker inspect --format="{{.State.Status}}" mongodb-der | grep -q running || docker-compose up -d

# Uso node v8
source ~/.nvm/nvm.sh
nvm use v8.17.0

# Arriba react!
NODE_PATH=. DEBUG=democracyos* ./node_modules/.bin/gulp bws
