#!/bin/bash

# CPU temp (exemple, dépend de ta machine)
CPU_TEMP=$(sensors | grep 'Package id 0:' | awk '{print $4}' | tr -d '+°C')
# Si pas sensors, tu peux mettre une valeur statique ou autre commande adaptée

# CPU usage %
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}' | cut -d '.' -f1)

# GPU temp et usage (exemple pour Nvidia, adapter selon GPU)
GPU_TEMP=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits 2>/dev/null)
GPU_USAGE=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits 2>/dev/null)

# Si pas de Nvidia, valeurs par défaut
GPU_TEMP=${GPU_TEMP:-"N/A"}
GPU_USAGE=${GPU_USAGE:-"N/A"}

# RAM utilisé, total en GB
RAM_USED=$(free -g | awk '/^Mem:/ {print $3}')
RAM_TOTAL=$(free -g | awk '/^Mem:/ {print $2}')
RAM_USAGE=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2 * 100}')

# Utilisateurs connectés
USERS_CONNECTED=$(who | wc -l)

# Utilisateurs actifs (exemple: nombre de sessions avec activité - à adapter)
USERS_ACTIVE=$(who | awk '{print $1}' | sort | uniq | wc -l)

# Fichier template et sortie
TEMPLATE="template.html"
OUTPUT="index.html"

# Remplacement des placeholders
sed -e "s/{{CPU_TEMP}}/$CPU_TEMP/" \
    -e "s/{{CPU_USAGE}}/$CPU_USAGE/" \
    -e "s/{{GPU_TEMP}}/$GPU_TEMP/" \
    -e "s/{{GPU_USAGE}}/$GPU_USAGE/" \
    -e "s/{{RAM_USED}}/$RAM_USED/" \
    -e "s/{{RAM_TOTAL}}/$RAM_TOTAL/" \
    -e "s/{{RAM_USAGE}}/$RAM_USAGE/" \
    -e "s/{{USERS_CONNECTED}}/$USERS_CONNECTED/" \
    -e "s/{{USERS_ACTIVE}}/$USERS_ACTIVE/" \
    "$TEMPLATE" > "$OUTPUT"

echo "Fichier $OUTPUT mis à jour avec les données système."
