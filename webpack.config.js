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
            }
        ]
    },

    mode: "development"
}; 