# Lights Application

Lights application for OakOS v5.0.X

## Running locally

Running locally is easiest when you specify an OakOS Unit as a global in the package.json
Change `LIGHTS_HOST=192.168.0.66:443` to the IP of the unit running OakOS on your LAN or run

``` bash
export LIGHTS_HOST=[OakOS IP]:443
```

### Before you begin

Make sure that you are running the right version of Node locally. You will find the required version in the `.nvmrc` file
If you are not running the same version (`node -v`) then you will need to run 

``` bash
nvm install $(cat .nvmrc)
npm run rebuild
```

### Now you can run electron locally

``` bash
npm run dev
```

## Running local Docker container

Running docker container on Linux locally will still need to have the remote IP of the Unit running OakOS. To do this you can just run this first in a Linux environment

``` bash
export LIGHTS_HOST=[OakOS IP]:443
```

or add the environmental variable to the `Dockerfile`

``` bash
ENV NODE_ENV=production \
    LIGHTS_HOST=[OakOS IP]:443
```

Now that you have the gRPC server set to an OakOS unit you can run

``` bash
xhost +
docker-compose up --build
```
