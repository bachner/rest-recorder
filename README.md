# rest-recorder
Recording all rest requests to file

## Run the application
`npm run start`

## Build docker image
`docker build -f docker/Dockerfile -t bachner/rest-recording-app --build-arg HTTP_PROXY=http://proxy.il.hpecorp.net:8080 --build-arg HTTPS_PROXY=http://proxy.il.hpecorp.net:8080 .`

## Run docker
`docker run -d -p 16060:6060 --rm --name ofer-app bachner/docker-demo:latest`
