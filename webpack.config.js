module.exports = {
  entry: __dirname + '/app/main',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js']
  },
  stats: {
    errorDetails: true
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|browser_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
