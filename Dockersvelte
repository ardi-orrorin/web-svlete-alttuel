#!bin/bash

cd svelte
npm run build
cd ..
docker build -t svelte:$1 -f Dockerfile-svelte$2 .