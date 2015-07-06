/*     TODO ::  【 js_lint 】
 *
 *     haven't use 
 */


var gulp   = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('lint', function(){
  return gulp.src([config.src_app_js, config.src_mod_js, '!./assets/js/(mod|app)/**/*.min.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
})