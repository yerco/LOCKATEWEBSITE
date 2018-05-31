FROM lock8/lock8-base:latest
MAINTAINER Yerco <yerco@hotmail.com>

# create a non-root user
RUN groupadd -g 999 appuser && \
    useradd -r -u 999 -g appuser appuser

# create workdir and assign permissions to non-root user
RUN set -xe && \
    mkdir /var/www/html/lockate_site  && \
    chown -R appuser:appuser /var/www/html/lockate_site

# zmq extension for php
RUN apt-get update && apt-get install -y zlib1g-dev libzmq-dev wget git lsof vim \
    && pecl install zmq-beta \
    && docker-php-ext-install zip \
    && docker-php-ext-install pdo pdo_mysql

# http://zeromq.org/bindings:php
RUN echo 'extension=zmq.so' >> /usr/local/etc/php/conf.d/docker-php-ext-zmq.ini

RUN mkdir -p /home/appuser/.composer && \
    chown -R appuser:appuser /home/appuser/.composer && \
    chmod +w -R /home/appuser/.composer

# switch from root to appuser
USER appuser

# chown included otherwise copied as root
COPY --chown=appuser:appuser composer.phar  /var/www/html/lockate_site
RUN chmod +x /var/www/html/lockate_site/composer.phar
COPY --chown=appuser:appuser phpunit-6.5.phar /var/www/html/lockate_site
RUN chmod +x /var/www/html/lockate_site/phpunit-6.5.phar
# copy PHP code
COPY --chown=appuser:appuser . /var/www/html/lockate_site/

COPY  --chown=appuser:appuser ./parameters.yml /var/www/html/lockate_site/app/config
# one line below for debugging
RUN cat /var/www/html/lockate_site/app/config/parameters.yml
WORKDIR /var/www/html/lockate_site

# symfony
RUN ./composer.phar install
RUN chmod a+w ./var/logs/* && chmod a+w ./var/cache/*
RUN chmod -R a+w ./var/sessions
RUN ./composer.phar dump-autoload

CMD ["php", "bin/console", "server:run", "*:8080"]
