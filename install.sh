#!/bin/bash

SERVICE_FILE=/lib/systemd/system/pyroplayer.service

# Link service file to our local versioned file, if not yet done so
if [ ! -f $SERVICE_FILE ]; then
  sudo ln -s `pwd`/service $SERVICE_FILE
fi

# Reload and enable
sudo systemctl daemon-reload
sudo systemctl enable pyroplayer
