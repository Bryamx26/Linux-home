FROM debian:bullseye-slim

RUN apt-get update && \
    apt-get install -y bind9 && \
    rm -rf /var/lib/apt/lists/*

COPY config /etc/bind

EXPOSE 53/udp 53/tcp

CMD ["named", "-g"]
