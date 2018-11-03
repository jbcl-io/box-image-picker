const gulp = require('gulp');
const sequence = require('gulp-sequence');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');



gulp.task('js', function() {
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
    .pipe(gulp.dest("dist"));
});


gulp.task('css', function() {
    gulp.src('src/styles/*.scss')
        .pipe(concat('box-image-picker.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist'));
});


gulp.task('build', ['js', 'css']);

gulp.task('watch', function() {
    gulp.watch('src/scripts/**/*', ['js']);
    gulp.watch('src/styles/**/*', ['css']);
});

gulp.task('default', ['build']);