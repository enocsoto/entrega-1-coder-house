# Entrega N° 2 - Websockets

## Descripción General

En esta segunda entrega, implementare websockets en el servidor para crear una aplicación en tiempo real que permita la gestión dinámica de productos.

## Consigna

Configurar el proyecto para que trabaje con Handlebars y websocket.

## Aspectos a incluir

1. Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo.

2. Crear una vista "home.handlebars" la cual contenga una lista de todos los productos agregados hasta el momento.

3. Crear una vista "realTimeProducts.handlebars", la cual vivirá en el endpoint "/realtimeproducts" en views router. Esta vista contendrá la misma lista de productos que la vista home, pero trabajará con websockets para actualizarse en tiempo real.

4. Implementar la funcionalidad para que cada vez que creemos un producto nuevo, o eliminemos un producto, se actualice automáticamente la lista en la vista realTimeProducts.

## Implementación

### Configuración del Servidor

El servidor ya está configurado con:
- Express para el manejo de rutas
- Handlebars como motor de plantillas
- Socket.io para la comunicación en tiempo real

### Vistas Implementadas

1. **Home (/)**
   - Muestra una lista estática de todos los productos
   - Se actualiza solo al recargar la página

2. **RealTimeProducts (/realtimeproducts)**
   - Muestra la misma lista de productos
   - Se actualiza automáticamente cuando:
     - Se agrega un nuevo producto
     - Se elimina un producto existente
   - Incluye un formulario para agregar nuevos productos

## Sugerencias de Implementación

### Opción 1: Formulario en la Vista RealTimeProducts
Para la creación y eliminación de productos, se recomienda utilizar un formulario simple en la vista realTimeProducts.handlebars. De esta manera, el contenido se envía directamente desde websockets y no mediante HTTP.

### Opción 2: Conexión de Socket Emits con HTTP
Si se desea hacer la conexión de socket emits con HTTP, se debe buscar la forma de utilizar el servidor io de Sockets dentro de la petición POST. Esto implica responder a la pregunta: ¿Cómo utilizar un emit dentro del POST?

## Nota

Esta implementación permite experimentar con la comunicación en tiempo real mediante websockets, una tecnología fundamental para aplicaciones modernas que requieren actualizaciones instantáneas.