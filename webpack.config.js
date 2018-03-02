module.exports = {
    entry: "./src/client/js/main.js",
    output: {
        path: require("path").resolve("./src/client/js"),
        library: "app",
        filename: "app.js"
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
        }]
    }
};