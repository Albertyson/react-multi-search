const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /switchery\.css$/,
        loader: 'ignore-loader',
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      template: path.resolve(__dirname, 'src', 'index.html'),
      files: {
        css: [
          'src/css/main.css',
        ],
      },
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      utils: path.resolve(__dirname, "src/js/utils"),
      components: path.resolve(__dirname, "src/js/components")
    }
  }
};
