# Dynatrace Demo

## Token

For the IoT Simulator create a token with the following scopes:

* `metrics.ingest`
* `metrics.read`
* `metrics.write`
* `WriteConfig`

## Kubernetes

To create a Kubernetes cluster with this project you need:

* minikube
* kubectl
* helm

Create the cluster with:

```sh
cd k8s
./create-cluster.sh dynatrace-demo
```
