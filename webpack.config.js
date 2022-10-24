const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const POPUP_CHUNK = 'js/popup';
const CONTENT_CHUNK = 'js/content';
const BACKGROUND_CHUNK = 'js/background';

module.exports = () => {
    return {
        entry: {
            [POPUP_CHUNK]: './src/popup/index.tsx',
            [CONTENT_CHUNK]: './src/content/index.ts',
            [BACKGROUND_CHUNK]: './src/background/index.ts'
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
        },
        resolve: {
            extensions: ['.js', '.ts', '.tsx'],
            alias: {
                'src@': path.resolve(__dirname, 'src'),
            }
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Tabs autocloser',
                filename: 'popup.html',
                template: 'src/popup/popup.html',
                chunks: [POPUP_CHUNK],
                inject: 'body',
            }),
            new CopyPlugin({
                patterns: [
                    { from: 'src/manifest.json', to: './manifest.json' },
                    { from: 'src/vendor', to: './vendor'},
                    { from: 'src/icons', to: './icons'}
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ]
        },
    }
};
