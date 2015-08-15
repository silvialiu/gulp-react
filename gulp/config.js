var src  = './assets/',
    dist = './dist/';
var gutil = require('gulp-util');

module.exports = {
    src_app_js : src + 'js/app/**/*.js',
    src_mod_js : src + 'js/mod/**/*.js',
    src_js     : src + 'js/**/*.js',
    src_3rd_js : [
        src + 'js/vender/zepto/zepto.min.js',
        src + 'js/vender/react/react.js',
        src + 'js/vender/react/react.min.js'
    ],
    src_img     : src + 'img/**/*',
    src_html    : './template/**/*.html',
    src_scss    : src + 'sass/**/*.scss',
    dist_css    : dist + 'css/',
    dist_img    : dist + 'img/',
    dist_app_js : dist + 'js/app/',
    dist_3rd_js : dist + 'js/vendor/',
    onError: function(err) {
        gutil.beep();
        console.log(gutil.colors.red(err));
        this.emit('end');
    }
};