#!bin/bash

echo "Docker Build Starting"

docker build -t svelte:0.0.2 -f Dockerfile-svelte-update .
 
docker build -t springboot:0.0.2 -f Dockerfile-springboot-update . 

docker build -t crawlling:0.0.2 -f Dockerfile-crawlling-update . 

echo "Docker Complete Build"