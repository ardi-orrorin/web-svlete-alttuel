#!bin/bash

if [ $1 == "build" ];then
    sh Dockerspringboot.sh $2
    sh Dockersvelte.sh $2
    sh Dockercrawlling.sh $2
fi


if [ $1 == "update" ];then
    sh Dockerspringboot.sh $2 -update
    sh Dockersvelte.sh $2 -update
    sh Dockercrawlling.sh $2 -update
fi

if [ $1 == "list" ];then
    docker image ls svelte
    docker image ls springboot
    docker image ls crawlling
fi

if [ $1 == "rma" ];then
    docker image rm -f $(docker image ls svelte)
    docker image rm -f $(docker image ls springboot)
    docker image rm -f $(docker image ls crawlling)    
fi

if [ $1 == "compose" ];then
    docker stack deploy -c Docker-compose.yml webservice
fi
