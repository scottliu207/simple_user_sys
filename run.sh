#!/usr/bin/env bash

# The Path Where Execute This Script
ExecDir="$(cd $(dirname "$0") && cd ./docker && pwd)"

# The Name Of This Script
ScriptName=${0##*/}

# Color
# http://inpega.blogspot.com/2015/07/shell.html
RED='\033[0;31m'
GREEN='\033[0;32m'
BlinkRED='\033[0;5;31m'
YELLOW='\033[0;33m'
UWhite='\033[4;37m'
NC='\033[0m' # No Color


# running up local env
function Up() {
	# ComposeName="-f db.yaml "
	ComposeName="-f user_sys.yaml -f db.yaml "
	cd $ExecDir
	echo -e "${YELLOW} Running up container:${NC} $ComposeName"
	docker-compose $ComposeName down
	docker-compose $ComposeName up -d

	echo -e "${YELLOW} Wait for 5 seconds to start the service ${NC}"
	# wait env ok
	for ((i = 0; i <= 4; ++i)); do
		printf "."
		sleep 1
	done

	echo -e "${GREEN} Service is up and running ${NC}"
}

# running down containers
function Down() {
	if [[ -n $(docker ps -a -f name=users -q) ]]; then
		echo -e "${YELLOW}Remove Container${NC}"
		docker rm -f $(docker ps -a -f name=users -q)
	fi

	if [[ -n $(docker network ls -q -f name=users) ]]; then
		echo -e "${YELLOW}Remove Docker Network${NC}"
		docker network rm $(docker network ls -q -f name=users)
	fi

	if [[ -n $(docker volume ls -q -f dangling=true) ]]; then
		echo -e "${YELLOW}Remove Docker Volume${NC}"
		docker volume rm $(docker volume ls -q -f dangling=true)
	fi
}

function Build() {
	docker build -t simple-user-app .
}

# Command line flag
case "$1" in
  -h|--help)
    echo " Usage: "
	echo "   $ScriptName [options]"
	echo " "
	echo " Options: "
	echo "   -u, --up      running up all containers"
	echo "   -d, --down    running down all containers"
	echo "   -b, --build   building up the user-app image"
	;;
  -u | --up)
    Up
	;;

  -d | --down)
	Down
	;;

  -b | --build)
	Build
	;;
*)
  echo "use './run.sh -h' for more info"
esac

