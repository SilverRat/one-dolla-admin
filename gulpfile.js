const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const eslint = require("gulp-eslint");


gulp.task("eslint", function() {
    return gulp.src(["app/viewmodels/*.js", "app/main.js", "gulpfile.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

// Static server
gulp.task("browser-sync", ["eslint"], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        files: ["app/viewmodels/*.js", "app/views/*.html", "*.html", "app/main.js"]
    });
});

gulp.task("default", ["browser-sync"]);
