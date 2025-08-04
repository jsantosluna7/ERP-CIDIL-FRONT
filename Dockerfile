# Etapa 1: Build de Angular
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servir con NGINX en puerto 4200
FROM nginx:alpine
# Copia build
COPY --from=builder /app/dist/erp-cidil-front /usr/share/nginx/html

# Reemplazamos el nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Exponemos el puerto correcto
EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
