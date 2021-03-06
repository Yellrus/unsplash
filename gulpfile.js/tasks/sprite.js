const { src, dest, series } = require('gulp'),
    svgSymbols = require('gulp-svg-symbols');
const config = require('../config').sprite;
const handleErrors = require('../util/handleErrors'),
    rename = require('gulp-rename'),
    svgo = require('gulp-svgo');

function spriteData() {
    return src(config.src)
        .pipe(svgSymbols({ templates: [config.template] }))
        .on('error', handleErrors)
        .pipe(dest(config.scssDest));
}

function sprite() {
    return src(config.src)
        .pipe(svgSymbols({ templates: ['default-svg'] }))
        .on('error', handleErrors)
        .pipe(rename(config.spriteName))
        .pipe(
            svgo({
                plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
            }),
        )
        .pipe(dest(config.dest));
}

module.exports = series(spriteData, sprite);
