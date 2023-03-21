FROM alpine:latest

LABEL MAINTAINER="DCsunset"

RUN apk --no-cache add nodejs npm && \
	npm i -g task.json-server

ENV NODE_ENV=production
ENV TJ_DATA_PATH=/data

VOLUME ["/data"]

CMD ["tj-server"]
