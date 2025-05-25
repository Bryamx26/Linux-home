#!/bin/bash

# Récupération des données système
CPU_TEMP=$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null)
if [ -n "$CPU_TEMP" ]; then
  CPU_TEMP=$((CPU_TEMP / 1000))
else
  CPU_TEMP="N/A"
fi

CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2 + $4)}')

GPU_TEMP="N/A"   # À adapter si tu as une commande pour le GPU
GPU_USAGE="N/A"

RAM_USED=$(free -g | awk '/^Mem:/ {print $3}')
RAM_TOTAL=$(free -g | awk '/^Mem:/ {print $2}')
RAM_USAGE=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2 * 100}')

USERS_CONNECTED=$(who | wc -l)
USERS_ACTIVE=$(w -h | wc -l)

# Fichier template d'entrée et fichier de sortie
TEMPLATE="index_template.html"
OUTPUT="index.html"

# Copie du template vers le fichier de sortie
cp "$TEMPLATE" "$OUTPUT"

# Remplacement des placeholders dans le fichier de sortie
sed -i \
  -e "s/{{CPU_TEMP}}/$CPU_TEMP/g" \
  -e "s/{{CPU_USAGE}}/$CPU_USAGE/g" \
  -e "s/{{GPU_TEMP}}/$GPU_TEMP/g" \
  -e "s/{{GPU_USAGE}}/$GPU_USAGE/g" \
  -e "s/{{RAM_USED}}/$RAM_USED/g" \
  -e "s/{{RAM_TOTAL}}/$RAM_TOTAL/g" \
  -e "s/{{RAM_USAGE}}/$RAM_USAGE/g" \
  -e "s/{{USERS_CONNECTED}}/$USERS_CONNECTED/g" \
  -e "s/{{USERS_ACTIVE}}/$USERS_ACTIVE/g" \
  "$OUTPUT"

echo "Le fichier $OUTPUT a été mis à jour avec les données système."
