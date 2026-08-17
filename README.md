# DecoCakeShop

Tienda web para importadora de accesorios de repostería.

**Stack:** React (Vite) · Django + Django REST Framework · MySQL

```
DECOCAKESHOP/
├── backend/          # API Django + panel /admin
├── frontend/         # Catálogo React + carrito WhatsApp
└── docker-compose.yml
```

## Decisión de administración

Se usa el **panel nativo de Django** (`/admin`) para gestionar productos (CRUD, subida de imágenes, categorías). Es la opción más rápida y segura: autenticación nativa de Django, formularios de imagen listos y sin duplicar lógica de escritura en React.

El frontend solo **consume** la API pública de lectura (`/api/products/`, `/api/categories/`).

## Requisitos

- Python 3.11+
- Node.js 20+
- MySQL 8 (producción / VPS). En local puedes usar SQLite con `USE_SQLITE=True`.

## Backend

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # o cp en Linux/macOS
python manage.py migrate
python manage.py seed_products
python manage.py runserver
```

- API: http://127.0.0.1:8000/api/products/
- Admin: http://127.0.0.1:8000/admin/  
  Usuario seed: `admin` / `admin123` (**cámbialo en producción**)

### MySQL (VPS / producción)

1. Levanta MySQL (ejemplo con Docker):

```bash
docker compose up -d db
```

2. En `backend/.env`:

```env
USE_SQLITE=False
DB_NAME=decocakeshop
DB_USER=decocake
DB_PASSWORD=changeme
DB_HOST=127.0.0.1
DB_PORT=3306
DEBUG=False
ALLOWED_HOSTS=tu-dominio.com,IP_DEL_VPS
CORS_ALLOWED_ORIGINS=https://tu-dominio.com,https://www.tu-dominio.com
SECRET_KEY=genera-una-clave-larga
```

3. Migra y recolecta estáticos:

```bash
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

Sirve `media/` y el reverse proxy (Nginx) hacia Gunicorn + el build de React.

## Frontend

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Abre http://localhost:5173

Variables importantes:

```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_WHATSAPP_NUMBER=51999999999
```

`VITE_WHATSAPP_NUMBER` debe ir en formato internacional **sin** `+` ni espacios (ej. Perú: `51987654321`).

Build de producción:

```bash
npm run build
```

Los archivos quedan en `frontend/dist/`.

## Funcionalidades

1. **Catálogo** dinámico desde la API (imagen, nombre, descripción, precio) con filtros por categoría y búsqueda.
2. **Admin Django** para crear/editar/eliminar productos y subir imágenes (MySQL en prod).
3. **Carrito en React** (estado local): agregar varios productos y **Concluir compra** → WhatsApp con mensaje prearmado. Cada producto también tiene botón WhatsApp individual.
4. **Diseño responsive** mobile-first con la paleta:
   - Marrón `#7C211B`
   - Fucsia `#D11D5E`
   - Turquesa `#1D7F8D`
   - Rosa `#F8C2CF`

## API (lectura pública)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products/` | Lista productos activos |
| GET | `/api/products/?category=slug` | Filtra por categoría |
| GET | `/api/products/?search=texto` | Búsqueda por nombre |
| GET | `/api/products/{slug}/` | Detalle |
| GET | `/api/categories/` | Categorías |

## Despliegue VPS (Linode) — resumen

1. Instalar Nginx, MySQL (o Docker), Python, Node.
2. Clonar repo, configurar `.env` de backend y frontend.
3. Backend con Gunicorn + systemd; `MEDIA_ROOT` servido por Nginx.
4. Frontend: `npm run build` y servir `dist/` con Nginx.
5. CORS solo con el origen HTTPS del frontend.
6. `DEBUG=False`, HTTPS (Let's Encrypt), cambiar contraseña del admin.
