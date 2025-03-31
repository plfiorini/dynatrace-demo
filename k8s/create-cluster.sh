#!/bin/bash

set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 [cluster_name]"
    exit 1
fi

cluster_name="$1"

if ! minikube status | grep -q "Running"; then
    minikube start --profile $cluster_name
fi

# Set context to the newly created cluster
kubectl config use-context $cluster_name

# Create namespaces
kubectl apply -f namespaces.yaml
