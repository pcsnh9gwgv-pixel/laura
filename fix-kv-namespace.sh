#!/bin/bash

# ============================================
# Script para Arreglar KV Namespace y Nombre
# Wild Fitness / Laura Project
# ============================================

set -e  # Salir si hay error

echo "🔧 Arreglando configuración de Cloudflare Workers..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ============================================
# PASO 1: Verificar que estamos en el directorio correcto
# ============================================

if [ ! -f "wrangler.toml" ]; then
    echo -e "${RED}❌ Error: No se encuentra wrangler.toml${NC}"
    echo "Por favor, ejecuta este script desde el directorio del proyecto laura"
    exit 1
fi

echo -e "${GREEN}✅ Directorio correcto encontrado${NC}"
echo ""

# ============================================
# PASO 2: Verificar autenticación
# ============================================

echo "🔐 Verificando autenticación con Cloudflare..."
if npx wrangler whoami > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Autenticado correctamente${NC}"
else
    echo -e "${YELLOW}⚠️  No estás autenticado. Ejecutando login...${NC}"
    npx wrangler login
fi
echo ""

# ============================================
# PASO 3: Crear KV Namespace
# ============================================

echo "📦 Creando KV Namespace..."
echo ""

# Ejecutar comando y capturar output
KV_OUTPUT=$(npx wrangler kv:namespace create "ACTIVITIES_KV" 2>&1)
echo "$KV_OUTPUT"
echo ""

# Extraer el ID del output
KV_ID=$(echo "$KV_OUTPUT" | grep -o 'id = "[^"]*"' | cut -d'"' -f2)

if [ -z "$KV_ID" ]; then
    echo -e "${RED}❌ No se pudo obtener el KV ID${NC}"
    echo "Intentando listar namespaces existentes..."
    npx wrangler kv:namespace list
    echo ""
    echo "Si ya existe un namespace llamado 'laura-ACTIVITIES_KV', copia su ID manualmente."
    echo "Ejecuta: grep 'id = ' wrangler.toml"
    exit 1
fi

echo -e "${GREEN}✅ KV Namespace creado: $KV_ID${NC}"
echo ""

# ============================================
# PASO 4: Actualizar wrangler.toml
# ============================================

echo "📝 Actualizando wrangler.toml..."

# Backup
cp wrangler.toml wrangler.toml.backup

# Reemplazar nombre
sed -i.tmp 's/name = "wild-fitness-email-worker"/name = "laura"/' wrangler.toml

# Reemplazar KV ID
sed -i.tmp "s/id = \"TU_KV_NAMESPACE_ID\"/id = \"$KV_ID\"/" wrangler.toml

# Limpiar archivos temporales
rm -f wrangler.toml.tmp

echo -e "${GREEN}✅ wrangler.toml actualizado${NC}"
echo ""

# ============================================
# PASO 5: Actualizar wrangler-scheduled.toml
# ============================================

echo "📝 Actualizando wrangler-scheduled.toml..."

# Backup
cp wrangler-scheduled.toml wrangler-scheduled.toml.backup

# Reemplazar KV ID
sed -i.tmp "s/id = \"TU_KV_NAMESPACE_ID\"/id = \"$KV_ID\"/" wrangler-scheduled.toml

# Limpiar archivos temporales
rm -f wrangler-scheduled.toml.tmp

echo -e "${GREEN}✅ wrangler-scheduled.toml actualizado${NC}"
echo ""

# ============================================
# PASO 6: Verificar cambios
# ============================================

echo "🔍 Verificando cambios..."
echo ""

echo "📄 wrangler.toml:"
echo "  Nombre: $(grep '^name = ' wrangler.toml)"
echo "  KV ID: $(grep 'id = ' wrangler.toml | grep -v '#' | head -1)"
echo ""

echo "📄 wrangler-scheduled.toml:"
echo "  KV ID: $(grep 'id = ' wrangler-scheduled.toml | grep -v '#' | head -1)"
echo ""

# ============================================
# PASO 7: Commit cambios
# ============================================

echo "💾 ¿Quieres hacer commit de los cambios? (s/n)"
read -r COMMIT_CHANGES

if [ "$COMMIT_CHANGES" = "s" ] || [ "$COMMIT_CHANGES" = "S" ]; then
    echo ""
    echo "📤 Haciendo commit..."
    
    git add wrangler.toml wrangler-scheduled.toml
    git commit -m "fix: corregir nombre del worker y configurar KV namespace ID"
    
    echo -e "${GREEN}✅ Commit realizado${NC}"
    echo ""
    
    echo "📤 ¿Quieres hacer push a GitHub? (s/n)"
    read -r PUSH_CHANGES
    
    if [ "$PUSH_CHANGES" = "s" ] || [ "$PUSH_CHANGES" = "S" ]; then
        git push origin main
        echo -e "${GREEN}✅ Push realizado${NC}"
        echo ""
        echo "🎉 ¡Listo! Cloudflare debería detectar los cambios y hacer deploy automáticamente."
    fi
else
    echo -e "${YELLOW}⚠️  Recuerda hacer commit y push manualmente:${NC}"
    echo "  git add wrangler.toml wrangler-scheduled.toml"
    echo "  git commit -m 'fix: corregir configuración KV namespace'"
    echo "  git push origin main"
fi

echo ""
echo "============================================"
echo -e "${GREEN}✨ ¡Configuración completada!${NC}"
echo "============================================"
echo ""
echo "📋 Resumen de cambios:"
echo "  ✅ Nombre del worker cambiado a 'laura'"
echo "  ✅ KV Namespace ID configurado: $KV_ID"
echo "  ✅ Ambos archivos wrangler actualizados"
echo ""
echo "🚀 Próximos pasos:"
echo "  1. Si hiciste push, espera el deploy automático de Cloudflare"
echo "  2. O ejecuta manualmente: npx wrangler deploy"
echo ""
echo "🔍 Para verificar el deploy:"
echo "  - Ve a: https://dash.cloudflare.com"
echo "  - Workers & Pages → laura"
echo "  - Revisa los logs del último deploy"
echo ""
