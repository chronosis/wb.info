module.exports = {
  entry: __dirname + '/app/main',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  stats: {
    errorDetails: true
  },
  module: {
    loaders: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          exclude: /(node_modules|browser_components)/,
          query: {
            presets: ['es2015']
          }
        }
    ]
  }
};
