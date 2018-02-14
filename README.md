# website template

## 開発

`$ yarn install` or `$ npm install`  
`$ yarn dev` or `$ npm run dev`  

## ビルド

### stg  
`$yarn stg` or `$ npm run stg` 

### release  
`$yarn release` or `$ npm run release`  

## todo

デプロイ先に応じて(現状ではs3かsftp)違うので、gulpfileのタスクを見て  
ちょっと動いていたソースを改変したので動作は未検証。要注意。
必要なconfigファイルをつくってnpm scriptsでコマンドをつくる。  
いつかec2にアップするやつも作る。
