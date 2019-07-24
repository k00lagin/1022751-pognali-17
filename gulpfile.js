"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var nunjucks = require('gulp-nunjucks');
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var data = require('gulp-data');
var fs = require('fs');

gulp.task("fonts", function () {
  return gulp.src("source/fonts/*")
    .pipe(gulp.dest("build/fonts"))
    .pipe(server.stream());
});

gulp.task("img", function () {
  return gulp.src("source/img/**/*")
    .pipe(gulp.dest("build/img"))
    .pipe(server.stream());
});

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(data(function(file) {
      return JSON.parse(fs.readFileSync('./source/data/data.json'));
    }))
    .pipe(nunjucks.compile())
    .pipe(gulp.dest('build'));
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/img/**/*", gulp.series("img"));
  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/**/*.html", gulp.series("html"));
  gulp.watch("build/*.html").on("change", server.reload);
});

gulp.task("start", gulp.series("fonts", "img", "html", "css", "server"));
