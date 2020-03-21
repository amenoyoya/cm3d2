# cm3d2

Custom Maid 3D2

## Environment

- OS:
    - Windows 10
    - Ubuntu 18.04
- Node.js: 12.14.1
    - Yarn package manager: 1.21.1

### Setup TypeScript
```bash
# install node_modules
## $ yarn init -y
## $ yarn add typescript @types/node ts-node
$ yarn install

# execute test code
$ cd src/test/
$ yarn ts-node test.ts
```

***

## Build TypeScript

TypeScriptソースコードを tsconfig.json の設定に従ってコンパイルする

### tsconfig.json
```javascript
{
  "compilerOptions": {
    /* Basic Options */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    "sourceMap": true,                        /* Generates corresponding '.map' file. */
    "outDir": "./dist/",                      /* ./src/ ディレクトリから ./dist/ ディレクトリにコンパイルする */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    "noImplicitAny": false,                   /* これを false にしないと暗黙的 any 型が使えない  */
    "strictNullChecks": false,                /* これを false にしないと暗黙的 Array<any> 型が使えない */

    /* Module Resolution Options */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of 
    
    /* Advanced Options */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  }
}
```

### Compile
```bash
# tsconfig.json の設定に従ってコンパイルする
## ソース: ./src/ に置くこと
$ yarn tsc

## => [tsconfig.json].outDir: ./dist/ にコンパイルされる
```
