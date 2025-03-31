#!/bin/bash

set -e

domain="acmecorp.com"
path=$(dirname `readlink -f $0`)/certificates

mkdir -p $path

pushd $path > /dev/null

# Generate a private key
openssl genrsa -out ${domain}.key 2048

# Create a configuration file for the CSR with wildcard domain
cat > ${domain}.conf << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = *.${domain}

[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.${domain}
DNS.2 = ${domain}
EOF

# Generate a CSR using the configuration
openssl req -new -key ${domain}.key -out ${domain}.csr -config ${domain}.conf

# Generate a self-signed certificate valid for 365 days
openssl x509 -req -days 365 -in ${domain}.csr -signkey ${domain}.key -out ${domain}.crt -extensions v3_req -extfile ${domain}.conf

# Verify the certificate
openssl x509 -in ${domain}.crt -text -noout

# Create a combined PEM file for nginx
cat ${domain}.key ${domain}.crt > ${domain}.pem

popd > /dev/null
