#!bin/bash

echo "Docker Build Starting"

sh Dockerspringboot.sh $1 $2
sh Dockersvelte.sh $1 $2
sh Dockercrawlling.sh $1 $2


echo "Docker Complete Build"