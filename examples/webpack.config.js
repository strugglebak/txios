const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  /**
   * examples 下有多个 demo 目录
   * 每个 demo 目录下有 app.ts 文件
   * app.ts 就作为 webpack 构建的入口文件
   * entries 收集了 example 这个目录下的多个子目录的入口文件
   * 每个入口引入了一个用于热更新的文件
   * entries 是一个对象，key 为目录名
   */
  entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
    const fullDir = path.join(__dirname, dir);
    const entryFile = path.join(fullDir, 'app.ts');
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entryFile)) {
      entries[dir] = ['webpack-hot-middleware/client', entryFile];
    }
    return entries;
  }, {}),

  /**
   * 根据不同的目录名称，打包生成目标 js, 名称和目录名一致
   */
  output: {
    path: path.join(__dirname, '__build__'), // 当前目录的 __build__ 目录
    filename: '[name].js',
    publicPath: '/__build__/'
  },

  module: {
    rules: [{
      test: /\.ts$/,
      enforce: 'pre',
      use: [{
          loader: 'tslint-loader'
        }]
      }, {
      test: /\.tsx?$/,
      use: [{
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }]
    }, {
      test: /\.css$/,
      use: [
        'style-loader', 'css-loader'
      ]
    }]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
};
