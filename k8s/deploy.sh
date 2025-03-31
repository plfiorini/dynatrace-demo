#!/bin/sh

curdir=$(dirname `realpath $0`)

kubectl apply -k $curdir/persist
