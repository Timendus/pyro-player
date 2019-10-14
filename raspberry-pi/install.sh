#!/bin/bash

SERVICE_FILE=/lib/systemd/system/pyroplayer.service

# Reload service file
sudo rm $SERVICE_FILE
sudo cp ./raspberry-pi/pyroplayer.service $SERVICE_FILE

# Reload and enable
sudo systemctl daemon-reload
sudo systemctl enable pyroplayer
