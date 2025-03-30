#!/bin/sh

name=dynatrace-persist
version=latest
tag=plfiorini/${name}:${version}

docker build -t ${tag} .
docker push $tag
