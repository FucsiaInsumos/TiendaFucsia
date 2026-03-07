# 🔧 Solución al Error de Login en Producción

## Problema Identificado
El error 400 en login ocurre porque el frontend no está usando variables de entorno correctamente en producción.

## ✅ Cambio Realizado en el Código

**Archivo modificado:** `FrontFucsiaInsumos/src/utils/axios.js`

```javascript
// ANTES (hardcodeado):
baseURL: 'https://tiendafucsia.up.railway.app/'

// AHORA (usando variables de entorno):
baseURL: import.meta.env.VITE_API_URL || 'https://tiendafucsia.up.railway.app/'
```

## 🚀 Pasos para Resolver el Problema

### 1️⃣ Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto (frontend)
3. Ve a **Settings > Environment Variables**
4. Agrega las siguientes variables:

#### Para **Production**:
```
Name: VITE_API_URL
Value: https://tiendafucsia.up.railway.app
Environment: Production
```

```
Name: VITE_FRONTEND_URL
Value: https://fucsiainsumos.com
Environment: Production
```

#### Para **Preview** (opcional):
```
Name: VITE_API_URL
Value: https://tiendafucsia.up.railway.app
Environment: Preview
```

### 2️⃣ Configurar Variable en Railway (Backend)

1. Ve a Railway: https://railway.app/
2. Selecciona tu servicio de backend
3. Ve a **Variables**
4. Asegúrate de tener:

```
FRONTEND_URL = https://fucsiainsumos.com
```

⚠️ **Importante**: El backend ya tiene `https://fucsiainsumos.com` en la lista de orígenes CORS, así que esto debería estar bien.

### 3️⃣ Hacer Deploy de los Cambios

1. **Commit y push de los cambios al frontend:**
```bash
cd FrontFucsiaInsumos
git add .
git commit -m "fix: usar variables de entorno para URL del backend"
git push
```

2. **Vercel hará automáticamente el deploy** con las nuevas variables de entorno

### 4️⃣ Verificar que Funcione

1. Abre tu sitio en producción: https://fucsiainsumos.com
2. Abre DevTools (F12) > Console
3. Intenta hacer login
4. Deberías ver logs como:
   ```
   Authorization header being sent: Bearer ...
   Login response data: {...}
   ```

## 🔍 Verificar Variables de Entorno en Vercel

Para confirmar que las variables estén configuradas:

1. Ve a Vercel > Tu proyecto > Settings > Environment Variables
2. Deberías ver:
   - ✅ VITE_API_URL (Production)
   - ✅ VITE_FRONTEND_URL (Production)

## 🐛 Si Sigue Sin Funcionar

### Opción A: Verificar la URL del Backend
1. Abre: https://tiendafucsia.up.railway.app/
2. Deberías ver un mensaje o página del backend
3. Si no carga, la URL del backend puede estar incorrecta

### Opción B: Verificar CORS
1. Abre DevTools > Network
2. Intenta hacer login
3. Si ves error de CORS (no 400), entonces el problema es CORS
4. Si ves 400, el problema es otra cosa (credenciales, formato de datos, etc.)

### Opción C: Ver Logs del Backend
1. Ve a Railway > Tu servicio > Logs
2. Intenta hacer login desde el frontend
3. Busca errores en los logs del backend

## 📋 Checklist Final

- [ ] Variables de entorno configuradas en Vercel
- [ ] Variable FRONTEND_URL configurada en Railway  
- [ ] Código actualizado y pusheado a Git
- [ ] Vercel hizo redeploy automático
- [ ] Probado el login en https://fucsiainsumos.com

## 🎯 Si el Error Persiste

Si después de seguir estos pasos el error continúa, necesitamos:

1. Ver los **logs del backend en Railway** durante el login
2. Ver la **respuesta exacta del servidor** en DevTools > Network
3. Verificar que las **credenciales sean correctas** (usuario existe en la BD de producción)

El error 400 generalmente significa:
- ❌ Email o password no enviados
- ❌ Usuario no existe en la BD de producción  
- ❌ Formato de datos incorrecto
- ❌ Validación fallida en el backend

**NO es un error de CORS** (eso daría un error diferente).
