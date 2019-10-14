#!/bin/bash

# This script just follows the steps described in
# https://www.raspberrypi.org/documentation/configuration/wireless/access-point.md
# to set up a WiFi access point

sudo apt install dnsmasq hostapd

sudo systemctl stop dnsmasq
sudo systemctl stop hostapd

## Configuring a static IP

echo "
interface wlan0
static ip_address=192.168.4.1/24
nohook wpa_supplicant
" >> /etc/dhcpcd.conf

sudo service dhcpcd restart

## Configuring the DHCP server (dnsmasq)

sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig

# Modified this file from the example to catch all requests
echo "
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
address=/#/192.168.4.1
" > /etc/dnsmasq.conf

sudo systemctl reload dnsmasq

## Configuring the access point host software (hostapd)

echo "
interface=wlan0
driver=nl80211
ssid=NameOfNetwork
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=AardvarkBadgerHedgehog
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
" > /etc/hostapd/hostapd.conf

echo 'DAEMON_CONF="/etc/hostapd/hostapd.conf"' >> /etc/default/hostapd

## Start it up

sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl start hostapd

## Add routing and masquerade

echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
sudo iptables -t nat -A  POSTROUTING -o eth0 -j MASQUERADE
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
echo "iptables-restore < /etc/iptables.ipv4.nat" >> /etc/rc.local
