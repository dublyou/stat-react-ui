module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.entry = webpackConfig.entry.map(entry => {
                return entry.replace(
                    require.resolve('react-dev-utils/webpackHotDevClient.js'),
                    require.resolve('./config/react-dev-utils/webpackHotDevClient.js')
                );
            });
            if (env === 'development') {
                var BundleTracker = require('webpack-bundle-tracker');
                webpackConfig.plugins.push(new BundleTracker({filename: './webpack-stats.json'}));
            }
            return webpackConfig;
        }
    },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        return devServerConfig;
    },
};