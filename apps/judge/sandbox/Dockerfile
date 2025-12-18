FROM alpine:3.19

RUN apk add --no-cache curl unzip

ARG LUAU_VERSION=0.606
RUN curl -L "https://github.com/Roblox/luau/releases/download/${LUAU_VERSION}/luau-ubuntu.zip" -o /tmp/luau.zip \
    && unzip /tmp/luau.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/luau* \
    && rm /tmp/luau.zip

RUN adduser -D -u 1000 sandbox

WORKDIR /sandbox
RUN chown sandbox:sandbox /sandbox

USER sandbox

ENTRYPOINT ["luau"]

