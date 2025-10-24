# 🚀 Instrucciones de Deploy

## Problema Identificado

El frontend estaba hardcodeado a `http://localhost:3001/`, por lo que funcionaba en local pero NO en producción.

## Solución Implementada

Se actualizó `src/utils/axios.js` para usar variables de entorno:

```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/'
```

## ⚙️ Configuración en Vercel

Para que funcione en producción, debes configurar las variables de entorno en Vercel:

### 1. Ve a tu proyecto en Vercel
- Abre tu dashboard de Vercel
- Selecciona el proyecto del frontend

### 2. Configura las Variables de Entorno
Ve a: **Settings > Environment Variables**

Agrega las siguientes variables:

#### Para Producción:
```
VITE_API_URL = https://tu-backend-en-railway.up.railway.app
VITE_WOMPI_PUBLIC_KEY = pub_prod_TU_CLAVE_REAL
VITE_WOMPI_INTEGRITY_SECRET = prod_integrity_TU_CLAVE_REAL
VITE_FRONTEND_URL = https://tu-frontend.vercel.app
```

#### Para Preview/Development:
```
VITE_API_URL = http://localhost:3001
VITE_WOMPI_PUBLIC_KEY = pub_test_udFLMPgs8mDyKqs5bRCWhpwDhj2rGgFw
VITE_WOMPI_INTEGRITY_SECRET = test_integrity_VMVZ36lyoQot5DsN0fBXAmp4onT5T86G
VITE_FRONTEND_URL = http://localhost:5173
```

### 3. Re-deploy el Proyecto

Después de configurar las variables:
1. Haz commit de los cambios en `axios.js`
2. Push a tu repositorio
3. Vercel hará el deploy automáticamente

O simplemente haz un redeploy manual desde el dashboard de Vercel.

## ✅ Verificación

Después del deploy, verifica en la consola del navegador:
- No deberían aparecer errores de CORS
- Las peticiones deberían ir a tu backend de Railway
- La funcionalidad de recepción de mercancía debería funcionar

## 🔍 Debugging

Si sigue sin funcionar:

1. **Verifica las variables en Vercel:**
   ```bash
   vercel env ls
   ```

2. **Revisa los logs del build:**
   - Ve a Deployments en Vercel
   - Revisa los logs del build más reciente

3. **Verifica en la consola del navegador:**
   - Abre DevTools (F12)
   - Ve a la pestaña Network
   - Busca las peticiones a `/purchase/orders/`
   - Verifica que vayan a la URL correcta de Railway

## 📝 URLs que necesitas

- **Backend (Railway):** `https://TU_PROYECTO.up.railway.app`
- **Frontend (Vercel):** `https://TU_PROYECTO.vercel.app`

Reemplaza estas URLs en las variables de entorno de Vercel.
