var gulp       = require('gulp'),
    gulpFilter = require('gulp-filter'),
    gutil      = require('gulp-util'),
    gulpif     = require('gulp-if'),
    uglify     = require('gulp-uglify'),
    changed    = require('gulp-changed'),
    plumber    = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    path       = require('path'),
    forEach    = require('gulp-foreach'),
    sourcemaps = require('gulp-sourcemaps'),

    browserify = require('browserify'),
    reactify   = require('reactify'),
    babelify   = require('babelify'),
    es6ify     = require('es6ify'),
    watchify   = require('watchify'),
    literalify = require('literalify'),
    transform  = require('vinyl-transform'),
    source     = require('vinyl-source-stream'),
    streamify  = require('gulp-streamify');

var config = require('../config');

var DEV = false;

/*----- start   **    util func for brwoserify     **/

function buildJs(ENV_DEV, dir) {
    return gulp.src(dir)
        .pipe(forEach(function(stream, file){
            var realative_filename = './' + path.relative('assets/js/app/', file.path);
            initB(realative_filename, ENV_DEV);
            return stream;
        }));
}

function initB(file, ENV_DEV) {
    var b = browserify(file, {
        basedir: './assets/js/app/',
        cache: {},
        debug: true,
        packageCache: {}
    });
    /*
    b.on('error', function(err)bbbbai
    {
        console.log(err.toString());
        this.emit('end');
    });
*/
    if (ENV_DEV) {
        b = watchify(b);
        b.on('update', function(){
            bundleB(b, file, ENV_DEV);
            gutil.log(gutil.colors.yellow('bundle ... file: ' + file));
        });
    }
    b //.add(es6ify.runtime) // runtime is large & not needed for all es6 feature
      //  .transform('reactify') // reactify
      //  .transform('es6ify');  // es6ify
      .transform(babelify);
    b.transform(literalify.configure({ // map module name with global objects
//        'react': 'window.React',
        'zepto': 'window.Zepto'
    }));


    bundleB(b, file, ENV_DEV);
}

function bundleB(b, file, ENV_DEV) {
  return b.bundle()
        .on('error', config.onError)
        .pipe(source(file))
        .pipe(gulpif(!ENV_DEV, streamify(sourcemaps.init())))
        .pipe(gulpif(!ENV_DEV, streamify(uglify())))
        .pipe(gulpif(!ENV_DEV, streamify(sourcemaps.write('./sourcemaps'))))
        .pipe(gulp.dest(config.dist_app_js))
        .pipe(gulpif(ENV_DEV, livereload()));
}

/*----- end   **    util func for brwoserify     **/

/*    【 js_app:dev 】
 *
 *     1. browserify & reactify
 */

gulp.task('js_app:dev', ['js_lib'], function() {
    DEV = true;
    return buildJs(DEV, config.src_app_js);
})

/*    【 js_app:build 】
 *      
 *     1. browserify & reactify 
 *     1. uglify
 *     2. not watch
 */

gulp.task('js_app:build', ['js_lib'], function() {
    DEV = false;
    return buildJs(DEV, config.src_app_js);
});


/*    【 js_lib 】
 *      
 *     1. copy 3rd party library to dist folder
 */

gulp.task('js_lib', function() {
    return gulp.src(config.src_3rd_js)
        .pipe(gulp.dest(config.dist_3rd_js));
});
