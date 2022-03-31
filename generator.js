const fs = require('fs');
const tool = (api) => {
  return {
    deleteFile(path) {
      const file = api.resolve(path);
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    },
    deleteDir(path) {
      const dir = api.resolve(path);
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((o) => {
          const file = dir + '\\' + o;
          if (fs.statSync(file).isDirectory()) {
            fs.readdirSync(dir).forEach((p) => {
              fs.unlinkSync(dir + '\\' + o + '\\' + p);
            });
          } else {
            fs.unlinkSync(file);
          }
        });
        fs.rmdirSync(dir);
      }
    }
  };
};
module.exports = (api, options, rootOptions) => {
  const utils = tool(api);
  // 命令
  api.extendPackage({
    scripts: {
      "serve": "vue-cli-service serve",
      "build": "vue-cli-service build",
      "lint": "vue-cli-service lint"
    },
  });

  // 安装一些基础公共库
  api.extendPackage({
    "name": "mf_template",
    "version": "0.1.0",
    "private": true,
    "scripts": {
      "serve": "vite",
      "dev": "vue-cli-service serve",
      "build": "vue-cli-service build",
      "test:unit": "vue-cli-service test:unit",
      "lint": "vue-cli-service lint"
    },
    "dependencies": {
      "axios": "^0.26.1",
      "core-js": "^3.8.3",
      "dayjs": "^1.11.0",
      "element-plus": "^2.1.7",
      "html2canvas": "^1.4.1",
      "qrcode": "^1.5.0",
      "reset.scss": "^1.0.0",
      "vue": "^3.2.13",
      "vue-i18n": "^9.2.0-beta.33",
      "vue-router": "^4.0.3",
      "vuex": "^4.0.0"
    },
    "devDependencies": {
      "@babel/core": "^7.12.16",
      "@babel/eslint-parser": "^7.12.16",
      "@intlify/vite-plugin-vue-i18n": "^3.3.1",
      "@vitejs/plugin-vue": "^2.2.4",
      "@vue/cli-plugin-babel": "~5.0.0",
      "@vue/cli-plugin-eslint": "~5.0.0",
      "@vue/cli-plugin-router": "~5.0.0",
      "@vue/cli-plugin-unit-jest": "~5.0.0",
      "@vue/cli-plugin-vuex": "~5.0.0",
      "@vue/cli-service": "~5.0.0",
      "@vue/eslint-config-standard": "^6.1.0",
      "@vue/test-utils": "^2.0.0-0",
      "@vue/vue3-jest": "^27.0.0-alpha.1",
      "babel-jest": "^27.0.6",
      "eslint": "^7.32.0",
      "eslint-plugin-import": "^2.25.3",
      "eslint-plugin-node": "^11.1.0",
      "eslint-plugin-promise": "^5.1.0",
      "eslint-plugin-vue": "^8.0.3",
      "jest": "^27.0.5",
      "sass": "^1.32.7",
      "sass-loader": "^12.0.0",
      "unplugin-auto-import": "0.5.3",
      "vite": "2.6.14",
      "vite-plugin-compression": "0.3.6",
      "vite-plugin-svg-icons": "1.0.5",
      "vite-plugin-vue-setup-extend": "0.1.0"
    },
    "eslintConfig": {
      "root": true,
      "env": {
        "node": true
      },
      "extends": [
        "plugin:vue/vue3-essential",
        "@vue/standard"
      ],
      "parserOptions": {
        "parser": "@babel/eslint-parser"
      },
      "rules": {},
      "overrides": [
        {
          "files": [
            "**/__tests__/*.{j,t}s?(x)",
            "**/tests/unit/**/*.spec.{j,t}s?(x)"
          ],
          "env": {
            "jest": true
          }
        }
      ]
    },
    "browserslist": [
      "> 1%",
      "last 2 versions",
      "not dead",
      "not ie 11"
    ],
    "jest": {
      "preset": "@vue/cli-plugin-unit-jest"
    }
  });
  api.render('./template');
};
