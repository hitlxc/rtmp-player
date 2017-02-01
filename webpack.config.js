var path = require('path');

module.exports = {
    entry: {
        app:'./public/dist/app.js', 
        
    },
    output: {
        path: path.join(__dirname, '/public/js'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loaders: ['babel'] },
            { test: /\.json$/, loader: 'json'},
            { test: /\.css$/, loaders: ['style', 'css']}
        ]
    }
}