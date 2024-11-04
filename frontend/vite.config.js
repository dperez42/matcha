import { defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

//const path = require('path')
// https://vitejs.dev/config/

export default defineConfig(({mode}) => {
  Object.assign(process.env,loadEnv(mode, process.cwd()));
  //const PORT = `${env.VITE_PORT ?? '8010'}`;
  //const SERVER_API = env.VITE_APP_SERVER_API ;
  //console.log(process.env.VITE_APP_SERVER_API)
return {
  server: {    // <-- this object is added
    port: parseInt(process.env.VITE_APP_PORT),
  },
  plugins: [
    vue(),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
        autoImport: true,
    }),
  ],
  define: { 
    //'process.env': {},
  },
  resolve: {
    alias: {
      //'@': path.resolve(__dirname, 'src'),
    },
  },
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
}
});
