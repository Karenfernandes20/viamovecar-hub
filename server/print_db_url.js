
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');
console.log('Reading .env from:', envPath);

if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        if (k === 'DATABASE_URL') {
            console.log(`${k}: ${envConfig[k]}`);
        }
    }
} else {
    console.log('.env file not found');
}
