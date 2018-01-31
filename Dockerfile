FROM debian:stretch

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y gnupg2

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y git

RUN useradd -ms /bin/bash nodejs

RUN mkdir /opt/nodejs
RUN chown nodejs -R /opt/nodejs

USER nodejs

WORKDIR /opt/nodejs

RUN git clone https://github.com/benratti/GoogleHomeKodi.git

RUN ls -lh GoogleHomeKodi/*

WORKDIR /opt/nodejs/GoogleHomeKodi

RUN npm install

COPY kodi-hosts.config.js /opt/nodejs/GoogleHomeKodi/kodi-hosts.config.js

CMD node server.js

