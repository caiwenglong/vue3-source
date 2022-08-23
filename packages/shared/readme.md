```json
{
  "name": "@vue/shared",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  // 自定义属性
  "buildOptions": { 
    // 公共的模块不需要单独打包,所以不需要name，也不需要打包成global格式
    // 打包后的名
    // "name": "VueShared",
    // 打包的格式
    "formats": [
      // 在浏览器中使用 也就是通过<script src = "">的形式来引用的
      // "global",
      // node中使用
      "cjs",
      // 可以在webpack ES6环境下使用
      "esm-bundler"
    ]
  }
}

```