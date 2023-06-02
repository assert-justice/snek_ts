# Snek TS

## Webpack and TS

`npm init -y`

`npm install --save-dev webpack webpack-cli typescript ts-loader`

`tsc -init`

Only change these options.
`./tsconfig.json`
```json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true, 
    "noImplicitAny": true,
    "module": "es6",
    "moduleResolution": "node"
  }
}
```

Make `src` and `dist` directories.

`.dist/index.html`
```html
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="utf-8" />
    <title>Snek</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <h1>Snek</h1>
    <p id="score">Score: 0 High Score: 0</p>
    <canvas id="canvas" width="600" height="600"></canvas>
    <div id="controlls">
        <button id="start-button">Play!</button>
    </div>
    <p>It's a snake game what do you want from me? WASD to move, collect as many fruit as you can before you die.</p>
    <script src="./bundle.js"></script>
  </body>
</html>

```

`.dist/style.css`
```css
```

`./webpack.config.js`
```js
const path = require('path');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    mode: "development",
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};
```

## Porting Snek