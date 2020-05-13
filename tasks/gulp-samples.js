let gulp = require('gulp');
let gulpIgnore = require('gulp-ignore');
let uglify = require('gulp-uglify');

// let gSort = require('gulp-sort');
let rename = require('gulp-rename');
let fs = require('fs.extra');
let path = require('path');
let flatten = require('gulp-flatten');
let del = require('del');
let es = require('event-stream');
let shell = require('gulp-shell');
let replace = require('gulp-replace');
let contains = require('gulp-contains');

var igConfig = require('./gulp-config.js')
// var platform = "React";
// var igConfig = require('./gulp-config.js')[platform];

eval(require('typescript')
.transpile(require('fs')
.readFileSync("./tasks/Transformer.ts").toString()));

function log(msg) {
    console.log('gulp-samples.js ' + msg);
}
log('loaded');


// var sampleSource = igConfig.SamplesRootPath + '/**/**/package.json';
// var sampleSource = igConfig.SamplesRootPath + '/excel/**/package.json';
// var sampleSource = igConfig.SamplesRootPath + '/maps/**/package.json';
var sampleSource = igConfig.SamplesRootPath + '/tests/**/package.json';

// this variable stores detailed information about all samples in ./samples/ folder
var samples = [];

function cleanupSamples(cb) {

    del.sync("./sample-test-files/styles.css", {force:true});
    del.sync("./sample-test-files/src/styles.css", {force:true});
    // CategoryChartSharedStyles.css
    // GeoMapSharedStyles.css
    // FinancialChartSharedStyles.css
    // DoughnutChartSharedStyles.css DataChartSharedStyles.css
    // PieChartSharedStyles.css SparklineSharedStyles.css
    // TreeMapSharedStyles.css
}

function getSamples(cb) {

    samples = [];

    del.sync("./sample-test-files/public", {force:true});
    del.sync("./sample-test-files/**/*.md", {force:true});
    del.sync("./sample-test-files/**/*.ts", {force:true});
    del.sync("./sample-test-files/**/*.css", {force:true});
    del.sync("./sample-test-files/**/*.json", {force:true});
    del.sync("./sample-test-files/*.json", {force:true});

    gulp.src([
        sampleSource,
    ])
    // .pipe(gSort( { asc: false } ))
    .pipe(es.map(function(samplePackage, sampleCallback) {

        let SampleFolderName = Transformer.getRelative(samplePackage.dirname);
        // log(SampleFolderName);

        let sampleFiles = [];
        gulp.src([SampleFolderName + "/**"])
        .pipe(flatten({ "includeParents": -1 }))
        // .pipe(gSort( { asc: false } ))
        .pipe(es.map(function(file, fileCallback) {
            let fileDir = Transformer.getRelative(file.dirname);
            sampleFiles.push(fileDir + "/" + file.basename);
            fileCallback(null, file);
        }))
        .on("end", function() {
            // log(SampleFolderName);

            let sampleInfo = Transformer.getSampleInfo(samplePackage, sampleFiles);
            samples.push(sampleInfo);

            sampleCallback(null, samplePackage);
        });

        // sampleCallback(null, sample);
    }))
    .on("end", function() {
        Transformer.sort(samples);
        Transformer.process(samples);
        // Transformer.verify(samples);
        // Transformer.print(samples);

        log('getSamples found ' + samples.length + " samples");

        // let last = samples[samples.length - 1];
        // log('package name ' + last.PackageFileContent.name);
        // last.PackageDependencies = Transformer.getDependencies(last);
        // log('packages \n' + last.PackageFileContent.dependencies);
        // log('dependencies: \n' + last.PackageDependencies);

        cb();
    });


} exports.getSamples = getSamples;


var sampleOutputFolder = './sample-test-files/';

// updating package.json files for all sample using a template
function updatePackages(cb) {

    // getting content of package.json file from templates
    let templatePackageFile = fs.readFileSync("./sample-template-files/package.json");
    let templatePackageJson = JSON.parse(templatePackageFile.toString());

    // getting content of package.json file from the browser
    let browserPackageFile = fs.readFileSync("./package.json");
    let browserPackageJson = JSON.parse(browserPackageFile.toString());

    // Transformer.verifyPackage(browserPackageJson, templatePackageJson);

    // let last = samples[samples.length - 1];
    // let content = Transformer.getPackage(last, templatePackageJson);
    // fs.writeFileSync(sampleOutputFolder + "package.json", content);

    for (const sample of samples) {

        let content = Transformer.getPackage(sample, templatePackageJson);
        fs.writeFileSync(sampleOutputFolder + "package.json", content);
        break;
    }

    cb();
} exports.updatePackages = updatePackages;

function updateReadme(cb) {

    var template = fs.readFileSync("./sample-template-files/ReadMe.md", "utf8");
    // Transformer.getReadme(template);

    for (const sample of samples) {

        let readme = Transformer.getReadme(sample, template);
        fs.writeFileSync(sampleOutputFolder + "ReadMe.md", readme);
        break;
    }
    // log('updateReadme  ');
    cb();
} exports.updateReadme = updateReadme;

