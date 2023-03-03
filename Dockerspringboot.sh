#!bin/bash

cd alttuel
./gradlew build
cd ..
docker build -t springboot:$1 -f Dockerfile-springboot$2 . 