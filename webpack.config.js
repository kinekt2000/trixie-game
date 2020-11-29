const path = require("path")

const webpack = require("webpack")
const HTMLWebpackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    devtool: "eval-source-map",
    entry: "./scripts/game.js",
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    devServer: {
        port: 4200
    },
    resolve: {
        alias: {
            "@core": path.resolve(__dirname, "src/scripts/core"),
            "@": path.resolve(__dirname, "src/scripts"),
            "~": path.resolve(__dirname, "src")
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env"
                        ],
                        plugins: [
                            "@babel/plugin-transform-runtime",
                            [
                                "@babel/plugin-proposal-class-properties",
                                {
                                    "loose": true
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    },

    plugins: [
        new HTMLWebpackPlugin({
            template: "./html/game.html",
            filename: "game.html"
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {from: path.resolve(__dirname, "src/favicon.ico"), to: path.resolve(__dirname, "dist")},
                {from: path.resolve(__dirname, "src/html/index.html"), to: path.resolve(__dirname, "dist")},
                {from: path.resolve(__dirname, "src/html/scoreboard.html"), to: path.resolve(__dirname, "dist")},
                {from: path.resolve(__dirname, "src/assets"), to: path.resolve(__dirname, "dist", "assets")}
            ]
        })
    ]
}
