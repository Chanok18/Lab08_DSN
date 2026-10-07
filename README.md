# Laboratorio 08 - Seguridad en la Nube

**Autor:** Kevin Quispe

## Descripción

En este laboratorio se implementó un sistema de autenticación y control de acceso para una aplicación de gestión de productos llamada **TechStore**.

El proyecto utiliza Node.js, Express y MongoDB, aplicando diferentes mecanismos de seguridad como JWT, MFA y control de acceso basado en roles.

## Objetivos

- Implementar un registro seguro de usuarios.
- Implementar autenticación mediante credenciales.
- Utilizar tokens JWT para proteger las rutas.
- Implementar autenticación Multi-Factor (MFA).
- Aplicar permisos según el rol del usuario.
- Proteger las operaciones de productos.
- Integrar autenticación mediante Google y GitHub.

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Passport.js
- Google OAuth
- GitHub OAuth
- Cloud Shell

## Parte 1: Registro e inicio de sesión

El sistema permite registrar usuarios utilizando:

- Nombre completo.
- Correo electrónico único.
- Contraseña segura.
- Tienda asignada.

La contraseña debe tener como mínimo 8 caracteres, una letra mayúscula, un número y un carácter especial.

El inicio de sesión valida las credenciales y genera un proceso de autenticación mediante JWT. También se implementó el bloqueo después de varios intentos incorrectos.

## Parte 2: Autenticación Multi-Factor

Se implementó MFA mediante un código de 6 dígitos enviado/generado para el usuario.

El código tiene una duración de **5 minutos** y se permite un máximo de **3 intentos**.

El flujo implementado es:

1. El usuario ingresa sus credenciales.
2. El sistema valida el correo y contraseña.
3. Se genera el código MFA.
4. El usuario ingresa el código.
5. Si el código es correcto, se genera el JWT completo.
6. Si se supera el límite de intentos, el acceso es rechazado.

## Parte 3: Control de acceso por roles

El sistema cuenta con cuatro roles principales:

| Rol | Permisos principales |
|---|---|
| Administrador del Sistema | Acceso completo al sistema |
| Gerente de Tienda | Gestionar productos de su tienda |
| Empleado de Ventas | Consultar productos y actualizar stock |
| Auditor | Consultar información en modo lectura |

Las rutas protegidas utilizan JWT y autorización por roles.

## Gestión de productos

Se implementaron las siguientes operaciones:

- Consultar productos.
- Crear productos.
- Actualizar productos.
- Eliminar productos.

Los permisos dependen del rol del usuario y de la tienda asignada.

Por ejemplo, el empleado puede actualizar el stock, mientras que las operaciones administrativas están restringidas a usuarios autorizados.

## Autenticación social

El proyecto cuenta con configuración para autenticación mediante:

- Google OAuth.
- GitHub OAuth.

Estas integraciones quedaron configuradas en Passport.js para futuras pruebas y validaciones desde el frontend.

## Evidencias realizadas

Durante las pruebas se verificó:

- Registro de usuarios.
- Inicio de sesión.
- Generación de JWT.
- Validación MFA.
- Creación de productos como Administrador.
- Control de acceso mediante roles.
- Actualización de stock.
- Acceso de solo lectura para Auditor.
- Configuración de Google y GitHub OAuth.

## Ejemplo de producto creado

Se realizó una prueba creando el producto:

- **Nombre:** Laptop Lenovo
- **Descripción:** Laptop para oficina
- **Precio:** S/ 2500
- **Stock:** 10
- **Categoría:** Computadoras
- **Tienda:** Tienda Central

La operación fue realizada correctamente utilizando el usuario Administrador.



