Cotton bale tag/weight recorder software designed for use on a Raspberry Pi or similar arm computer with touchscreen display and numpad

To run locally:
1)Install dependencies:
npm init
npm install

2)Run server: node server
3) Open index.html in browser


To deploy on Rpi or similar Linux based:
1) Add kiosk.sh to autostart to boot into kiosk mode showing chrome full screen

2) Set appropriate static IP so bales can be read from the server using the cotton-front program

3) Set numlockx so numpad starts in Num Lock mode

4) Daemonize server.js with pm2

5) Set cronjob to restart pm2 server each night

6) Install apache2 and install cotton-front bale viewing software in the /var/www/html directory



