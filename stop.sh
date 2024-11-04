docker-compose stop
docker-compose rm
#remove persistent data
rm -r ./mysql/data
#delete images
docker rmi tmp_mysql
docker rmi tmp_front-app
docker rmi tmp_front-app2
docker rmi tmp_back-app
#Delete volumen
docker volume prune