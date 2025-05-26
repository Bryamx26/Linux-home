FROM php:8.2-apache

# Activer les fichiers .conf custom
RUN echo "IncludeOptional /etc/apache2/extra/*.conf" >> /etc/apache2/apache2.conf

# Copier les VirtualHosts
COPY ./sites/virtualHosts/ /etc/apache2/extra/

# Copier le site dans le conteneur
COPY ./sites/html/ /var/www/html/

# Rendre le script exécutable
RUN chmod +x /var/www/html/Porte_Folio/stats.sh
