yum install epel-release
yum install snapd
systemctl enable --now snapd.socket
yum reinstall snapd
snap install core
snap refresh core
ln -s /var/lib/snapd/snap /snap
snap install --classic certbot

Warning: /var/lib/snapd/snap/bin was not found in your $PATH. If you've not restarted your session
         since you installed snapd, try doing that. Please see https://forum.snapcraft.io/t/9469
         for more details.
     
restart session

sudo ln -s /snap/bin/certbot /usr/bin/certbot

certbot certonly --webroot -w /home/admin/web/dobry-brat.com/public_html/ --cert-name dobry-brat.com -d dobry-brat.com,www.dobry-brat.com
#email: dobrybratfond@gmail.com

#Successfully received certificate.
#Certificate is saved at: /etc/letsencrypt/live/dobry-brat.com/fullchain.pem
#Key is saved at:         /etc/letsencrypt/live/dobry-brat.com/privkey.pem
#This certificate expires on 2022-10-05.
#These files will be updated when the certificate renews.
#Certbot has set up a scheduled task to automatically renew this certificate in the background.

#Update nginx and apache configs

systemctl status httpd
systemctl status nginx

systemctl restart httpd
systemctl restart nginx

certbot renew --dry-run

cd /etc/letsencrypt/renewal-hooks/deploy
touch 01-restart-servers.sh
chmod +x 01-restart-servers.sh
nano 01-restart-servers.sh

--------------------
#!/usr/bin/bash

systemctl restart httpd
systemctl restart nginx
--------------------

./01-restart-servers.sh

