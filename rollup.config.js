// const pkg = require('./package.json');
// const external = Object.keys(pkg.dependencies);

export default {
  entry: 'dist/es6/index.js',
  plugins: [
  ],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'umd',
      moduleName: 'rollupStarterProject',
      sourceMap: true
    },
    {
      dest: pkg['jsnext:main'],
      format: 'es',
      sourceMap: true
    }
  ]
};