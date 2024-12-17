# Spatial Backend API

A backend API for storing, updating, and retrieving spatial point and polygon data using Node.js, Express, and PostgreSQL with PostGIS.

## Prerequisites
1. Node.js and npm installed.
2. PostgreSQL with PostGIS enabled.

## Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.

## Database Setup
Enable PostGIS in your PostgreSQL database:
```sql
CREATE EXTENSION postgis;
```

Create the required tables:
```sql
CREATE TABLE spatial_points (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    location GEOMETRY(Point, 4326)
);

CREATE TABLE spatial_polygons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    region GEOMETRY(Polygon, 4326)
);
```

## Running the Server
1. Update the PostgreSQL credentials in `index.js`.
2. Run the server:
   ```
   npm start
   ```
3. The API will be accessible at `http://localhost:3000`.

## Endpoints
- **POST /api/spatial/points**: Add point data.
- **GET /api/spatial/points**: Retrieve all points.
- **POST /api/spatial/polygons**: Add polygon data.
- **GET /api/spatial/polygons**: Retrieve all polygons.
- **PUT /api/spatial/:type/:id**: Update point or polygon data.



