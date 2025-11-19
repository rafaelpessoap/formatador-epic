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
const outputPath = path.resolve(process.cwd(), outputArg || 'saida.txt');

//Interpretar o número da coleção inicial
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
try{
    rawText = fs.readFileSync(inputPath, 'utf8');
} catch (err){
    console.error('Erro ao ler o arquivo:', err.message);
    process.exit(1);
}

const lines = rawText.split(/\r?\n/);
console.log('Total de linhas', lines.length);

//estado atual da colecao
let currentCollection = null;
let currentCollectionNumber = null;

// se não foi passada coleção inicial, já pode processar tudo desde o começo
let processingEnabled = startCollectionNumber === null;

//Array onde vamos acumular as liunhas prontas
const outputLines = [];

for (let i = 0; i < lines.length; i++){
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === ''){
        continue; //pula linha vasia
    }

    //Detectar cabeçalho de coleção
    const headerMatch = trimmed.match(/^_+\s*#(\d+)\s*(?:-\s*)?(.+?)\s+\(\d+\)\s*_*$/);

    if (headerMatch){
        const numeroCole = headerMatch[1]; // "01", "02", etc.
        let nomeCole = headerMatch[2]; // "The Crypt of Dread", "Twin Mountains", etc.

        // Se por algum motivo o nome começar com "- ", remove
        nomeCole = nomeCole.replace(/^\s*-\s*/, '').trim();

        currentCollectionNumber = parseInt(numeroCole, 10);
        currentCollection = nomeCole;

        // decide se a partir desta coleção já pode processar
        if (startCollectionNumber !== null) {
            processingEnabled = currentCollectionNumber >= startCollectionNumber;
        } else {
            processingEnabled = true;
        }

        if (!processingEnabled) {
            console.log(`Ignorando coleção "#${numeroCole} - ${nomeCole}" (antes da coleção inicial).`);
        } else {
            console.log(`Processando coleção "#${numeroCole} - ${nomeCole}".`);
        }       

        continue; //nao tem miniatura nessa linha, apenas cabeçalho
    }

     // 2) Detectar linhas de miniaturas
    //
    // Exemplo:
    // 001 - Draco Lich (Gargantuan)
    // 035 - Lizardfolk Sword Champion - 2 Variations (Medium)

    const miniMatch = trimmed.match (/^(\d+)\s*-\s*(.+?)\s*\(([^()]*)\)\s*$/);

    if (miniMatch){

        // Se ainda não é pra processar (coleções antes da inicial), só pula
        if (!processingEnabled) {
            continue;
        }

        const codigo = miniMatch[1]; // "001"
        let nomeMini = miniMatch[2]; // "Draco Lich" ou "Lizardfolk Sword Champion - 2 Variations"
        const infoParenteses = miniMatch[3]; // "Gargantuan", "Medium"... (não vamos usar)

        // 2.1) Remover coisas do tipo " - 2 Variations" no final do nome
        //
        // \s*-\s*      → espaço opcional, hífen, espaço opcional
        // \d+          → um ou mais dígitos (2, 3, 10...)
        // \s+Variations? → espaço + "Variation" ou "Variations" (aceita as duas formas)

        nomeMini = nomeMini.replace(/\s*-\s*\d+\s+Variations?$/i, '');
        nomeMini = nomeMini.trim();

        // 2.2) Montar o código EM-XXX (3 dígitos)
        const codigoFormatado = 'EM-' + codigo.padStart(3,'0');

        // 2.3) Garantir que temos coleção atual
        const cole = currentCollection || 'Coleção Desconhecida';

        // 2.4) Montar a linha final
        const finalLine = `${codigoFormatado};${nomeMini} - ${cole} - Epic Miniatures`;

        // Guarda no array de saída
        outputLines.push(finalLine);

        //Log Amigavel
        console.log(`Miniatura processada: [${codigoFormatado}] ${nomeMini} (${cole})`);

        continue    
    }

    // Se cair aqui, é uma linha que não é cabeçalho nem miniatura
    // Você pode ignorar ou logar para inspecionar depois:
    // console.log("Linha ignorada:", JSON.stringify(trimmed));
}

// 3) Escrever no arquivo de saída
const outputText = outputLines.join('\n');

try{
    fs.writeFileSync(outputPath, outputText, 'utf8');
    console.log('\nprocessamento Concluido!');
    console.log('Arquivo gerado em:', outputPath);
}catch (err){
    console.error('Erro ao Escrever arquivo de Saida:', err.message);
    process.exit(1);
}