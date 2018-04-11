const gulp = require("gulp");
const browserSync = require("browser-sync").create()
const plumber     = require("gulp-plumber")
const runSequence = require('run-sequence')
const fs = require("fs")
const path = require("path");
const url = require('url');


/*------------------------------------------
env variables
------------------------------------------*/
const envfile = require("./env.js")
let isBuild;
let variables;
let _buildPath;
switch(process.env.NODE_ENV){
  case "release":
    variables = envfile.release;
    isBuild = true;
    _buildPath = "build_release";
    break;
  case "stg":
    variables = envfile.stg;
    isBuild = true;
    _buildPath = "build_stg";
    break;
  case "dev":
  default:
    variables = envfile.dev;
    isBuild = false;
    _buildPath = "build";
  break;
}
variables = Object.assign(envfile.common, variables);

const PORT = 8888;
const SOURCEPATH = path.join('', 'app');
const LAYOUTPATH = path.join(SOURCEPATH, 'layout');
const STYLUSPATH = path.join(SOURCEPATH, 'style');
const ASSETSPATH = path.join(SOURCEPATH, 'assets');
const ES6PATH = path.join(SOURCEPATH, 'js');

const BUILDPATH = _buildPath;
const HTMLPATH = BUILDPATH;
const JSPATH = path.join(BUILDPATH, 'js');
const CSSPATH = path.join(BUILDPATH, 'styles');
const SPRITEPATHS = ["img/sp/sp-sprite", "img/pc-sprite"];


/*------------------------------------------
gulp tasks
------------------------------------------*/

//----------------
//  dafault & Build
//----------------

gulp.task('default', (cb)=> {
  return runSequence(
    'sprite',
    'copy',
    'webpack',
    'stylus',
    'pug',
    'browser-sync',
    'watch',
    cb
  );
});

gulp.task('build', (cb)=> {
  return runSequence(
    'clean',
    'sprite',
    'copy',
    'webpack',
    'stylus',
    'pug',
    'minify',
    'imagemin',
    cb
  );
});


//----------------
//  Watch
//----------------
gulp.task("watch", ()=>{
  const watch = require("gulp-watch");
  gulp.watch(path.join(LAYOUTPATH, "**/*.pug"), ()=>{
    browserSync.reload(path.join(BUILDPATH, "**/*.html"));
  })
  gulp.watch(path.join(STYLUSPATH,"**/*.styl"), ["stylus"])

  watch(path.join(ASSETSPATH, "**/*"), (event)=>{
    gulp.start("copy");
  });

  let spriteDirArr = [];
  SPRITEPATHS.forEach((dir)=>{
    const arr = dir.split('/');
    const name = arr[arr.length-1];
    let soritepath = "";
    for(var j=0; j<arr.length-1; j++){
      soritepath += arr[j]+'/';
    }
    spriteDirArr.push(path.join(ASSETSPATH, soritepath, name, '*png'));
  });
  gulp.watch(spriteDirArr, ["sprite"]);
  gulp.watch(path.join(JSPATH, "**/*.js"), ()=>{
    browserSync.reload(path.join(BUILDPATH, "**/*.js"));
  })


})

//----------------
//  BROWER
//----------------
gulp.task("browser-sync", ()=>{
  browserSync.init({
    server: {
      baseDir: BUILDPATH,
      middleware: [
        pugMiddleWare
      ]
    },
    scrollProportionally: false,
    open: true,
    port: PORT,
    ghostMode: false
  })
})


//----------------
//  LAYOUT
//----------------
const pugMiddleWare = (req, res, next)=> {

  const requestPath = url.parse(req.url).pathname;
  if (!requestPath.match(/(\/|\.html)$/)) {
    return next();
  }

  const pug = require('pug');
  const suffix = path.parse(requestPath).ext ? '': 'index.html'
  const HTMLPATH = path.join(BUILDPATH, requestPath, suffix);
  const projectPth = process.cwd();
  const pugPath = path.join(LAYOUTPATH, requestPath, suffix).replace('.html','.pug');

  try{
    fs.statSync(pugPath)
    const data = getPugData(pugPath);
    const html = pug.compileFile(pugPath, {
      locals:{},
      pretty: true,
      projectPth,
      compileDebug: true,
      doctype: "html"
    })(data);

    fs.writeFileSync(HTMLPATH, html, 'utf8');
    return next();
  }catch (e){
    console.log(e)
    return next();
  }
}

const getPugData = (filepath)=>{
  filepath = path.resolve(filepath, '../');
  const layoutRoot = path.join(__dirname, LAYOUTPATH);
  let rootpath = path.relative(filepath, layoutRoot);
  if(rootpath == '') rootpath = '.';

  return {ENV: variables, ROOTPATH: rootpath};
}

