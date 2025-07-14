# Usa una imagen base de Node.js
FROM node:22-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json y instala dependencias
# Esto aprovecha el cache de Docker si no cambian las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto del código de la aplicación, INCLUYENDO el entrypoint.sh
COPY . .

RUN chmod +x entrypoint.sh

# Expone el puerto 3000
EXPOSE 3000

# Establece el entrypoint para que sea nuestro script.
# Este es el comando que se ejecutará cuando el contenedor se inicie.
ENTRYPOINT ["/app/entrypoint.sh"]