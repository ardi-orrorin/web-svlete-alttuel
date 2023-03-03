#!bin/bash

echo "Docker Build Starting"

:<<"SVLETE"
cd svelte
npm run build
cd ..
docker build -t svelte:0.0.1 -f Dockerfile-svelte-update .
SVLETE

:<<"SPRINGBOOT"
cd alttuel
./gradlew build
cd ..
docker build -t springboot:0.0.1 -f Dockerfile-springboot-update . 
SPRINGBOOT


#docker build -t crawlling:0.0.1 -f Dockerfile-crawlling-update . 

echo "Docker Complete Build"