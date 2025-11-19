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

    //encontrar as coleçoes e o seu numero
    for(let i = 0; i < lines.length; i++){
        const line = lines[i];

        const match = line.match(/^_+\s*#(\d+)\s+(.+?)\s+\(/);

        if(match){
            const numeroCole = match[1];
            const nomeCole = match[2];
            console.log(`Coleçao detectada: #${numeroCole} → ${nomeCole}`);
        }

        /* ============================================================
            HISTÓRICO DE ESTUDO / REFERÊNCIA
            ------------------------------------------------------------
            Aqui ficam alguns testes e conceitos importantes que usei
            para aprender regex e parsing de texto no projeto.
            Isso NÃO faz parte da lógica final, mas serve como
            documentação viva do aprendizado.
            ============================================================= */

            // [Teste] Detectar possíveis coleções:
            // if (line.includes("#")) {
            //     console.log("Possível coleção:", line);
            // }

            // [Teste] Regex simples para extrair número:
            // const m = line.match(/#(\d+)/);
            // if (m) console.log("Número:", m[1]);

            // [Teste] Regex simples para extrair nome da coleção:
            // const m = line.match(/#\d+\s+(.+?)\s+\(/);
            // if (m) console.log("Nome da coleção:", m[1]);

            // [Teste] Exibir primeiras linhas:
            // console.log(i, "=>", JSON.stringify(lines[i]));
            /* ============================================================ */
    }

    console.log('Primeiras linhas:');
    for (let i = 0; i<Math.min(5, lines.length); i++){
        //JSON.stringify só para mostrar certinho espaços/vasios
        console.log(i, '=>', JSON.stringify(lines[i]));
    }

} catch (err) {
    console.log('Erro ao ler o arquivo:', err.message);
}