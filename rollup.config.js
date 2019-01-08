import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

export default [
  {
    input: 'src/supertag.ts',
    output: { file: 'dist/supertag.mjs', format: 'es' },
    // external: ['superfine'],
    plugins: [typescript({ tsconfigOverride: { compilerOptions: { target: 'es2018' } } }), resolve()]
  },
  {
    input: 'src/supertag.ts',
    output: { file: 'dist/supertag.js', format: 'umd', name: 'supertag' },
    plugins: [typescript(), resolve(), terser(), filesize({ showBrotliSize: true })]
  }
]
