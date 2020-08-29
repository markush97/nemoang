const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/server.hmr.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: "development",
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      //
      '@environment/*': path.resolve(__dirname, 'src/environments/'),

      //Core
      '@app/core/*': path.resolve(__dirname, 'src/modules/coreModule/'),
      '@app/config/*': path.resolve(__dirname, 'src/modules/coreModule/config/'),
      '@app/database/*': path.resolve(__dirname, 'src/modules/coreModule/database/'),

      //Permissions
      '@app/permissions/*': path.resolve(__dirname, 'src/modules/permissionsModule/'),
      '@app/roles/*': path.resolve(__dirname, 'src/modules/permissionsModule/roles/'),
      '@app/user/*': path.resolve(__dirname, 'src/modules/permissionsModule/user/'),
      '@app/policies/*': path.resolve(__dirname, 'src/modules/permissions/policiesModule/'),
      '@app/token/*': path.resolve(__dirname, 'src/modules/permissionsModule/token/'),
      '@app/auth/*': path.resolve(__dirname,'src/modules/permissionsModule/auth/'),

    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
  },
};
