const bundles = require('tslib-cli')
const isDev = !!process.env.ROLLUP_WATCH

let config = [
  {
    input: 'src/supertag.ts',
    output: { file: 'dist/supertag.mjs', format: 'es' },
    tsconfigOverride: { exclude: ['node_modules', 'dist', 'public'] },
    minify: true
  },
  {
    input: 'src/supertag.ts',
    output: { file: 'dist/supertag.js', format: 'umd', name: 'supertag' },
    tsconfigOverride: { exclude: ['node_modules', 'dist', 'public'] },
    minify: true
  }
]

// demo code on `npm start`
if (!!process.env.ROLLUP_WATCH) {
  config = [
    { input: 'public/index.tsx', output: { file: 'dist/index.js', format: 'umd', name: 'example' }, devServer: true }
  ]
}

export default bundles(config)
