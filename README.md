# Contador de Faltadas

Una aplicación web para llevar el registro de "faltadas" entre amigos. La aplicación mantiene un contador de días sin faltadas y un historial de todas las faltadas registradas.

## Características

- Contador de días sin faltadas
- Botón grande para registrar nuevas faltadas
- Historial de faltadas con autor y motivo
- Interfaz moderna y fácil de usar
- Almacenamiento persistente con SQLite

## Requisitos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo)
- Python 3.11+ (para desarrollo)

## Instalación

1. Clona este repositorio:
```bash
git clone <repository-url>
cd faltadas
```

2. Inicia la aplicación con Docker Compose:
```bash
docker-compose up --build
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Desarrollo

### Backend

El backend está construido con FastAPI y SQLite. Para ejecutarlo localmente:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

El frontend está construido con React y Material-UI. Para ejecutarlo localmente:

```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /faltadas/` - Obtiene la lista de faltadas
- `POST /faltadas/` - Crea una nueva faltada
- `GET /faltadas/count` - Obtiene el contador de faltadas

## Licencia

MIT 