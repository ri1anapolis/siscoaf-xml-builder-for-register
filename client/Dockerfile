FROM node:12.16-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN apk --update --no-cache add git
RUN git clone https://github.com/fmartins-andre/siscoaf-xml-builder-for-register.git .
RUN yarn install
RUN cd client && yarn install && yarn build
CMD [ "yarn", "start" ]