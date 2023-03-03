#!bin/bash

echo "Docker Build Starting"

cd svelte
npm run build
cd ..
docker build -t svelte:0.0.1 -f Dockerfile-svelte .


cd alttuel
./gradlew build
cd ..
docker build -t springboot:0.0.1 -f Dockerfile-springboot . 
 
docker build -t crawlling:0.0.1 -f Dockerfile-crawlling . 

echo "Docker Complete Build"