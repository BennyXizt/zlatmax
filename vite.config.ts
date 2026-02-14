import { defineConfig } from 'vite'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { qrcode } from 'vite-plugin-qrcode'
import { resolve } from 'path'
import { ViteWatchVideoFolderPlugin, ViteWatchEJSFolderPlugin, ViteWatchFontsFolderPlugin, ViteWatchSVGFolderPlugin } from './externe/plugins/watchFolder'
import { externe } from './externe/plugins/ejsUtils'
import { settings } from './settings';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
         // JS
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',

        // ассеты (шрифты, картинки)
        assetFileNames: ({ name }) => {
          if (!name) return 'assets/[name][extname]';
          if (/\.(woff2?|ttf|otf|eot)$/.test(name)) {
            return 'assets/fonts/[name][extname]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|mp4|mov|webm)$/i.test(name)) {
            return 'assets/media/[name][extname]';
          }
          if (/\.(css)$/.test(name)) {
            return 'assets/styles/[name][extname]';
          }
          if (/\.html$/i.test(name)) {
            return 'assets/pages/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
      external: [
        /externe\/plugins\/.*/
      ]
    }
  },
  server: {
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.DS_Store',        
        '**/*.tmp',           
        '**/.vscode/**',
        // '**/public/**'    
      ],
      usePolling: true,      
      interval: 1000          
    },
    hmr: {
      overlay: false,     
      // timeout: 3000     
    },
    proxy: {
      '/php': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/php/, '') // убираем /php из пути
      }
    }
  },
  optimizeDeps: {
    include: ['fluent-ffmpeg', 'vite-plugin-ejs'],
    exclude: []
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '~': resolve(__dirname, 'externe')
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `$BUILD_ENV: "${process.env.NODE_ENV}";`
      }
    }
  },
  plugins: [
     qrcode(),
     ViteEjsPlugin({
      head_component: {
        lang: 'en',
        title: 'My App',
        description: 'Default project description',
        keywords: 'vite, ejs, scss, javascript',
        author: 'Your Name'
      },
      externe
    }, {
      ejs: {
        views: [resolve(__dirname)]
      }
    }),
    ViteWatchEJSFolderPlugin({
      relativePath: `${__dirname}/src/ejs/views/`,
      outputDestination: {
         pages: {
           fileNameException: [
            'test.ejs',
            'externeComponents.ejs'
           ],
           fileDestination: `${__dirname}`
         },
         rest: {
           fileName: [
            'test.ejs',
            'externeComponents.ejs'
           ],
           fileDestination: `${__dirname}/externe/pages/`
         }
        }
    }),
    ViteWatchSVGFolderPlugin({
      relativePath: `${__dirname}/public/media/icons/`,
      nameOfTheOutputFile: 'sprite.svg',
      dummy: {
        destination:  `${__dirname}/externe/pages/`,
        fileName:  'fontIcons.html'
      },
      convertType: settings.SVGConvertType
    }),
    ViteWatchFontsFolderPlugin({
      relativePath: `${__dirname}/src/assets/fonts`,
      outputDestination: `${__dirname}/src/assets/styles/base/_fonts.scss`
    }),
    ViteWatchVideoFolderPlugin({
      relativePath: `${__dirname}/public/media/video`,
      outputVideoDirectory: `${__dirname}/public/media/converted`,
      outputVideoFormat: [".mp4"],
      posterDirectory: `${__dirname}/public/media/image/poster`
    })
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})