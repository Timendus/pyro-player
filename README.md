# Pyro Player

Pyro Player is a quick'n'dirty piece of software to control a simple pyromusical
this December 🎆 😄

We use the DB04R firework firing system / receiver that gets its commands over
433Mhz:

![DB04R receivers with a remote](DB04R.jpg)

## Preparation

### Hardware / software

Warning: This is a work in progress. Instructions may be wrong and the software
isn't done yet.

* Attach a transmitter to a Raspberry Pi ([as shown here](https://www.youtube.com/watch?v=Xe5Bj_N4Crw))
* Install Raspbian on the Raspberry Pi
* In a terminal, run:

```bash
$ apt-get install git node
$ git clone git@github.com:Timendus/pyro-player.git
$ cd pyro-player
$ npm install
$ npm run install-service
```

* Reboot the Raspberry Pi

### Content

* Create a `.srt` subtitle file for your music(video) with commands instead of subtitles
* Those commands correspond to the queues on your firework receivers, available commands [listed here](https://github.com/Timendus/pyro-player/blob/master/shared/commands.js)
* Get your music file and your `.srt` file ready

### Fireworks

* Connect the right fireworks to the right queues on the igniter
* Put them in the right spots and all that, in range of the board's transmitter

## Execution

* Power up the board, wait for it to boot
* Connect to the board's wifi using your phone or laptop
* Open a webbrowser and navigate to `http://192.168.1.1`
* Upload your music file and your `.srt` file
* Press play

The right queues should be lit at the right times, firing the fireworks in sync
with your music.
