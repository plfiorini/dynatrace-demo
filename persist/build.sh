#!/bin/sh

name=dynatrace-persist
version=`date +"%Y%m%d%H%S"`
tag=plfiorini/${name}:${version}

docker build -t ${tag} .
docker push $tag

echo "Update image version to $version"
