FROM alpine:latest

LABEL MAINTAINER="DCsunset"

RUN apk --no-cache add nodejs npm && \
	npm i -g task.json-server

ENV NODE_ENV=production

CMD ["tj-server"]
