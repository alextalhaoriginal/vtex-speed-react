const proxy = require('proxy-middleware');
const serveStatic = require('serve-static');
const httpPlease = require('connect-http-please');
const url = require('url');
const middlewares = require('./speed-middleware');

require('dotenv').config();

let accountName;
let environment;
let imgProxyOptions;
let pkg;
let portalHost;
let portalProxyOptions;
let rewriteLocation;
let secureUrl;
let verbose;

module.exports = function(grunt) {
  // VTEX LOCAL
  pkg = grunt.file.readJSON('package.json');
  accountName = process.env.VTEX_ACCOUNT || pkg.accountName;
  environment = process.env.VTEX_ENV || 'vtexcommercestable';
  secureUrl = process.env.VTEX_SECURE_URL || pkg.secureUrl;
  verbose = grunt.option('verbose');

  if (secureUrl) {
    imgProxyOptions = url.parse(`https://${accountName}.vteximg.com.br/arquivos`);
  } else {
    imgProxyOptions = url.parse(`http://${accountName}.vteximg.com.br/arquivos`);
  }

  imgProxyOptions.route = '/arquivos';
  portalHost = `${accountName}.${environment}.com.br`;

  if (secureUrl) {
    portalProxyOptions = url.parse(`https://${portalHost}/`);
  } else {
    portalProxyOptions = url.parse(`http://${portalHost}/`);
  }
  portalProxyOptions.preserveHost = true;
  portalProxyOptions.cookieRewrite = `${accountName}.vtexlocal.com.br`;

  rewriteLocation = function(location) {
    return location.replace('https:', 'http:').replace(environment, 'vtexlocal');
  };

  const config = {
    /**
     * @param {Object} connect - Essa task criar um servidor local usando o speed-middlewara.js
     * para fazer o prox de aquivos (HTML, CSS, JS, IMG, MIDIAS, FONTES ...)
     */

    connect: {
      http: {
        options: {
          hostname: '*',
          livereload: true,
          port: process.env.PORT || 80,
          middleware: [
            middlewares.disableCompression,
            middlewares.rewriteLocationHeader(rewriteLocation),
            middlewares.replaceHost(portalHost),
            middlewares.replaceHtmlBody(environment, accountName, secureUrl),
            httpPlease({
              host: portalHost,
              verbose,
            }),
            serveStatic('./build'),
            proxy(imgProxyOptions),
            proxy(portalProxyOptions),
            middlewares.errorHandler,
          ],
        },
      },
    },

    /**
     * @param {Object} pug - Task responsável por compilar todos os arquivos pug em HTML
     */
    pug: {
      compile: {
        options: {
          data: {
            debug: false,
          },
        },
        files: [
          {
            expand: true,
            cwd: './src/templates',
            src: ['*.pug'],
            dest: './build',
            ext: '.html',
          },
        ],
      },
    },

    /**
     * @param {Object} browserify - Essa task é responsável por transformar o código react e ES6 para ES5
     * todos os códigos JS/JSX serão compilados em main-store.js.
     */
    browserify: {
      dev: {
        files: {
          'build/arquivos/main-store.js': 'src/js/index.js',
        },
        options: {
          transform: ['babelify', 'reactify'],
        },
      },
    },

    /**
     * @param {Object} autoprefixer - Autoprefixer mapea todas as propriedades do CSS e coloca os prefixo de forma automática
     */
    autoprefixer: {
      main: {
        options: {
          browsers: ['last 10 versions'],
        },
        files: [
          {
            cwd: 'build/arquivos',
            src: ['*.css', '!*.min.css', '!*.{eot,svg,ttf,woff}.css'],
            dest: 'build/arquivos/',
            ext: '.css',
            expand: true,
          },
        ],
      },
    },

    /**
     * @param {Object} copy - copia as imagens para  build/aruivos
     */
    copy: {
      main: {
        files: [
          // includes files within path
          {
            expand: true,
            cwd: './src/images/',
            src: ['*.{jpg,png,gif}'],
            dest: './build/arquivos',
          },
        ],
      },
    },

    /**
     * @param {Object} uglify - Pega o código compilado e minifica
     */
    uglify: {
      dev: {
        options: {
          mangle: false,
        },
        files: {
          'build/arquivos/main-store.min.js': ['build/arquivos/main-store.js'],
        },
      },
      dist: {
        options: {
          mangle: true,
          compressed: true,
        },
        files: {
          'build/arquivos/main-store.min.js': ['build/arquivos/main-store.js'],
        },
      },
    },

    watch: {
      options: {
        livereload: true,
      },

      pug: {
        files: ['src/**/*.pug'],
        tasks: ['pug'],
      },

      copy: {
        files: ['src/**/*.{jpg,png,gif}'],
        tasks: ['copy'],
      },

      browserify: {
        files: ['src/**/*.{js,jsx}'],
        tasks: ['browserify', 'uglify:dev'],
      },
    },
  };

  const tasks = {
    default: ['pug', 'browserify', 'connect', 'watch'],
    min: ['browserify', 'uglify:dist', 'imagemin'],
    build: ['min', 'pug'],
  };

  grunt.config.init(config);

  for (const name in pkg.devDependencies) {
    if (name.slice(0, 6) === 'grunt-') {
      grunt.loadNpmTasks(name);
    }
  }

  return (() => {
    const result = [];
    for (const taskName in tasks) {
      const taskArray = tasks[taskName];
      result.push(grunt.registerTask(taskName, taskArray));
    }
    return result;
  })();
};
