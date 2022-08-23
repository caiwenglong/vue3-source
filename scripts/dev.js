// minimist 是用来解析命令行参数的
const args = require('minimist')(process.argv.slice(2))
const { resolve } = require('path') // node 中的内置模块 用来解析路径
const { build } = require('esbuild');

console.log(args);
// 使用npm run dev 命令行执行后得到：{ _: [ 'reactivity' ], f: 'global' } 

const target = args._[0] || 'reactivity' // 要打包的模块
const format = args.f || 'global' // 打包的格式

const pkg = require(resolve(__dirname, `../packages/${target}/package.json`))

const outputFormat = format.startsWith('global') ? 'iife' : (format === 'cjs' ? 'cjs' : 'esm')
const outfile = resolve(__dirname, `../packages/${target}/dist/${target}.${format}.js`)

build({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: {
        onRebuild(error) {
            if(!error) console.log('rebuild~~~');
        }
    }
}).then(() => {
    console.log('watching~~~');
    
})