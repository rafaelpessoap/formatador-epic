# Formatador de Miniaturas -- Epic Miniatures

Script em Node.js para ler um arquivo de texto com coleções e miniaturas
da Epic Miniatures e gerar um arquivo CSV formatado com as colunas:

    SKU;Nome;Tags

Exemplo de linha gerada:

    EM-001;Draco Lich - The Crypt of Dread - Epic Miniatures;The Crypt of Dread

## Uso

No terminal:

``` bash
node formatar-minis.js <entrada> [colecaoInicial] [saida]
```

Exemplos:

``` bash
node formatar-minis.js entrada.txt
node formatar-minis.js entrada.txt 6
node formatar-minis.js entrada.txt 6 saida-piratas.csv
```

-   `<entrada>` --- arquivo de origem\
-   `[colecaoInicial]` --- opcional, número da coleção para começar\
-   `[saida]` --- opcional, nome do arquivo gerado (padrão: `saida.csv`)

## Estrutura básica

    formatar-minis.js
    entrada.txt
    saida.csv
    README.md
    .gitignore

Os arquivos de entrada e saída são ignorados pelo Git.
