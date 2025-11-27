const fs = require('fs');
const path = require('path');

// node formatar-minis.js <entrada> [colecaoInicial] [saida]
const [, , inputArg, startCollectionArg, outputArg] = process.argv;

if (!inputArg) {
    console.log('Uso:');
    console.log('  node formatar-minis.js <arquivo-entrada> [numeroColecaoInicial] [arquivo-saida]');
    console.log('\nExemplos:');
    console.log('  node formatar-minis.js entrada.txt');
    console.log('  node formatar-minis.js entrada.txt 6');
    console.log('  node formatar-minis.js entrada.txt 6 saida-piratas.txt');
    process.exit(1);
}

const inputPath = path.resolve(process.cwd(), inputArg);
const outputPath = path.resolve(process.cwd(), outputArg || 'saida.csv');

// Interpretar o número da coleção inicial
let startCollectionNumber = null;

if (startCollectionArg !== undefined) {
    const n = parseInt(startCollectionArg, 10);
    if (Number.isNaN(n)) {
        console.error('Número de coleção inicial inválido. Use, por exemplo, "6" para começar em #06.');
        process.exit(1);
    }
    startCollectionNumber = n;
}

let rawText;
try {
    rawText = fs.readFileSync(inputPath, 'utf8');
} catch (err) {
    console.error('Erro ao ler o arquivo:', err.message);
    process.exit(1);
}

const lines = rawText.split(/\r?\n/);
console.log('Total de linhas', lines.length);

// Estado atual do processamento
const context = {
    currentCollection: null,
    currentCollectionNumber: null,
    processingEnabled: startCollectionNumber === null,
    startCollectionNumber: startCollectionNumber
};

const outputLines = [];

/**
 * Processa uma única linha do arquivo.
 * Retorna um objeto { sku, name, tag } se for uma miniatura válida para saída, ou null caso contrário.
 * Atualiza o objeto context com o estado da coleção atual.
 */
function processLine(line, ctx) {
    const trimmed = line.trim();

    if (trimmed === '') {
        return null; // Pula linha vazia
    }

    // 1) Detectar cabeçalho de coleção
    // Exemplo: ____ #06 - The Crypt of Dread (54) ____
    const headerMatch = trimmed.match(/^_+\s*#(\d+)\s*(?:-\s*)?(.+?)\s+\(\d+\)\s*_*$/);

    if (headerMatch) {
        const collectionNumStr = headerMatch[1]; // "01", "02", etc.
        let collectionName = headerMatch[2]; // "The Crypt of Dread", "Twin Mountains", etc.

        // Se por algum motivo o nome começar com "- ", remove
        collectionName = collectionName.replace(/^\s*-\s*/, '').trim();

        ctx.currentCollectionNumber = parseInt(collectionNumStr, 10);
        ctx.currentCollection = collectionName;

        // Decide se a partir desta coleção já pode processar
        if (ctx.startCollectionNumber !== null) {
            ctx.processingEnabled = ctx.currentCollectionNumber >= ctx.startCollectionNumber;
        } else {
            ctx.processingEnabled = true;
        }

        if (!ctx.processingEnabled) {
            console.log(`Ignorando coleção "#${collectionNumStr} - ${collectionName}" (antes da coleção inicial).`);
        } else {
            console.log(`Processando coleção "#${collectionNumStr} - ${collectionName}".`);
        }

        return null; // Apenas cabeçalho, sem saída
    }

    // 2) Detectar linhas de miniaturas
    // Exemplo: 001 - Draco Lich (Gargantuan)
    const miniMatch = trimmed.match(/^(\d+)\s*-\s*(.+?)\s*\(([^()]*)\)\s*$/);

    if (miniMatch) {
        // Se ainda não é pra processar (coleções antes da inicial), só pula
        if (!ctx.processingEnabled) {
            return null;
        }

        const code = miniMatch[1]; // "001"
        let miniName = miniMatch[2]; // "Draco Lich"
        // const parenthesisInfo = miniMatch[3]; // "Gargantuan", "Medium"... (não usado)

        // 2.1) Remover coisas do tipo " - 2 Variations" no final do nome
        miniName = miniName.replace(/\s*-\s*\d+\s+Variations?$/i, '');
        miniName = miniName.trim();

        // 2.2) Montar o código EM-XXX (3 dígitos)
        const formattedCode = 'EM-' + code.padStart(3, '0');

        // 2.3) Garantir que temos coleção atual
        const collection = ctx.currentCollection || 'Coleção Desconhecida';

        // 2.4) Montar o nome completo para a coluna Nome
        const fullName = `${miniName} - ${collection} - Epic Miniatures`;

        // Log Amigável
        console.log(`Miniatura processada: [${formattedCode}] ${miniName} (${collection})`);

        return {
            sku: formattedCode,
            name: fullName,
            tag: collection
        };
    }

    // Linha ignorada (não é cabeçalho nem miniatura)
    return null;
}

// Loop principal
for (let i = 0; i < lines.length; i++) {
    const result = processLine(lines[i], context);
    if (result) {
        outputLines.push(result);
    }
}

// 3) Escrever no arquivo de saída (CSV)
// Função auxiliar para escapar campos CSV se necessário (embora nossos dados sejam simples)
function toCsvField(field) {
    if (typeof field === 'string' && (field.includes(';') || field.includes('"') || field.includes('\n'))) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
}

const header = 'SKU;Nome;Tags';
const csvRows = outputLines.map(item => {
    return `${toCsvField(item.sku)};${toCsvField(item.name)};${toCsvField(item.tag)}`;
});

const outputText = [header, ...csvRows].join('\n');

try {
    fs.writeFileSync(outputPath, outputText, 'utf8');
    console.log('\nProcessamento Concluído!');
    console.log('Arquivo gerado em:', outputPath);
} catch (err) {
    console.error('Erro ao escrever arquivo de saída:', err.message);
    process.exit(1);
}