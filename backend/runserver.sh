#!/bin/bash

docker stop ft_transcendence
docker rm ft_transcendence
docker rmi ft_transcendence
docker build -t ft_transcendence .
docker run --name ft_transcendence -d -p 8000:8000 ft_transcendence