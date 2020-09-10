#!/bin/bash

command='docker-compose logs db | grep "database system is ready to accept connections"';
server_started_status_code=0;
status=-1;

until [[ $status == $server_started_status_code ]]
do
  sleep 1;
  printf "."
  eval $command;
  status=$?
done
