# Nginx 이미지를 기반으로 사용
FROM nginx:latest

# OpenSSL 설치
RUN apt-get update && apt-get install -y openssl

# Nginx 설정 파일을 컨테이너로 복사
COPY ./srcs/nginx.conf /etc/nginx/conf.d/default.conf

# SSL 인증서 생성을 위한 스크립트 추가
COPY ./srcs/generate_ssl.sh /usr/local/bin/generate_ssl.sh
RUN chmod +x /usr/local/bin/generate_ssl.sh

# Nginx 시작 전에 SSL 인증서를 생성하도록 CMD 설정
CMD ["/bin/bash", "-c", "/usr/local/bin/generate_ssl.sh && nginx -g 'daemon off;'"]

# 80, 443 포트 개방
EXPOSE 80 443
