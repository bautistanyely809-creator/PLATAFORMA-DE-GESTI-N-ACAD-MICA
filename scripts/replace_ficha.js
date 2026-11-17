const fs = require('fs');
const path = require('path');

const OLD_FICHA = '3413988';
const NEW_FICHA = '3413988';

const ROOT_DIR = path.resolve(__dirname, '..');

const ALLOWED_EXTENSIONS = ['.md', '.js', '.jsx', '.html', '.css', '.json', '.prisma', '.sql', '.py'];

let replacedFilesCount = 0;
let totalOccurrencesCount = 0;

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.system_generated') {
        continue;
      }
      walkDir(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.includes(ext) || entry.name === 'README.md' || entry.name === '.env') {
        processFile(fullPath);
      }
    }
  }
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(OLD_FICHA)) {
      const matches = (content.match(new RegExp(OLD_FICHA, 'g')) || []).length;
      const newContent = content.split(OLD_FICHA).join(NEW_FICHA);
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(` ✅ [${matches} reemplazos]: ${path.relative(ROOT_DIR, filePath)}`);
      replacedFilesCount++;
      totalOccurrencesCount += matches;
    }
  } catch (err) {
    console.error(` ❌ Error procesando ${filePath}:`, err.message);
  }
}

console.log(`🔄 Reemplazando Ficha ${OLD_FICHA} ➔ ${NEW_FICHA} en todo el proyecto...`);
walkDir(ROOT_DIR);
console.log(`\n🎉 Finalizado: ${totalOccurrencesCount} ocurrencias reemplazadas en ${replacedFilesCount} archivos.`);
