/*    【 html_min 】
 *      
 *     not used
 */

var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    livereload = require('gulp-livereload');

var config = require('../config');

gulp.task('html', function() {
    var minify_html_opts = {};
    return gulp.src(config.src_html)
        //.pipe(minifyHtml())
        .pipe(livereload());
});