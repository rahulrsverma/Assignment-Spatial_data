const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'spatial_db',
    password: 'password',
    port: 5432,
});

app.post('/api/spatial/points', async (req, res) => {
    const { name, latitude, longitude } = req.body;
    try {
        const query = `
            INSERT INTO spatial_points (name, location)
            VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326))
            RETURNING *;
        `;
        const result = await pool.query(query, [name, longitude, latitude]);
        res.json({ message: 'Point added successfully', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/spatial/points', async (req, res) => {
    try {
        const query = `
            SELECT id, name, ST_AsGeoJSON(location) AS location
            FROM spatial_points;
        `;
        const result = await pool.query(query);
        res.json({ points: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/spatial/polygons', async (req, res) => {
    const { name, coordinates } = req.body; // coordinates in GeoJSON format
    try {
        const query = `
            INSERT INTO spatial_polygons (name, region)
            VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326))
            RETURNING *;
        `;
        const result = await pool.query(query, [name, JSON.stringify(coordinates)]);
        res.json({ message: 'Polygon added successfully', data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/spatial/polygons', async (req, res) => {
    try {
        const query = `
            SELECT id, name, ST_AsGeoJSON(region) AS region
            FROM spatial_polygons;
        `;
        const result = await pool.query(query);
        res.json({ polygons: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/spatial/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const { name, coordinates, latitude, longitude } = req.body;

    try {
        let query;
        if (type === 'points') {
            query = `
                UPDATE spatial_points
                SET name = $1, location = ST_SetSRID(ST_MakePoint($2, $3), 4326)
                WHERE id = $4 RETURNING *;
            `;
            await pool.query(query, [name, longitude, latitude, id]);
        } else if (type === 'polygons') {
            query = `
                UPDATE spatial_polygons
                SET name = $1, region = ST_SetSRID(ST_GeomFromGeoJSON($2), 4326)
                WHERE id = $3 RETURNING *;
            `;
            await pool.query(query, [name, JSON.stringify(coordinates), id]);
        } else {
            return res.status(400).json({ error: 'Invalid type. Use "points" or "polygons".' });
        }

        res.json({ message: `${type} updated successfully.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
