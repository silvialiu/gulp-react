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
	gulpif = require('gulp-if');

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
var watch = false;

/**    task js     **/

function buildJs(file, watch) {
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
	bundleFunc(b);
}

function bundleFunc(b) {
	return b.bundle()
		.pipe(source('index.js'))
		// TODO  .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
		.pipe(gulp.dest('dist/js'))
		.pipe(gulpif(watch, livereload()));		
}

gulp.task('js-watch', function(){
	watch = true;
	return buildJs('./index.js', watch);
})

/**   task js-nowatch   **/

gulp.task('js-nowatch', function(){
	return buildJs('./index.js', watch);
});


/**  ----------  task run ------------- **/	


gulp.task('default', ['browserify']);
gulp.task('watch', ['js-watch'], function(){
	//gulp.watch('./less/*.less', ['compile-less']);
	livereload.listen(35729);
})