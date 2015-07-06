/*    【 html_min 】
 *      
 *     not used
 */

var gulp       = require('gulp'),
    livereload = require('gulp-livereload');

gulp.task('html', function() {
    var minify_html_opts = {};
    return gulp.src(config.src_html)
        //.pipe(minifyHtml())
        .pipe(livereload());
});