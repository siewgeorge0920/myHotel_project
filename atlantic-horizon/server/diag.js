import fs from 'fs';
import path from 'path';

const searchDir = './';
const searchString = 'roomType.controller';

console.log("🔍 Scanning for the 'Ghost' reference...");

function scan(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fullPath.includes('node_modules') || fullPath.includes('.git')) continue;
        
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scan(fullPath);
        } else if (file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(searchString)) {
                console.log(`✅ FOUND in: ${fullPath}`);
            }
        }
    }
}

try {
    scan(searchDir);
    console.log("🏁 Scan complete.");
} catch (err) {
    console.error("❌ Scan failed:", err.message);
}
