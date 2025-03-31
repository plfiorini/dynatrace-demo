# Dynatrace Demo

## Token

For the IoT Simulator create a token with the following scopes:

* `metrics.ingest`
* `metrics.read`
* `metrics.write`
* `WriteConfig`

## Running the demo

### Preparation

You need:

* docker
* docker-compose

Add the following to your `/etc/hosts`:

```sh
127.0.0.1	backend.acmecorp.com
```

### Action!

Build the images with:

```sh
docker-compose build
```

Run the system with:

```sh
docker-compose up
```

Run the system and build at the same time (takes some time):

```sh
docker-compose up --build
```

Test with:

```sh
curl -k -I https://backend.acmecorp.com/persist/readyz
```

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
