# Formatador de Miniaturas -- Epic Miniatures

Script em Node.js para ler um arquivo de texto com coleções e miniaturas
da Epic Miniatures e gerar um arquivo formatado no padrão:

    EM-001;Nome da Miniatura - Nome da Coleção - Epic Miniatures

## Uso

No terminal:

``` bash
node formatar-minis.js <entrada> [colecaoInicial] [saida]
```

Exemplos:

``` bash
node formatar-minis.js entrada.txt
node formatar-minis.js entrada.txt 6
node formatar-minis.js entrada.txt 6 saida-piratas.txt
```

-   `<entrada>` --- arquivo de origem\
-   `[colecaoInicial]` --- opcional, número da coleção para começar\
-   `[saida]` --- opcional, nome do arquivo gerado (padrão: `saida.txt`)

## Estrutura básica

    formatar-minis.js
    entrada.txt
    saida.txt
    README.md
    .gitignore

Os arquivos de entrada e saída são ignorados pelo Git.
