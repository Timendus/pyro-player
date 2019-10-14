#!/bin/bash

# This script just follows the steps described in
# https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
# to set up a WiFi access point

sudo su

apt -y install dnsmasq hostapd

systemctl stop dnsmasq
systemctl stop hostapd

## Configuring a static IP

echo "
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
" >> /etc/dhcpcd.conf

service dhcpcd restart

## Configuring the DHCP server (dnsmasq)

mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig

# Modified this file from the example to catch all requests
echo "
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
address=/#/192.168.4.1
" > /etc/dnsmasq.conf

systemctl start dnsmasq
systemctl reload dnsmasq

## Configuring the access point host software (hostapd)

echo "
interface=wlan0
driver=nl80211
ssid=PyroPlayer
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=PyroMusical
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
" > /etc/hostapd/hostapd.conf

echo 'DAEMON_CONF="/etc/hostapd/hostapd.conf"' >> /etc/default/hostapd

## Start it up

systemctl unmask hostapd
systemctl enable hostapd
systemctl start hostapd
