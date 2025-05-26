FROM php:8.2-apache

# Activer les modules DAV et DAV Lock
RUN a2enmod dav dav_lock rewrite

# Copier le site dans le dossier Apache
COPY ./sites/html/Porte_Folio/ /var/www/html/Porte_Folio/

# Donner les bonnes permissions (Apache user = www-data)
RUN chown -R www-data:www-data /var/www/html/Porte_Folio \
 && chmod -R 777 /var/www/html/Porte_Folio

# Ecrire un VirtualHost par défaut pour pointer sur Porte_Folio
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot "/var/www/html/Porte_Folio"\n\
    <Directory "/var/www/html/Porte_Folio">\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog /proc/self/fd/2\n\
    CustomLog /proc/self/fd/1 combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Inclure les configs custom (optionnel, si tu as besoin)
RUN echo "IncludeOptional /etc/apache2/extra/*.conf" >> /etc/apache2/apache2.conf

# Rendre le script stats.sh exécutable (si tu en as un)
RUN chmod +x /var/www/html/Porte_Folio/stats.sh

# Exposer le port 80
EXPOSE 80
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/apache2.conf
# Lancer Apache en mode foreground
CMD ["apache2-foreground"]

# Rendre le script exécutable et donner les bons droits
RUN chmod +x /var/www/html/Porte_Folio/stats.sh && \
    chown www-data:www-data /var/www/html/Porte_Folio/stats.sh