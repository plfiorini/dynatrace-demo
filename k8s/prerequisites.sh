#!/bin/bash

set -e

# Create cluster with minikube
if ! command -v minikube &> /dev/null; then
    echo "minikube could not be found, installing..."
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    chmod +x minikube-linux-amd64
    sudo mv minikube-linux-amd64 /usr/local/bin/minikube
fi

# Install Helm if not already installed
if ! command -v helm &> /dev/null; then
    echo "Helm could not be found, installing..."
    curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
fi
