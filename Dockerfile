FROM alpine:3.4

# Update & install required packages
RUN apk update && \
    apk add nodejs=6.7.0-r1

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; npm install --only=production

# Copy app source
COPY ./dist /www
COPY ./resources /www/resources

# Set work directory to /www
WORKDIR /www

RUN rm -rf /tmp/* /var/cache/apk/* /root/.npm /root/.node-gyp

# set your port
ENV PORT 8080

# expose the port to outside world
EXPOSE  23443

# start command as per package.json
CMD ["node", "index.js"]