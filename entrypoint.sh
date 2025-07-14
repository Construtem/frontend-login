#!/bin/sh

# Este script se ejecuta DENTRO del contenedor en GKE.

# 1. Imprime un mensaje para saber que el script se está ejecutando.
echo "🚀 Entrypoint iniciado. Preparando para construir la aplicación Next.js..."

# 2. Ejecuta el build de Next.js.
# En este punto, Kubernetes ya ha inyectado las variables de entorno
# desde tus secretos, por lo que `process.env.NEXT_PUBLIC_...` tendrá los valores correctos.
npm run build

# 3. Imprime un mensaje de éxito y procede a iniciar el servidor.
echo "✅ Build completado. Iniciando el servidor de Next.js..."

# 4. Inicia la aplicación.
# 'exec' reemplaza el proceso del script con el proceso de `npm start`.
# Esto es una buena práctica para que las señales (como las de parada) lleguen correctamente a la aplicación.
exec npm start