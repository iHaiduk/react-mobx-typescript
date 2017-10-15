# React-Mobx-TypeScript
### Versions starter
* Single page
* Server side (Isomorphic Render)

---------

## Getting Started Single
Requirement:
- NodeJS 8+
- Yarn 1.2.0+

```
$ yarn install
$ yarn run dev-server-without-backend
```

#### Watching assets
```
$ yarn install
$ yarn run assets-watch
```

Visit [http://localhost:3000/](http://localhost:3000/).

## Getting Started with Server Side
Requirement:
- NodeJS 8+
- Yarn 1.2.0+

```
$ yarn install
$ yarn run backend-watch
```

```
$ yarn run run-backend
```

```
$ yarn run dev-server
```

Visit [http://localhost:3000/](http://localhost:3000/).
Visit only backend side render [http://localhost:1337/](http://localhost:1337/)

### Built using
#### For styles
- [Webpack](https://webpack.github.io) v3.7.1
- [SCSS](http://sass-lang.com) + [sass-loader](https://github.com/webpack-contrib/sass-loader) v6.0.6
- [autoprefixer](https://github.com/postcss/autoprefixer) v7.1.5
- [cssnano](http://cssnano.co) v3.10.0 (only for production environment)

#### For frontend side
- [TypeScript](https://www.typescriptlang.org) v2.5.3 + [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) v3.2.3
- [React](https://facebook.github.io/react/) v16.0.0
- [mobx](https://mobx.js.org) v3.3.1 + [mobx-react](https://github.com/mobxjs/mobx-react) v4.3.3
- [Webpack](https://webpack.github.io) v3.7.1

###### Other libraries for frontend
- [react-router](https://github.com/ReactTraining/react-router) v4.2.0
- [mobx-react-router](https://github.com/alisd23/mobx-react-router) v4.0.1
- [axios](https://github.com/axios/axios) v0.16.2
- [history](https://github.com/ReactTraining/history) v4.7.2
- [picturefill](https://github.com/scottjehl/picturefill) v3.0.2

#### For backend side
- [TypeScript](https://www.typescriptlang.org) v2.5.3 + [awesome-typescript-loader](https://github.com/s-panferov/awesome-typescript-loader) v3.2.3
- [React](https://facebook.github.io/react/) v16.0.0
- [Koa](http://koajs.com) v2.3.0
- [koa-router](https://github.com/alexmingoia/koa-router) v7.2.1
- [koa-body](https://github.com/dlau/koa-body) v2.5.0
- [pino](https://github.com/pinojs/pino) v4.7.2
- [cookie](https://www.npmjs.com/package/cookie) v0.3.1

###### For SVG
- [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader) v0.0.7
- [gulp-svgo](https://github.com/corneliusio/gulp-svgo) v1.2.5

###### Babel
- [babel-core](https://github.com/babel/babel/tree/master/packages/babel-core) v6.26.0
- [babel-plugin-closure-elimination](https://github.com/codemix/babel-plugin-closure-elimination) v1.3.0
- [babel-plugin-implicit-return](https://github.com/miraks/babel-plugin-implicit-return) v1.0.1
- [babel-plugin-loop-optimizer](https://github.com/vihanb/babel-plugin-loop-optimizer) v1.4.1
- [babel-plugin-meaningful-logs](https://github.com/furstenheim/babel-plugin-meaningful-logs) v1.0.2
- [babel-plugin-transform-async-to-generator](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-async-to-generator) v6.24.1
- [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) v1.3.4
- [babel-plugin-transform-react-constant-elements](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-constant-elements) v6.23.0
- [babel-plugin-transform-react-inline-elements](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-inline-elements) v6.22.0
- [babel-plugin-transform-react-remove-prop-types](https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types) v0.4.10
- [babel-plugin-transform-react-router-optimize](https://github.com/nerdlabs/babel-plugin-transform-react-router-optimize) v1.0.2
- [babel-plugin-transform-runtime](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-runtime) v6.23.0
- [babel-polyfill](https://github.com/babel/babel/tree/master/packages/babel-polyfill) v6.26.0
- [babel-preset-env](https://github.com/babel/babel-preset-env) v1.6.0
- [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015) v6.24.1
- [babel-preset-node8](https://github.com/lestad/babel-preset-node8) v1.2.0
- [babel-react-optimize](https://github.com/thejameskyle/babel-react-optimize) v1.0.1
- [babel-preset-stage-0](https://github.com/babel/babel/tree/master/packages/babel-preset-stage-0) v6.24.1
