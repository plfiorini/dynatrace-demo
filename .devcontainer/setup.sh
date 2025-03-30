#!/bin/bash

set -e

rootdir="$(dirname "$(realpath "$0")")/.."

pushd $rootdir/iot-simulator > /dev/null
npm install
popd > /dev/null
