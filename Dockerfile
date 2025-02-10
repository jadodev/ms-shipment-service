FROM node:22-alpine

# Establecemos el directorio de trabajo en el contenedor
WORKDIR /src/app

# Copiamos el archivo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalamos las dependencias de la aplicación
RUN npm install

# Copiamos el resto de los archivos de la aplicación
COPY . .

# Exponemos el puerto en el que la aplicación estará escuchando
EXPOSE 8000

# Comando para iniciar la aplicación
CMD ["yarn", "dev"]
