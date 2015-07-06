/*    【 clean 】
 *
 *     clear dist folder for both stylesheet & script & image
 */

var gulp   = require('gulp'),
    del    = require('del'),
    gutil  = require('gulp-util');

var config = require('../config');

gulp.task('clean', function(){
    del.sync(['dist/js', 'dist/css', 'dist/img'], function(){
        gutil.log(gutil.colors.green('---- 【 clean 】-- complete -- >>>>--' ));
    });
});