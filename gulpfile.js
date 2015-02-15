var browserify = require('browserify');
var gulp = require('gulp');
var reactify = require('reactify');
var gutil = require('gulp-util');
var rename = require('gulp-rename'),
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
	//gzip = require('gulp-gzip'),
	uglify = require('gulp-uglify')
    plumber = require('gulp-plumber'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify');

var config = {
     src_app_js: './assets/js/app/**/*.js',
     src_js: './assets/js/**/*.js',
     dis_app_js: './dist/js/',
     errorHandler: function(){
        var args = Array.prototype.slice.call(arguments);
        notify.onError({
           title: "-----------Compile Error---------",
           message: "<%= error.message %>"
       }).apply(this.args);
        this.emit('end')
    }
};

//"paths": {
//    "less": "assets/less/*.less",
//    "js": "./app/**/*.js",
//    "jsx": "./app/**/*.jsx",
/*    "app": "./app/app.js",
    "html": "*.html"
  },
  "dest": {
    "style": "style.css",
    "app": "app.js",
    "dist": "dist"
  }
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


gulp.task('css',['copy_css'], function() {
    return gulp.src(SRC_CSS + '/**/*.scss')
    .pipe(changed(DEST_CSS))
    .pipe(plumber({errorHandler: onError}))
    .pipe(compass({
        sass: 'static/css',
        css: 'dist/css',
        style: 'compact'
    }))
    .pipe(minifycss())
    .pipe(gulp.dest(DST_CSS))
    .pipe(notify({ message: '--->>>>>-----css task complete' }))
    .pipe(livereload());
});

/* gulp image */

gulp.task('image', function(){
    return gulp.src('src/image/*/*')
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true}))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({message: '--->>>>>-----Image task complete'}))
});




var watch = false,
dev = false;

/**    task jshint    **/

gulp.task('lint', function(){
  return gulp.src(['***.js'])
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
        .pipe(source(file))
        //.pipe(plumber({errorHandler: onError}))
        .pipe(gulpif(!ENV_DEV, streamify(sourcemaps.init())))
          .pipe(gulpif(!ENV_DEV, streamify(uglify())))
        .pipe(gulpif(!ENV_DEV, streamify(sourcemaps.write('./sourcemaps'))))
        .pipe(gulp.dest('dist/js'))
        .pipe(gulpif(ENV_DEV, livereload()));
}

/*----- end   **    util func for brwoserify     **/

gulp.task('js:dev', function(){
	DEV = true;
    return buildJs(DEV, config.src_app_js);
})


/*    【 js:build 】
 *
 *     1. uglify
 *     2. not watch
 */

gulp.task('js:build', function(){
    DEV = false;
    return buildJs(DEV, config.src_app_js);
});


/*    【 clean 】
 *
 *     clear dist folder for both stylesheet & script
 */

gulp.task('clean', function(){
    del(['dist/js', 'dist/css', 'dist/img'], function(){
        gutil.log(gutil.colors.green('------->>>>------ task【 clean 】 complete ' ));
    });
});

// TODO
/*
    2. source map
*/


/**  ----------  task run ------------- **/


gulp.task('default', ['']);

gulp.task('watch', ['clean', 'js:dev'], function(){
    // TODO ::  watch html, sass
	//gulp.watch('./less/*.less', ['compile-less']);
	livereload.listen(35729);
});

gulp.task('build', sequence('clean', 'js:build'));
