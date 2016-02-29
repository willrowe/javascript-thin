
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'thin.js',
            'tests/*.js'
        ],
        exclude: [
        ],
        preprocessors: {
            'tests/*.js': ['webpack']
        },
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeCanary'],
        singleRun: false,
        concurrency: Infinity,
        plugins: [
            require('karma-chrome-launcher'),
            require('karma-jasmine'),
            require('karma-webpack')
        ],
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.html$/,
                        loader: 'raw'
                    }
                ]
            }
        }
    });
};
