const webpack = require("webpack")
const path = require("path")


module.exports = {
  context: __dirname + '/app/',
  mode: 'development',
  entry: {
    'app': ['babel-polyfill','./js/app'],
    'sub': ['./js/sub'],
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build/js',
    jsonpFunction: 'sub'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'initial',
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', "stage-3"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
       test: /\.(glsl|frag|vert)$/,
       use: 'shader-loader',
      },
      {
        test: /\.(svg)$/,
        use: 'html-loader',
      }
    ]
  },
  plugins: [
      new webpack.DefinePlugin({
        ROOT_DIR: JSON.stringify("from gulp file"),
      }),
  ],
  performance: {
    hints: false
  },
  watch: true,
  resolve: {
    modules: [
      path.resolve(__dirname, "./app/js"),
      "node_modules"
    ]
  },
  devtool: 'inline-source-map'

};
