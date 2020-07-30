const merge = require("webpack-merge");
const { buildConfig } = require("./webpack.common.js");

module.exports = function() {
    const commonConfig = buildConfig('dist-prod');

    return merge(commonConfig, {
        mode: "production"
    });
}
