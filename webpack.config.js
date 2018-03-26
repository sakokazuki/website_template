const webpack = require("webpack")
const path = require("path")

empty = "";

module.exports = {
  context: __dirname + '/app',
  entry: {
    'app': ['./js/app']
  },
  output: {
    path: __dirname + '/build/js',
    filename: '[name].js'
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
        ROOT_DIR: JSON.stringify(empty),
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'sub',
      //   chunks: ['app'],
      //   minChunks: Infinity,
      // }),
  ],
  watch: true,
  resolve: {
    modules: [
      path.resolve(__dirname, "./app/js"),
      "node_modules"
    ]
    // alias: {
    //   'three-extras': path.resolve(__dirname, 'node_modules/three/examples/js/')
    // }
  },
  devtool: 'inline-source-map'

};
