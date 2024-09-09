const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dataFile = 'choreData.json';

async function readData() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { chores: [], bonusPoints: [], storeItems: [], storeHistory: [], adminPassword: "choreMaster123" };
    }
}

async function writeData(data) {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

app.get('/api/data', async (req, res) => {
    const data = await readData();
    res.json(data);
});

app.post('/api/data', async (req, res) => {
    await writeData(req.body);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});