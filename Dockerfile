# vim:set ft=dockerfile:
FROM alpine:edge

RUN apk add --update lighttpd; \
rm -rf /var/cache/apk/*;
COPY . /www
RUN chown -R nobody:nogroup /www
USER nobody

WORKDIR /www

EXPOSE 8080
ENTRYPOINT ["/usr/sbin/lighttpd", "-D",  "-f", "lighttpd.conf", "."]  
