🐀 Ratreacom — Aplicación Node.js con Express y EJS
Proyecto base desarrollado con Node.js, Express y EJS, estructurado para ejecutarse tanto de forma local como mediante Docker.
Incluye un sistema de vistas, una carpeta src para la lógica del servidor y configuración lista para levantar el entorno con docker-compose.

📁 Estructura del proyecto
Código
ratreacom/
│── public/               # Archivos estáticos (CSS, JS, imágenes)
│── src/                  # Código del servidor (Express)
│── views/                # Plantillas EJS
│── .env                  # Variables de entorno
│── .gitignore
│── Dockerfile            # Imagen Docker del proyecto
│── docker-compose.yml    # Orquestación del contenedor
│── package.json
│── package-lock.json
✨ Funcionalidades
Servidor web con Express.

Sistema de plantillas EJS para renderizar vistas.

Carpeta public/ para servir recursos estáticos.

Configuración lista para ejecutarse en Docker.

Estructura modular para ampliar rutas, controladores y servicios.

🚀 Cómo ejecutar (modo local)
Clona el repositorio:

Código
git clone https://github.com/mothalbete/ratreacom
Entra en la carpeta:

Código
cd ratreacom
Instala dependencias:

Código
npm install
Crea un archivo .env (si no existe) con tus variables de entorno.

Inicia el servidor:

Código
npm start
Abre en el navegador:

Código
http://localhost:3000
🐳 Ejecución con Docker
Construye y levanta el contenedor:

Código
docker-compose up --build
Accede a la aplicación:

Código
http://localhost:3000
🛠️ Tecnologías utilizadas
Node.js

Express

EJS

Docker

JavaScript
