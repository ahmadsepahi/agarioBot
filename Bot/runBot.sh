#!/bin/bash

for i in {1..5}
do
   /usr/local/opt/python@3.8/bin/python3 ~/agarioBot/Bot/agario_main_bot.py &
done
#sleep 60
#pkill -f main.py