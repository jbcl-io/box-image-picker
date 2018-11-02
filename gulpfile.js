const gulp = require('gulp');
const babel = require('gulp-babel');
const sequence = require('gulp-sequence');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const concat = require('gulp-concat');


gulp.task('js', function() {
    gulp.src('src/scripts/index.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(rename('box-image-picker.js'))
        .pipe(gulp.dest('dist'));
});


gulp.task('css', function() {
    gulp.src('src/styles/*.scss')
        .pipe(concat('box-image-picker.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist'));
});


gulp.task('build', ['js', 'css']);

gulp.task('watch', function() {
    gulp.watch('src/**/*', ['build']);
});

gulp.task('default', ['build']);