docker-compose stop
docker-compose rm
#remoce containers
docker rm $(docker ps --all -q)
#docker rm $(docker ps -a -f status=exited -q)
#remove persistent data
#rm -r ./mysql/data
#delete images
docker rmi --force $(docker images -a -q)
#docker --force rmi $(docker images -a -q)
#Delete volumen
docker volume prune