# Marvel Mobile App

Aplicación móvil en React Native que consume la API REST existente del proyecto backend.

## Configuración de API

La URL base está centralizada en:

- `src/services/api.js`

Por defecto, para Android Emulator:

```js
export const API_URL = 'http://10.0.2.2:3000/api';
```

Para un dispositivo físico, reemplaza por la IP del computador donde corre el backend:

```js
export const API_URL = 'http://192.168.1.50:3000/api';
```

## Requisitos

- Node.js
- Expo CLI o Expo Go
- Backend ejecutándose en `http://localhost:3000`

## Instalación

```bash
npm install
npm start
```

## Credenciales de prueba

```text
Email: admin@marvel.com
Password: 12345678
```

## Flujo incluido

- Login
- Inicio
- Héroes
- Detalle de héroe
- Favoritos con AsyncStorage
- Misiones
- JWT en AsyncStorage
