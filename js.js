var babel = require("gulp-babel");
var concat = require("gulp-concat");
var gulp = require("gulp");
var gulpIf = require("gulp-if");
var less = require("gulp-less");
var path = require("path");
var size = require("gulp-size");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var util = require("./util");
var livereload = require('gulp-livereload');


module.exports = function getJsTask(spec) {
    var destDir = path.dirname(spec.dest);
    var destFile = path.basename(spec.dest);
    var vendorRe = (spec.vendorRe || /(bower_components|node_modules|vendor)/);
    var babelConfig = spec.babelConfig || {presets: ["es2015"]};
    return function () {
        return gulp.src(spec.src || [])
            .pipe(util.plumb())
            .pipe(sourcemaps.init())
            .pipe(gulpIf(function (file) {
                return !vendorRe.test(file.path);
            }, babel(babelConfig)))
            .pipe(gulpIf(!!spec.production, uglify()))
            .pipe(concat(destFile))
            .pipe(sourcemaps.write("."))
            .pipe(size({title: spec.name}))
            .pipe(gulp.dest(destDir))
            .pipe(livereload({start: util.shouldStartLivereload()}));
    };
};
