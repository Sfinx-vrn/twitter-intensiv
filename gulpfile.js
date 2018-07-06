var gulp = require('gulp'),
    browserSync	= require('browser-sync'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer');
    sourcemaps = require('gulp-sourcemaps');
    cleanCSS = require('gulp-clean-css');
    notify = require('gulp-notify');
    fileinclude = require('gulp-file-include');

gulp.task("htmlbuild",function(){
    gulp.src(['src/html/*.html', '!src/html/_*.html'])
        .pipe(fileinclude())
        .pipe(gulp.dest('src'));
});


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./src"
    });
    gulp.watch("src/sass/**/*.sass", ['sass']);
    gulp.watch('src/html/*.html', ['htmlbuild']); 
    gulp.watch("src/*.html").on('change', browserSync.reload);
    gulp.watch('src/js/**/*.js').on("change", browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
// Создаем sass задание
// gulp.src - путь по которому лежит scss-файл который мы будем компилировать
// gulp.dest - путь в который мы будем генерить нашу css-ку
// plumber() - не выбрасывать из компилятора если есть ошибки
// errLogToConsole: true - выводить номер строки в которой допущена ошибка
gulp.task('sass', function() {
    return gulp.src("src/sass/*.sass")
        .pipe(sourcemaps.init())
    	.pipe(plumber({errorHandler: notify.onError()}))
    	.pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer({browsers: ['last 4 versions']}))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
        //.pipe(notify('Done! Master Sfinx :)'));
});

gulp.task('default', ['serve'])
