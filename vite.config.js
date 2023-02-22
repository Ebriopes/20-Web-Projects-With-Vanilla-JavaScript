import { resolve } from "path";

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve( __dirname, 'index.html' ),
        form: resolve( __dirname, 'form/index.html' )
      }
    }
  }
};