FROM httpd:2.4

RUN sed -i 's|#Include conf/extra/httpd-vhosts.conf|IncludeOptional conf/extra/*.conf|' /usr/local/apache2/conf/httpd.conf

COPY ./sites/virtualHosts/ /usr/local/apache2/conf/extra/
