const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function buildConfig(rootPath) {
    return {
        entry: {
            main: path.join(__dirname, 'src/index.tsx'),
        },
        output: {
            path: path.join(__dirname, `${rootPath}/js`),
            filename: '[name].js',
            chunkFilename: '[name].js', // if React.lazy or dynamic imports are used for chunking
            publicPath: 'js/',
        },
        module: {
            rules: [
                {
                    test: /\.png$/,
                    use: 'ignore-loader',
                },
                {
                    exclude: /node_modules/,
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    exclude: /node_modules/,
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        'css-loader',
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: 'src/static',
                    to: path.join(__dirname, `${rootPath}/static`),
                },
                {
                    from: 'assets',
                    to: path.join(__dirname, `${rootPath}/assets`),
                },
            ]),
            new HtmlWebpackPlugin({
                filename: path.join(__dirname, `${rootPath}/index.html`),
                template: 'src/template.html',
                chunks: ['main'],
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
        },
    };
}

module.exports = { buildConfig };
