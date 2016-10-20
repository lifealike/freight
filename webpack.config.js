/*eslint-env node*/

var path = require("path"),
    webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');

var rootAssetPath = __dirname + "/static";
module.exports = {
  context: __dirname + "/static",
  entry: {
    "styles": "./less/base.less",
    "app": "./main",
    "vendor": [
      "ansi_up",
      "babel-core/polyfill",
      "jquery",
      "moment",
      "react/addons",
      "react-router"
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg)$/,
        loader: "url-loader?limit=8192"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css", {
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
    }),
    new ManifestRevisionPlugin(path.join('build', 'manifest.json'), {
        rootAssetPath: rootAssetPath,
        ignorePaths: ['/stylesheets', '/javascript']
    })
  ],
  resolve: {
    modulesDirectories: ["node_modules"],
    extensions: ["", ".jsx", ".js", ".json"]
  },
  output: {
    publicPath: "/dist/",
    path: __dirname + "/dist",
    filename: "[name][hash].js",
  },
  devtool: 'source-map'
};
