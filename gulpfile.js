const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sequence = require('gulp-sequence');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');



gulp.task('js', function() {
    return browserify({
        basedir: '.',
        debug: false,
        entries: ['src/scripts/index.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify, { noImplicitAny: true })
    .bundle().on('error', (e) => console.log(e))
    .pipe(source('box-image-picker.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('jsdev', function() {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/scripts/index.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify, { noImplicitAny: true })
    .bundle().on('error', (e) => console.log(e))
    .pipe(source('box-image-picker.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('jsmin', function() {
    return gulp.src('dist/box-image-picker.js')
        .pipe(uglify())
        .pipe(rename('box-image-picker.min.js'))
        .pipe(gulp.dest('dist'))
});


gulp.task('css', function() {
    gulp.src('src/styles/*.scss')
        .pipe(concat('box-image-picker.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist'));
});


gulp.task('cssmin', function() {
    gulp.src('dist/box-image-picker.css')
        .pipe(cleancss())
        .pipe(rename('box-image-picker.min.css'))
        .pipe(gulp.dest('dist'));
});


gulp.task('build', function(callback) {
    return sequence(['js', 'css'], ['jsmin', 'cssmin'], ['jsdev'], callback);
});

gulp.task('watch', function() {
    gulp.watch('src/scripts/**/*', ['jsdev']);
    gulp.watch('src/styles/**/*', ['css']);
});

gulp.task('default', ['build']);