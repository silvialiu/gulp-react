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
	//gzip = require('gulp-gzip'),
	uglify = require('gulp-uglify')
    plumber = require('gulp-plumber'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify');

var config = {
     src_app_js: './assets/js/app/*.js',
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

/* gulp clean */

gulp.task('clean', function(cb){
    del(['dist/asstes/css'], cb);
})



var watch = false,
dev = false;

/**    task jshint    **/
// TODO ::  & uglify().rename({suffix:'.min'})

gulp.task('lint', function(){
	return gulp.src(['***.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
})

/**    task js     **/

function buildJs(file, watch, dev) {
	var b = browserify({
		basedir: './assets/js/app/',
		cache: {},
		packageCache: {}
	});
	if (watch) {
		b = watchify(b);
		b.on('update', function(){
			bundleFunc(b);
			gutil.log(gutil.colors.yellow('bundle...'));
		});
	}
	b.transform('reactify'); // reactify

	b.transform(literalify.configure({ // map module name with global objects
		'react': 'window.React',
		'zepto': 'window.Zepto'
	}))


    var bied = transform(function(filename){
        console.log('-----------');
        console.log(filename);
        b.add(filename);
        return b.bundle();
    });

    return gulp.src(file)
        .pipe(bied)
        .pipe(gulp.dest('dist/js'));
}

function bundleFunc(b, dev) {
	//console.log(dev);
	return b.bundle()
  .pipe(source('index.js'))
  //.pipe(plumber({errorHandler: onError}))
  .pipe(gulpif(dev, streamify(uglify())))
  .pipe(gulp.dest('dist/js'))
  .pipe(gulpif(watch, livereload()));		
}

gulp.task('js-watch', function(){
	watch = true;
	dev = true;
    var path = require('path')
    var filename = path.join(__dirname, 'asssets/app/index.js')
    var b = browserify(filename, {
        //basedir: './assets/js/app/',
        cache: {},
        packageCache: {}
    });
    if (watch) {
        b = watchify(b);
        b.on('update', function(){
            bundleFunc(b);
            gutil.log(gutil.colors.yellow('bundle...'));
        });
    }
    b.transform('reactify'); // reactify

    b.transform(literalify.configure({ // map module name with global objects
        'react': 'window.React',
        'zepto': 'window.Zepto'
    }))


    function bundle(){
        var bundle = transform(function(filename){
            console.log('------');
            console.log(filename);
            return b.bundle()
        }) 

        return gulp.src('assets/js/app/*.js')
            .pipe(bundle)
            .pipe(gulp.dest('dist/js'));

    }

    return bundle();
})

/**   task js-nowatch   **/

gulp.task('js-build', function(){
	return buildJs('./index.js', watch, dev);
});


// TODO 
/*
    1. del: build 前清空dist
    2. source map

*/


/**  ----------  task run ------------- **/	


gulp.task('default', ['']);

gulp.task('watch', ['js-watch'], function(){
    // TODO ::  watch html, sass
	//gulp.watch('./less/*.less', ['compile-less']);
	livereload.listen(35729);
});

gulp.task('build');
