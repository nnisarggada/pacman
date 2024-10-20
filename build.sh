#!/bin/bash

platforms=(
    "windows/amd64"
    "darwin/amd64"
    "linux/amd64"
    "linux/arm"
    "linux/arm64"
)

for platform in "${platforms[@]}"; do
    IFS="/" read -r os arch <<< "$platform"
    output="dist/pacman_${os}_${arch}"
    echo "Building for $os/$arch..."
    GOOS=$os GOARCH=$arch go build -o $output
done

echo "Build completed."
