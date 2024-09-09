#!/bin/bash

# SSL 인증서 디렉토리 생성
mkdir -p /etc/nginx/ssl

# OpenSSL을 사용하여 자체 서명된 SSL 인증서 생성
openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/cert.key \
    -out /etc/nginx/ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=example.com"

echo "SSL 인증서 생성 완료"
