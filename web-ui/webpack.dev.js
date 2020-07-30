const merge = require("webpack-merge");
const { buildConfig } = require("./webpack.common.js");

module.exports = function() {
    const commonConfig = buildConfig('dist-dev');

    return merge(commonConfig, {
        mode: "development",
        devtool: "inline-source-map"
    });
}