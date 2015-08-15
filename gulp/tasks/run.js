var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    sequence   = require('gulp-sequence'),
    livereload = require('gulp-livereload'),
    config     = require('../config');

/**  ----------  task run ------------- **/

gulp.task('default', ['']);

gulp.task('dev', ['js_app:dev', 'image', 'css']);

gulp.task('watch', ['clean'], function(){
    gulp.start('dev');
    livereload.listen(35729);

    gulp.watch(config.src_html, ['html']);
    gulp.watch(config.src_scss, ['css']);
    gulp.watch(config.src_img, ['image']);
})

// todo : html 中引入一个新建文件时。。刷新。执行task js

gulp.task('build', sequence('clean', 'js_app:build', 'image'));
