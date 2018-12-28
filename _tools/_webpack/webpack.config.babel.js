import path from 'path';

const config = {
  entry: {
    app: './_develop/js/app.js',
  },
  output: {
    path: path.resolve(__dirname, '../../_preview/assets/js/'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ]
            }
          }
        ]
      }
    ]
  }
};

export default function(env, argv) {
  if(argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
}