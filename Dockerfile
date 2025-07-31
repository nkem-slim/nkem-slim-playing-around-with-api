FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        openssh-server sudo iputils-ping ca-certificates nginx && \
    mkdir /run/sshd && \
    if ! id -u ubuntu >/dev/null 2>&1; then \
        useradd --create-home --uid 1000 --shell /bin/bash ubuntu; \
    fi && \
    echo 'ubuntu:pass123' | chpasswd && \
    usermod -aG sudo ubuntu && \
    sed -ri 's/#?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config && \
    sed -ri 's/#?PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only the built static files
COPY dist/ /app/

RUN chown -R ubuntu:ubuntu /app

# Configure nginx to serve static files
RUN echo 'server {\n\
    listen 80;\n\
    root /app;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/sites-available/default

EXPOSE 80 22

RUN ssh-keygen -A

RUN echo '#!/bin/bash\n\
echo "Starting nginx..."\n\
service nginx start\n\
echo "Starting SSH daemon..."\n\
/usr/sbin/sshd -D' > /startup.sh && \
    chmod +x /startup.sh

CMD ["/startup.sh"]