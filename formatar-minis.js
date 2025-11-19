const fs = require('fs');
const path = require('path');

//caminho do arquivo de entrada (entrada.txt na mesma pasta)
const inputPath = path.join(__dirname, 'entrada.txt');

console.log('Lendo arquivo de:', inputPath);

try{
    //lê arquivo inteiro como Texto
    const rawText = fs.readFileSync(inputPath, 'utf8');

    console.log('------CONTEUDO BRUTO------');
    console.log(rawText); //mostra tudo

    //quebra em linhas
    const lines = rawText.split(/\r?\n/);

    console.log('------INFORMACOES------');
    console.log('Numero de linhas', lines.length);

    console.log('Primeiras linhas:');

    for (let i = 0; i<Math.min(5, lines.length); i++){
        //JSON.stringify só para mostrar certinho espaços/vasios
        console.log(i, '=>', JSON.stringify(lines[i]));
    }

} catch (err) {
    console.log('Erro ao ler o arquivo:', err.message);
}