export MY_RESOURCE_GROUP_NAME="rg-test-itn-001"
export REGION="italynorth"
export MY_AKS_CLUSTER_NAME="aks-test-itn-001"

az group create --name $MY_RESOURCE_GROUP_NAME --location $REGION
az aks create --resource-group $MY_RESOURCE_GROUP_NAME --name $MY_AKS_CLUSTER_NAME --node-count 1 --generate-ssh-keys
az aks get-credentials --resource-group $MY_RESOURCE_GROUP_NAME --name $MY_AKS_CLUSTER_NAME
kubectl config use-context $MY_AKS_CLUSTER_NAME
kubectl run testcurl --image=curlimages/curl --restart=Never -- curl https://api.ipify.org
