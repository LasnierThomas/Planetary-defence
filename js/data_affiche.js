const fs = require('fs');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
    if (req.url === '/data') {
        try {
            const dataObjects = readAndProcessFile('/home/planetarydefense/htdocs/www.planetarydefense.io/CRON/outputV2.txt');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(dataObjects));
        } catch (error) {
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else if (req.url === 'https://www.planetarydefense.io/accueil.html') {
        // Serve accueil.html
        try {
            const html = fs.readFileSync(path.join(__dirname, 'accueil.html'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    } else {
        try {
            const html = fs.readFileSync(path.join(__dirname, 'data_collect.html'));
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } catch (error) {
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }

}).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

function readAndProcessFile(filePath) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    const dataObjects = lines.map(line => {
        if (line.startsWith('Data: ')) {
            return JSON.parse(line.substring(6));
        }
        return null;
    }).filter(obj => obj != null);

    return dataObjects;
}