gulp.task("pug", ()=>{
  const pug = require("gulp-pug")
  const data = require("gulp-data")

  return gulp.src([
      path.join(LAYOUTPATH, "**/*.pug"),
      "!"+path.join(LAYOUTPATH, "partials/**/*.pug")
    ])
    .pipe(plumber())
    .pipe(data((file)=> {
      return getPugData(file.path);
    }))
    .pipe(pug({
      pretty: !isBuild
    }))
    .pipe(gulp.dest(HTMLPATH))
})


//----------------
//  webpack
//----------------
gulp.task('webpack', (cb)=>{
  const webpackStream = require("webpack-stream");
  const webpack = require("webpack");
  const webpackConfig = require("./webpack.config");
  webpackConfig.context = path.join(__dirname, SOURCEPATH);
  webpackConfig.watch = !isBuild;
  webpackConfig.mode = isBuild ? "production" : "development";
  webpackConfig.plugins[0] = new webpack.DefinePlugin({
    ENV: JSON.stringify(variables)
  })

  if(isBuild == false){
    cb();
  }
  return gulp.src('')
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(JSPATH))
});

//----------------
// CSS
//----------------
gulp.task("stylus", ()=>{
  const stylus = require("gulp-stylus")
  const sourcemaps  = require('gulp-sourcemaps');
  const autoprefixer = require('gulp-autoprefixer')
  return gulp.src(path.join(STYLUSPATH, "/**/!(_)*.styl"))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(autoprefixer({
      browsers: ['last 2 version', 'iOS >= 8.1', 'Android >= 4.4'],
      cascade: false
     }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(CSSPATH))
    .pipe(browserSync.stream())
})

//----------------
// SPRITE
//----------------
gulp.task('sprite', ()=> {
  const merge = require('merge-stream');
  let merged = merge();


  SPRITEPATHS.forEach((dir)=>{

    const arr = dir.split('/');
    const name = arr[arr.length-1];
    let path = "";
    for(var j=0; j<arr.length-1; j++){
      path += arr[j]+'/';
    }
    let stream = spriteStream(path, name);
    merged.add(stream);
  });
  return merged;

});

let spriteStream = (spritepath, name)=>{
  const spritesmith = require('gulp.spritesmith');
  const merge = require('merge-stream');

  let opt = {
    imgName: name+'.png',
    cssName: '_'+name+'.styl',
    imgPath: '../'+spritepath+name+'.png',
    cssFormat: 'stylus',
    padding: 2,
    cssVarMap: function (sprite) {
      sprite.name = name+ '-' + sprite.name;
    }
  };

  const spriteData = gulp.src(path.join(ASSETSPATH, spritepath, name, '*png'))
  .pipe(spritesmith(opt));

  const imgStream = spriteData.img
    .pipe(gulp.dest(path.join(ASSETSPATH, spritepath)));
  const cssStream = spriteData.css
    .pipe(gulp.dest(path.join(STYLUSPATH, 'components')));

  return merge(imgStream, cssStream);
}


//----------------
//  MINIFY
//----------------
gulp.task("minify", ()=>{
  var uglify = require('gulp-uglify-es').default;
  var cleanCSS = require('gulp-clean-css');
  var mergeSteram = require('merge-stream');

  const js = gulp.src(BUILDPATH+"**/*.js")
    .pipe(uglify())
    .on('error', (e)=>{
      console.log(e);
    })
    .pipe(gulp.dest(BUILDPATH));

  const css = gulp.src(BUILDPATH+"**/*.css")
    .pipe(cleanCSS())
    .pipe(gulp.dest(BUILDPATH));

  var merged = (js, css);
  return merged;
})

//----------------
//  CLEAN
//----------------
gulp.task("clean", ()=>{
  const del = require("del");
  return del([BUILDPATH]).then(e=>{

  });
});

//----------------
//  COPY
//----------------
gulp.task("copy", ()=>{
  //一度対象フォルダ内を空にしてからコピーし直す。
  const fs = require('fs');
  const dirname = ASSETSPATH;
  const files = fs.readdirSync(dirname);
  const del = require('del');
  const cpx = require('cpx');
  let arr = [];
  files.forEach((filename)=>{
    if(filename == 'js') return;
    arr.push(BUILDPATH+filename+"/");
  });
  // console.log(arr);

  const destPath = path.join(ASSETSPATH, "**/*");
  del(arr).then(e=>{
    return cpx.copy(destPath, BUILDPATH, ()=>{
      browserSync.reload(destPath);
    });
  });
});


//----------------
//  IMAGEMIN
//----------------
gulp.task('imagemin', ()=>{
  var imagemin = require("gulp-imagemin");
  var pngquant = require("imagemin-pngquant");
  var mozjpeg = require('imagemin-mozjpeg');

  return gulp.src(path.join(BUILDPATH, '**/*'))
    .pipe(plumber())
    .pipe(imagemin([
       pngquant({
         quality: '80-90',
         speed: 1,
         floyd:0
       }),
       mozjpeg({
         quality:85,
         progressive: true
       }),
       // imagemin.svgo({
       //  plugins: [{mergePaths: false}]
       // }),
       imagemin.optipng(),
       imagemin.gifsicle()
     ]
    ))
    .pipe(gulp.dest(BUILDPATH));
});


//----------------
// FTP
// config.js
// module.exports = {
//   host: "testtest.co.jp",
//   user: "user",
//   pass: "password",
//   parallel: 10,
//   dest: "/"
// }
//----------------
gulp.task('ftpdeploy', ()=> {
  const ftp = require('vinyl-ftp');
  const ftpconfig = require('./ftpconfig.js')

  const conn = ftp.create(ftpconfig);
  const globs = [BUILDPATH+'**', '!'+BUILDPATH+"api/**"];

  return gulp.src(globs, {buffer: false})
    .pipe(conn.newer(ftpconfig.dest))
    .pipe(conn.dest(ftpconfig.dest));

});

//----------------
// SFTP
// sshconfig.jsを別ファイルに作ってgitignoreする
// "dev": { host: 'hogehoge.com', port: 22, path: '/home/www/test_dev/'},
// "stg": { host: 'hogehoge.com', port: 22, path: '/home/www/test_stg/'},
// "release": { host: 'hogehoge.com', port: 22, path: '/home/www/test_release/'}
//----------------
gulp.task("sftpdeploy", ()=>{
  const rsync = require('gulp-rsync');
  const sshconfig = require('./sshconfig')

  let config;
  switch(process.env.NODE_ENV){
    case "release":
      config = sshconfig.release
      break
    case "stg":
      config = sshconfig.stg
      break
    case "dev":
    default:
      config = sshconfig.dev
    break
  }

  return gulp.src(BUILDPATH+'**')
    .pipe(rsync({
      root: BUILDPATH,
      hostname: sshconfig.host,
      port: sshconfig.port,
      destination: sshconfig.path
  }));
})

//----------------
//  AWS
//  s3にデプロイするときは
//  s3config.jsとか別ファイルで作ってignoreしておく
//  "dev": { "accessKeyId": "XXXXXXXXXXXXXXXXXXXX", "secretAccessKey": "XXXXXXXXXXXXXXX", "region": "XXXXXXXXXX", "bucket": www.hgoe.com, "path": "test_dev/" },
//  "stg": { "accessKeyId": "XXXXXXXXXXXXXXXXXXXX", "secretAccessKey": "XXXXXXXXXXXXXXX", "region": "XXXXXXXXXX", "bucket": www.hgoe.com, "path": "test_srg/" },
//  "release": { "accessKeyId": "XXXXXXXXXXXXXXXXXXXX", "secretAccessKey": "XXXXXXXXXXXXXXX", "region": "XXXXXXXXXX", "bucket": www.hgoe.com, "path": "test_release/" },
//----------------
gulp.task('s3deploy', ()=>{
  const AWS = require('aws-sdk');
  const async = require('async');
  const s3 = require('s3');
  const s3config = require('s3config.js')

  let config;
  switch(process.env.NODE_ENV){
    case "release":
      config = s3config.release
      break
    case "stg":
      config = s3config.stg
      break
    case "dev":
    default:
      config = s3config.dev
    break
  }


  AWS.config.loadFromPath(path.join(__dirname,"./keys/", config));
  AWS.config.update({region: 'ap-northeast-1'});
  const awss3 = new AWS.S3();
  const options = {
    s3Client: awss3,
  };
  const client = s3.createClient(options);

  const uploadFunc = () =>{
    return new Promise((resolve, reject)=>{

      const params = {
        localDir: BUILDPATH,
        deleteRemoved: false,
        s3Params: {
          Bucket: s3config.bucket,
          Prefix: s3config.path
        },
      };
      const uploader = client.uploadDir(params);
      uploader.on('error', function(err) {
        reject(err);
      });
      uploader.on('progress', function() {
        console.log("progress", uploader.progressAmount, uploader.progressTotal);
      });
      uploader.on('end', function() {
        resolve();
        console.log("done uploading");
      });
    });
  }

  Promise.resolve()
  .then(()=> {
    return uploadFunc();
  });
});