var sharedSetupFiles = [
    './sample-template-files/src/index.css',
    './sample-template-files/src/sandbox.config.json',
];
var sharedDataFiles = [
    './sample-shared-files/*.*',
];

function updateSharedFiles(cb) {

    var template = fs.readFileSync("./sample-template-files/src/index.tsx", "utf8");
    // Transformer.getReadme(template);

    for (const sample of samples) {

        let indexFile = Transformer.updateIndex(sample, template);
        // fs.promises.mkdir(sampleOutputFolder + 'src', { recursive: true }).catch(console.error);
        fs.mkdir(sampleOutputFolder + 'src', { recursive: true }, (err) => {
            if (err) throw err;
        });
        fs.writeFileSync(sampleOutputFolder + 'src/index.tsx', indexFile);

        log('updating share setup files... ');
        gulp.src(sharedSetupFiles)
        // .pipe(flatten({ "includeParents": -1 }))
        // .pipe(gSort( { asc: false } ))
        .pipe(es.map(function(file, fileCallback) {
            // let fileDir = Transformer.getRelative(file.dirname);
            // log(fileDir + "/" + file.basename)
            // SampleFiles.push(fileDir + "/" + file.basename);
            fileCallback(null, file);
        }))
        .pipe(gulp.dest(sampleOutputFolder + 'src'))

        log('updating share data files... ');
        gulp.src('./sample-shared-files/**/*.*')
        // .pipe(flatten({ "includeParents": -1 }))
        // .pipe(gSort( { asc: false } ))
        // .pipe(gulpIgnore.exclude(condition))
        .pipe(es.map(function(sharedFile, sharedFileCallback) {

            if (sample.isUsingFileName(sharedFile.basename)) {
                log('+ share data ' + sharedFile.basename);
                sharedFileCallback(null, sharedFile);
            } else {
                log('- share data ' + sharedFile.basename);
                sharedFileCallback(null);
            }

            // SampleFiles.push(fileDir + "/" + file.basename);
        }))
        .pipe(gulp.dest(sampleOutputFolder));

        break;
    }

    cb();
} exports.updateSharedFiles = updateSharedFiles;

function task1(cb) {
    log('task1  ');
    cb();
} exports.task1 = task1;

function task2(cb) {
    log('task2  ');
    cb();
} exports.task2 = task2;


// function updateReadme(cb) {

//     log('getSampleFolderNames in ' + igConfig.SamplesRootPath);

//     gulp.src([
//         // SamplesRootPath + '/excel-library/**',
//         // SamplesRootPath + '/**/**/**/**/Excel*.tsx',
//         // igConfig.SamplesRootPath + '/**/readme.md',
//         igConfig.SamplesRootPath + '/**/package.json',
//         // SamplesRootPath + '/maps/**',
//         // samplesSourcePath + '/maps/**/*.tsx',
//     ])
//     // .pipe(flatten({ "includeParents": -1 }))
//     .pipe(es.map(function(file, cb2) {
//         // let item = '..' + file.dirname.replace(repoRootPath, '');
//         // item += '/' + file.basename;
//         // log(' ' + item);
//         // log(file.dirname);
//         // log(file.dirname + '/' + file.basename);
//         // return item;
//         // cb2();
//         let relPath = Transformer.getRelative(file.dirname);
//         // log(relPath);

//         SampleFolderNames.push(relPath);
//         cb2(null, file);
//     }))
//     .on("end", function() {

//         log('getSampleFolderNames found ' + SampleFolderNames.length + " folders with samples");
//         cb();
//     })

// } exports.updateReadme = updateReadme;


// function updateReadme(cb) {
//     // del.sync(BrowserRootPath + "/**/*.*", {force:true});
//     // del.sync(browserTargetPath);
//     log('updateReadme');

//     getSampleFolderNames();

//     log('updateReadme end');
//     // cb();
// } exports.updateReadme = updateReadme;


// function getSampleFolderNames(cb) {

//     log('getSampleFolderNames in ' + igConfig.SamplesRootPath);

//     gulp.src([
//         // SamplesRootPath + '/excel-library/**',
//         // SamplesRootPath + '/**/**/**/**/Excel*.tsx',
//         // igConfig.SamplesRootPath + '/**/readme.md',
//         igConfig.SamplesRootPath + '/**/package.json',
//         // SamplesRootPath + '/maps/**',
//         // samplesSourcePath + '/maps/**/*.tsx',
//     ])
//     // .pipe(flatten({ "includeParents": -1 }))
//     .pipe(es.map(function(file, cb2) {
//         // let item = '..' + file.dirname.replace(repoRootPath, '');
//         // item += '/' + file.basename;
//         // log(' ' + item);
//         // log(file.dirname);
//         // log(file.dirname + '/' + file.basename);
//         // return item;
//         // cb2();
//         let relPath = Transformer.getRelative(file.dirname);
//         log(relPath);

//         SampleFolderNames.push(file.dirname);
//         cb2(null, file);
//     }))
//     .on("end", function() {

//         log('getSampleFolderNames found ' + SampleFolderNames.length + " folders with samples");
//         cb();
//     })

// } exports.getSampleFolderNames = getSampleFolderNames;