#!/bin/bash

for i in {1..5}
do
   #python3 ~/agarioBot/Bot/agario_main_bot.py &        #This is for IDE run
   python3 /usr/src/app/Bot/agario_main_bot.py &       #This is for dockerizing
done
#sleep 60
#pkill -f main.py
