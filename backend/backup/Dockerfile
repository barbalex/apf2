# see:
# https://github.com/cheyer/docker-cron
# https://github.com/Ekito/docker-cron

FROM ubuntu:latest

#Install Cron and curl
RUN apt-get update
RUN apt-get -y install cron
RUN apt-get -y install curl
RUN apt-get -y install bash
# install docker
# https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04
#RUN apt-get -y install apt-transport-https
#RUN apt-get -y install ca-certificates 
#RUN apt-get -y install software-properties-common
#RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
#RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
#RUN apt update
#RUN apt-get -y install docker-ce

ADD dropbox_uploader.conf /.dropbox_uploader/dropbox_uploader.conf
RUN curl "https://raw.githubusercontent.com/andreafabrizi/Dropbox-Uploader/master/dropbox_uploader.sh" -o dropbox_uploader.sh
RUN chmod +x dropbox_uploader.sh

# Add crontab file in the cron directory
ADD crontab /etc/cron.d/backup-cron
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/backup-cron

ADD backup.sh /backup.sh
RUN chmod +x /backup.sh
# see: https://stackoverflow.com/a/37458519/712005
RUN chmod 0744 /backup.sh

# Create the log file to be able to run tail
RUN touch /var/log/cron.log

# create schared folder to write backups to
RUN mkdir /shared
RUN chmod -R 777 /shared

# Run the command on container startup
CMD cron && tail -f /var/log/cron.log