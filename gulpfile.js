var browserify = require('browserify');
var gulp = require('gulp');
var reactify = require('reactify');
var gutil = require('gulp-util');
var rename = require('gulp-rename'),
    minifyHtml = require('gulp-minify-html'),
    watchify = require('watchify'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    literalify = require('literalify'),
    gulpif = require('gulp-if')
    jshint = require('gulp-jshint'),
    forEach = require('gulp-foreach'),
    _ = require('lodash'),
    path = require('path'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    sequence = require('gulp-sequence'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
	//gzip = require('gulp-gzip'),
	uglify = require('gulp-uglify')
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify');

var config = {
    src_app_js: './assets/js/app/**/*.js',
    src_mod_js: './assets/js/mod/**/*.js',
    src_js: './assets/js/**/*.js',
    src_3rd_js: [
        './assets/js/vender/zepto/zepto.min.js',
        './assets/js/vender/react/react.min.js'
    ],
    src_img: './assets/img/**/*',
    src_html: './template/**/*.html',
    src_scss: './assets/sass/**/*.scss',
    dist_css: './dist/css/',
    dist_img: './dist/img/',
    dist_app_js: './dist/js/app/',
    dist_3rd_js: './dist/js/vendor/',
    onError: function(err) {
        gutil.beep();
        console.log(gutil.colors.red(err));
        this.emit('end');
    }
};


/*    【 clean 】
 *
 *     clear dist folder for both stylesheet & script & image
 */

gulp.task('clean', function(){
    del.sync(['dist/js', 'dist/css', 'dist/img'], function(){
        gutil.log(gutil.colors.green('---- 【 clean 】-- complete -- >>>>--' ));
    });
});

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
    //.pipe(changed(config.dist_css))
    //.pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(minifycss())
    .pipe(gulp.dest(config.dist_css))
    .on('end', function(){
        gutil.log(gutil.colors.green('---- 【 css 】-- complete -- >>>>--' ));
    })
    .pipe(livereload());
});


var DEV = false;

/*     TODO ::  【 js_lint 】
 *
 *     haven't use 
 */

gulp.task('lint', function(){
  return gulp.src([config.src_app_js, config.src_mod_js, '!./assets/js/(mod|app)/**/*.min.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
})

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
    b.on('error', function(err){
        console.log('-----');
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
    b.transform('reactify'); // reactify

    b.transform(literalify.configure({ // map module name with global objects
        'react': 'window.React',
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

/*    【 html_min 】
 *      
 *     1. html min
 */

gulp.task('html', function() {
    var minify_html_opts = {};
    return gulp.src(config.src_html)
        //.pipe(minifyHtml())
        .pipe(livereload());
});


/*    【 image 】
 *
 *     1. image min 
 *     2. TODO: base64
 */

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

/*
gulp.task('watch', ['js_app:dev', 'image'], function(){

	livereload.listen(35729);

    gulp.watch(config.src_html, ['html']);
    gulp.watch(config.src_img, ['image']);
});
*/

gulp.task('build', sequence('clean', 'js_app:build', 'image'));
