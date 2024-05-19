#!/bin/bash

# Run the container
run_container() {
  cd ./docker
  docker-compose up -d 
}

# Stop the container
stop_container() {
  cd ./docker  
  docker-compose down 
}

# Main logic to handle "up" and "down" commands
case $1 in
  up)
    echo "Running containers..."
    run_container
    ;;
  down)
    echo "Stopping containers..."
    stop_container
    ;;
  *)
    echo "Usage: ./run.sh [up|down]"
    ;;
esac