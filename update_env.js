const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const newKeys = {
        'EVOLUTION_API_KEY': 'EE1364DD7CDC-440D-ABC7-2509F596834E',
        'AUTHENTICATION_API_KEY': '429683C4C977415CAAFCCE10F7D57E11'
    };

    let lines = content.split('\n');
    const updatedLines = [];
    const keysFound = {};

    lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            if (newKeys[key]) {
                updatedLines.push(`${key}=${newKeys[key]}`);
                keysFound[key] = true;
            } else {
                updatedLines.push(line);
            }
        } else {
            updatedLines.push(line);
        }
    });

    // Add missing keys
    Object.keys(newKeys).forEach(key => {
        if (!keysFound[key]) {
            if (updatedLines.length > 0 && updatedLines[updatedLines.length - 1] !== '') {
                updatedLines.push('');
            }
            updatedLines.push(`${key}=${newKeys[key]}`);
        }
    });

    fs.writeFileSync(envPath, updatedLines.join('\n'));
    console.log('Successfully updated .env file');
    console.log('New content preview:');
    console.log(updatedLines.join('\n'));

} catch (error) {
    console.error('Error updating .env:', error);
}
