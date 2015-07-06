var gulp       = require('gulp'),
    gulpFilter = require('gulp-filter'),
    gutil      = require('gulp-util'),
    changed    = require('gulp-changed'),
    plumber    = require('gulp-plumber'),
    sass       = require('gulp-sass'),
    minifycss  = require('gulp-minify-css'),
    livereload = require('gulp-livereload');

var config = require('../config');

/*    【 copy_css 】
 *     TODO:: 
 *     1. copy file *.css and minify
 */

gulp.task('copy_css', function(){
    var minFilter = gulpFilter(['**/*.css', '!**/*.min.css']);
    return gulp.src(SRC_CSS + '/**/*.css')
    //.pipe(plumber({errorHandler: config.onError}))
    .pipe(changed(DEST_CSS))
    .pipe(minFilter)
    .pipe(minifycss())
    .pipe(minFilter.restore())
    .pipe(gulp.dest(DEST_CSS))
    .pipe(livereload());
});

/*    【 css 】
 *
 *     1. sass
 *     2. minify
 */

//gulp.task('css',['copy_css'], function() {
gulp.task('css', function() {
    return gulp.src(config.src_scss)
    //.pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest(config.dist_css))
    .on('end', function(){
        gutil.log(gutil.colors.green('---- 【 css 】-- complete -- >>>>--' ));
    })
    .pipe(livereload());
});