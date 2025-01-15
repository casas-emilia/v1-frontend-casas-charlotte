# Usa una imagen base oficial de Node.js para construir el proyecto
FROM node:18-alpine AS builder

# Instala herramientas necesarias para construir dependencias nativas
RUN apk add --no-cache python3 make g++ bash

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos esenciales para instalar dependencias
COPY package*.json ./

# Instala las dependencias (incluidas las de desarrollo)
RUN npm ci

# Copia el resto del código fuente al contenedor
COPY . .

# Construye la aplicación con Vite
RUN npm run build

# Usa una imagen ligera de NGINX para servir los archivos estáticos
FROM nginx:1.27-alpine

# Copia los archivos estáticos generados al contenedor NGINX
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para servir la aplicación
ENV PORT 80
EXPOSE 80

# Comando por defecto para ejecutar NGINX
CMD ["nginx", "-g", "daemon off;"]
