FROM httpd:2.4

# Active tous les virtual hosts *.conf
RUN sed -i 's|#Include conf/extra/httpd-vhosts.conf|IncludeOptional conf/extra/*.conf|' /usr/local/apache2/conf/httpd.conf

# Copie les virtual hosts
COPY ./sites/virtualHosts/ /usr/local/apache2/conf/extra/

# --- Étapes ajoutées pour cron et le script ---

