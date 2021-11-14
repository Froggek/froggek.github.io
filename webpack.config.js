const path = require('path'); 

module.exports = {
    entry: ['./src/index.js'], 
    output: {
        filename: 'main.js', 
        path: path.resolve(__dirname, 'dist') 
    }, 

    module: {
        rules: [
            {
                test: /\.css$/i, 
                // Runs css-loader, then style-loader 
                use: ["style-loader", "css-loader"], 
            }, 
            {
                // https://webpack.js.org/loaders/source-map-loader/
                test: /\.js$/,
                enforce: "pre", 
                use: ["source-map-loader"]
            }
        ]
    },

    mode: "development", 
    devtool: "source-map" 
}; 