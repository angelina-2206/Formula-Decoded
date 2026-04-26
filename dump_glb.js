const fs = require('fs');

async function checkGlb() {
    try {
        const data = fs.readFileSync('e:/Projects/Formula Decoded/public/models/f1_car_rb19_2023.glb');
        const text = data.toString('utf-8');
        const nameMatches = text.match(/"name"\s*:\s*"([^"]+)"/g);
        if (nameMatches) {
            const names = [...new Set(nameMatches.map(m => m.split('"')[3]))];
            const objects = names.filter(n => n.startsWith('Object_')).sort((a, b) => {
                const numA = parseInt(a.split('_')[1]);
                const numB = parseInt(b.split('_')[1]);
                return numA - numB;
            });
            console.log("Object Meshes:", objects);
        }
    } catch (e) {
        console.error(e);
    }
}

checkGlb();
