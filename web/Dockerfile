FROM httpd:2.4

# Active tous les virtual hosts *.conf
RUN sed -i 's|#Include conf/extra/httpd-vhosts.conf|IncludeOptional conf/extra/*.conf|' /usr/local/apache2/conf/httpd.conf

# Copie les virtual hosts
COPY ./sites/virtualHosts/ /usr/local/apache2/conf/extra/

# --- Étapes ajoutées pour cron et le script ---

# Installer les outils nécessaires
RUN apt-get update && apt-get install -y \
    cron \
    procps \
    gawk \
    coreutils \
    util-linux \
    && rm -rf /var/lib/apt/lists/*

# Copier le script dans un emplacement global
COPY ./sites/html/Porte_Folio/stats.sh /usr/local/bin/stats.sh

# Rendre le script exécutable
RUN chmod +x /usr/local/bin/stats.sh

# Créer une tâche cron toutes les minutes
RUN echo "* * * * * /usr/local/bin/stats.sh >> /var/log/stats.log 2>&1" > /etc/cron.d/stats-cron

# Appliquer la tâche cron
RUN chmod 0644 /etc/cron.d/stats-cron && crontab /etc/cron.d/stats-cron && touch /var/log/stats.log

# CMD : Démarrer cron puis Apache au premier plan
CMD cron && httpd-foreground
