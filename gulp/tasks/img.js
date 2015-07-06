/*    【 image 】
 *
 *     1. image min 
 *     2. TODO: base64
 */

var gulp       = require('gulp'),
    imagemin   = require('gulp-imagemin'),
    gutil      = require('gulp-util'),
    plumber = require('gulp-plumber'),
    //changed    = require('gulp-changed'),
    livereload = require('gulp-livereload');

var config = require('../config');

gulp.task('image', function(){
    return gulp.src(config.src_img)
    .pipe(imagemin({
        progressive: true,
        interlaced: true}))
    .pipe(gulp.dest(config.dist_img))
    .on('end', function(){
        gutil.log(gutil.colors.green('---- 【 image 】-- complete -- >>>>--' ));
    })
    .pipe(livereload());
});