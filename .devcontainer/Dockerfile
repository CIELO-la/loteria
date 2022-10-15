ARG VARIANT=3.16
ARG NODE_VERSION=18.3.0
FROM node:${NODE_VERSION}-alpine${VARIANT}

RUN apk upgrade \
  && apk --update add git
RUN npm install --location=global npm@8