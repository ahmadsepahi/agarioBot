#!/bin/bash

for i in {1..5}
do
   python3 ~/agarioBot/Bot/agario_main_bot.py &
done
#sleep 60
#pkill -f main.py