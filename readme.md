# Xioexamen2

Aplicacion web CRUD para gestionar clientes y reservas con subida de comprobante en imagen.

## Resumen

El proyecto permite:

- Crear, listar, editar y eliminar clientes.
- Crear, listar, editar y eliminar reservas.
- Asociar cada reserva a un cliente.
- Subir una imagen de comprobante por reserva.
- Mostrar mensajes flash de exito/error en interfaz.
- Manejar errores 404 y errores generales del servidor.

La interfaz usa EJS + Bootstrap 5 con una personalizacion visual en paleta rosado bebe.

## Stack Tecnologico

- Node.js + Express 5
- EJS (motor de vistas)
- Sequelize ORM
- MySQL (driver mysql2)
- Multer (subida de archivos)
- method-override (soporte PUT/DELETE desde formularios)
- express-session (mensajes flash simples)

## Estructura del Proyecto

```text
xioexamen2/
├─ app.js
├─ database.sql
├─ package.json
├─ public/
│  └─ css/
│     └─ style.css
├─ src/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ clientesController.js
│  │  └─ reservasController.js
│  ├─ middleware/
│  │  └─ upload.js
│  ├─ models/
│  │  ├─ Cliente.js
│  │  └─ Reserva.js
│  ├─ routes/
│  │  ├─ clientes.js
│  │  └─ reservas.js
│  └─ views/
│     ├─ 404.ejs
│     ├─ error.ejs
│     ├─ clientes/
│     │  ├─ form.ejs
│     │  └─ index.ejs
│     ├─ reservas/
│     │  ├─ form.ejs
│     │  └─ index.ejs
│     └─ partials/
│        ├─ header.ejs
│        └─ footer.ejs
└─ uploads/
```

## Requisitos

- Node.js 18+ recomendado
- MySQL 8+ (o compatible)
- npm

## Instalacion

1. Clonar o descargar el proyecto.
2. Instalar dependencias:

```bash
npm install
```

3. Configurar conexion a BD (ver seccion Configuracion de Base de Datos).
4. Iniciar aplicacion:

```bash
npm run dev
```

o en modo normal:

```bash
npm start
```

## Configuracion de Base de Datos

La conexion se define en src/config/db.js.

Valores por defecto usados por la aplicacion:

- DB_NAME: xioexamen2
- DB_USER: root
- DB_PASSWORD: vacio
- DB_HOST: localhost
- DB_PORT: 3306

Puedes sobrescribirlos con variables de entorno.

### Ejemplo en PowerShell (Windows)

```powershell
$env:DB_NAME="xioexamen2"
$env:DB_USER="root"
$env:DB_PASSWORD="tu_password"
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
npm run dev
```

## Inicializacion de Tablas

Al iniciar, el proyecto ejecuta:

```js
sequelize.sync({ alter: true })
```

Esto crea o ajusta tablas segun los modelos.

Tambien tienes database.sql como referencia para creacion manual de la base, tablas y datos iniciales.

## Modelos y Relaciones

### Cliente

- id_cliente (PK, autoincrement)
- nombre (STRING 150, obligatorio)

### Reserva

- id_reserva (PK, autoincrement)
- fecha (DATEONLY, obligatoria)
- comprobante_img (STRING 255, opcional)
- id_cliente (FK obligatoria)

### Relacion

- Un cliente tiene muchas reservas.
- Una reserva pertenece a un cliente.
- Regla FK: ON DELETE RESTRICT, ON UPDATE CASCADE.

## Rutas de la Aplicacion

### Clientes

- GET /clientes -> lista clientes
- GET /clientes/nuevo -> formulario de nuevo cliente
- POST /clientes -> crear cliente
- GET /clientes/:id/editar -> formulario editar cliente
- PUT /clientes/:id -> actualizar cliente
- DELETE /clientes/:id -> eliminar cliente

### Reservas

- GET /reservas -> lista reservas
- GET /reservas/nuevo -> formulario de nueva reserva
- POST /reservas -> crear reserva (con archivo opcional)
- GET /reservas/:id/editar -> formulario editar reserva
- PUT /reservas/:id -> actualizar reserva (con archivo opcional)
- DELETE /reservas/:id -> eliminar reserva

### Otras

- GET / -> redirecciona a /clientes
- 404 -> vista src/views/404.ejs
- 500 -> vista src/views/error.ejs

## Subida de Archivos

Middleware en src/middleware/upload.js:

- Campo esperado: comprobante_img
- Tipos permitidos: .jpg, .jpeg, .png, .gif, .webp
- Tamano maximo: 5 MB
- Ruta destino: uploads/
- Nombre generado: comprobante-[timestamp]-[random].[ext]

Comportamiento adicional:

- Si falla validacion al crear reserva y se subio archivo, se elimina la imagen subida.
- Si al editar se sube nueva imagen, se elimina la imagen anterior.
- Al eliminar una reserva, tambien se elimina su comprobante (si existe).

## Validaciones y Manejo de Errores

- Validaciones Sequelize en modelos (nombre, fecha, id_cliente).
- Captura de ValidationError en controladores para devolver mensajes al formulario.
- Mensajes flash en sesion para acciones exitosas y errores controlados.
- Al intentar eliminar un cliente con reservas, se muestra mensaje de bloqueo por relacion FK.

## Scripts Disponibles

- npm start: ejecuta app.js
- npm run dev: ejecuta con nodemon

## UI y Estilos

Los estilos principales estan en public/css/style.css e incluyen:

- Tema rosado bebe con variables CSS.
- Tipografia personalizada (Fraunces + Quicksand).
- Navbar, tarjetas, tablas, formularios y botones personalizados.
- Animaciones suaves de entrada.
- Ajustes responsivos para movil.

## Notas Importantes

- La carpeta uploads se crea automaticamente si no existe.
- Los archivos en uploads se exponen de forma publica bajo /uploads.
- El secreto de sesion esta hardcodeado en app.js para entorno local; en produccion debe ir en variable de entorno.

## Autor

Proyecto academico: Xioexamen2.
