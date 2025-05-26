FROM php:8.2-apache

# Activer les modules DAV et DAV Lock
RUN a2enmod dav dav_lock

# Inclure les configs custom
RUN echo "IncludeOptional /etc/apache2/extra/*.conf" >> /etc/apache2/apache2.conf

# Copier les VirtualHosts
COPY ./sites/virtualHosts/ /etc/apache2/extra/

# Copier le site dans le conteneur
COPY ./sites/html/ /var/www/html/

# Rendre le script exécutable
RUN chmod +x /var/www/html/Porte_Folio/stats.sh
RUN chown -R www-data:www-data /var/www/html/Porte_Folio && \
    chmod -R 755 /var/www/html/Porte_Folio