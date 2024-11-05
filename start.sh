echo "your ip: $1"; 
ECHO "Changing .env in back..."
sed -i "s/SERVERIP/$1/" test.txt 
ECHO "Changing .env in app..."
sed -i "s/SERVERIP/$1/" test.txt 

docker-compose build

docker-compose up 