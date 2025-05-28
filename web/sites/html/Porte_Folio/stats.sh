#!/bin/bash

# Récupération de la température CPU
CPU_TEMP=$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null)
if [ -n "$CPU_TEMP" ]; then
  CPU_TEMP=$((CPU_TEMP / 1000))
else
  CPU_TEMP="N/A"
fi

# Utilisation CPU
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print int($2 + $4)}')

# Remplacement de la température GPU par celle du CPU
GPU_TEMP=$CPU_TEMP

# RAM en mégaoctets (pour éviter free -g qui peut donner 0 si <1Go)
RAM_USED=$(free -m | awk '/^Mem:/ {print $3}')
RAM_TOTAL=$(free -m | awk '/^Mem:/ {print $2}')
RAM_USAGE=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2 * 100}')

# Conteneur Docker Apache
CONTAINER_NAME="web_services"

# Récupérer les IPs uniques dans les logs Docker stdout (logs Apache)
USERS_CONNECTED=$(docker logs "$CONTAINER_NAME" 2>/dev/null | awk '{print $1}' | sort | uniq | wc -l)

# Fichier template d'entrée et fichier de sortie
TEMPLATE="index_template.html"
OUTPUT="index.html"

# Copie du template vers le fichier de sortie
cp "$TEMPLATE" "$OUTPUT"

# Remplacement des placeholders dans le fichier HTML
sed -i \
  -e "s|{{CPU_TEMP}}|$CPU_TEMP|g" \
  -e "s|{{CPU_USAGE}}|$CPU_USAGE|g" \
  -e "s|{{GPU_TEMP}}|$GPU_TEMP|g" \
  -e "s|{{RAM_USED}}|$RAM_USED Mo|g" \
  -e "s|{{RAM_TOTAL}}|$RAM_TOTAL Mo|g" \
  -e "s|{{RAM_USAGE}}|$RAM_USAGE%|g" \
  -e "s|{{USERS_CONNECTED}}|$USERS_CONNECTED|g" \
    "$OUTPUT"

echo "Le fichier $OUTPUT a été mis à jour avec les données système."
