#!/bin/bash

# Fonction pour échapper / et & dans les variables (pour sed)
escape_sed() {
  echo "$1" | sed -e 's/[\/&]/\\&/g'
}

# Récupérer les données (exemples, à adapter)

CPU_TEMP=$(sensors 2>/dev/null | grep 'Package id 0:' | awk '{print $4}' | tr -d '+°C')
if [ -z "$CPU_TEMP" ]; then CPU_TEMP="N/A"; fi

CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print 100 - $8}' | cut -d '.' -f1)

GPU_TEMP=$(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader,nounits 2>/dev/null)
GPU_USAGE=$(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader,nounits 2>/dev/null)
GPU_TEMP=${GPU_TEMP:-"N/A"}
GPU_USAGE=${GPU_USAGE:-"N/A"}

RAM_USED=$(free -g | awk '/^Mem:/ {print $3}')
RAM_TOTAL=$(free -g | awk '/^Mem:/ {print $2}')
RAM_USAGE=$(free | awk '/^Mem:/ {printf "%.0f", $3/$2 * 100}')

USERS_CONNECTED=$(who | wc -l)
USERS_ACTIVE=$(who | awk '{print $1}' | sort | uniq | wc -l)

TEMPLATE="template.html"
OUTPUT="index.html"

# Échapper variables
CPU_TEMP_ESC=$(escape_sed "$CPU_TEMP")
CPU_USAGE_ESC=$(escape_sed "$CPU_USAGE")
GPU_TEMP_ESC=$(escape_sed "$GPU_TEMP")
GPU_USAGE_ESC=$(escape_sed "$GPU_USAGE")
RAM_USED_ESC=$(escape_sed "$RAM_USED")
RAM_TOTAL_ESC=$(escape_sed "$RAM_TOTAL")
RAM_USAGE_ESC=$(escape_sed "$RAM_USAGE")
USERS_CONNECTED_ESC=$(escape_sed "$USERS_CONNECTED")
USERS_ACTIVE_ESC=$(escape_sed "$USERS_ACTIVE")

# Remplacement avec sed (séparateur |)
sed -e "s|{{CPU_TEMP}}|$CPU_TEMP_ESC|" \
    -e "s|{{CPU_USAGE}}|$CPU_USAGE_ESC|" \
    -e "s|{{GPU_TEMP}}|$GPU_TEMP_ESC|" \
    -e "s|{{GPU_USAGE}}|$GPU_USAGE_ESC|" \
    -e "s|{{RAM_USED}}|$RAM_USED_ESC|" \
    -e "s|{{RAM_TOTAL}}|$RAM_TOTAL_ESC|" \
    -e "s|{{RAM_USAGE}}|$RAM_USAGE_ESC|" \
    -e "s|{{USERS_CONNECTED}}|$USERS_CONNECTED_ESC|" \
    -e "s|{{USERS_ACTIVE}}|$USERS_ACTIVE_ESC|" \
    "$TEMPLATE" > "$OUTPUT"

echo "Fichier $OUTPUT mis à jour."
