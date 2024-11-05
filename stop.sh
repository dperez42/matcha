docker-compose stop
docker-compose rm
#remoce containers
docker rm $(docker ps -a -f status=exited -q)
#remove persistent data
rm -r ./mysql/data
#delete images
docker rmi $(docker images -a -q)
#Delete volumen
docker volume prune