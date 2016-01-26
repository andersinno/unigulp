var autoprefixer = require("autoprefixer");
var concat = require("gulp-concat");
var cssnano = require("cssnano");
var extend = require("extend");
var gulp = require("gulp");
var gulpIf = require("gulp-if");
var less = require("gulp-less");
var path = require("path");
var postcss = require("gulp-postcss");
var size = require("gulp-size");
var sourcemaps = require("gulp-sourcemaps");
var util = require("./util");

var DEFAULT_LESS_SETTINGS = {
    strictImports: true,
    strictUnits: true,
    strictMath: true
};


/**
 * Compile LESS/plain CSS to CSS.
 *
 * spec:
 *   * lessSettings: dict of less settings overrides
 *
 * @param spec
 * @returns {Function}
 */
module.exports = function getCssTask(spec) {
    var destDir = path.dirname(spec.dest);
    var destFile = path.basename(spec.dest);
    var lessSettings = extend({}, DEFAULT_LESS_SETTINGS, spec.lessSettings);
    var postcssModules = [
        autoprefixer({browsers: ["last 2 versions"]})
    ];
    if(spec.production) {
        postcssModules.push(cssnano({safe: true}));
    }
    return function () {
        return gulp.src(spec.src || [])
            .pipe(util.plumb())
            .pipe(sourcemaps.init())
            .pipe(gulpIf(/\.less$/, less(lessSettings)))
            .pipe(concat(destFile))
            .pipe(postcss(postcssModules))
            .pipe(sourcemaps.write("."))
            .pipe(size({title: spec.name}))
            .pipe(gulp.dest(destDir));
    }
};
