var browserify = require('browserify');
var gulp = require('gulp');
var reactify = require('reactify');
var gutil = require('gulp-util');
var rename = require('gulp-rename'),
	source = require('vinyl-source-stream'),
	watchify = require('watchify'),
	livereload = require('gulp-livereload'),
	notify = require('gulp-notify'),
	literalify = require('literalify'),
	gulpif = require('gulp-if'),
	//gzip = require('gulp-gzip'),
	uglify = require('gulp-uglify'),
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
var watch = false,
	  dev = false;

/**    task jshint    **/
// TODO :: 

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

	b.add(file)
	bundleFunc(b, dev);
}

function bundleFunc(b, dev) {
	//console.log(dev);
	return b.bundle()
		.on('error', gutil.log.bin)
		.pipe(source('index.js'))
		.pipe(gulpif(dev, streamify(uglify())))
		.pipe(gulp.dest('dist/js'))
		.pipe(gulpif(watch, livereload()));		
}

gulp.task('js-watch', function(){
	watch = true;
	dev = true;
	return buildJs('./index.js', watch, dev);
})

/**   task js-nowatch   **/

gulp.task('js-build', function(){
	return buildJs('./index.js', watch, dev);
});


/**  ----------  task run ------------- **/	


gulp.task('default', ['browserify']);

gulp.task('watch', ['js-watch'], function(){
	//gulp.watch('./less/*.less', ['compile-less']);
	livereload.listen(35729);
});

gulp.task('build');
