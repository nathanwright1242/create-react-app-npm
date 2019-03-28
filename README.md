# create-react-app-npm

Create npm packages with create-react-app, this is based on the tutorial provided by Pavel Lokhmakov: https://medium.com/@lokhmakov/best-way-to-create-npm-packages-with-create-react-app-b24dd449c354. I have merely followed this tutorial and recorded my steps to be relevant for 2019.

# Here are the exact steps I followed:

1. ```npx create-react-app create-react-app-npm```
2. ```cd create-react-app-npm```
3. ```npm run eject``` or ```yarn run eject```
4. Install babel's command line interface as well as babel's plugin to transform jsx. This is necessary for running your custom "lib" command described
later in the tutorial to compile and transpile your custom components so they can be shared with others.
    - ```npm install --save-dev @babel/cli```
    - ```npm install --save-dev @babel/plugin-transform-react-jsx```

5. Don't add a .babelrc in your project root, ejecting from create-react-app will take care of your babel set-up
6. Add the "lib" command as an npm run command within your "scripts" section of the package.json. Note: this has changed since the writting of this tutorial. Babel 6 and up no longer have any native transforms for React, so you need to use the @babel/transform-react-jsx plugin for this transformation.
    - ```"lib": "babel --plugins @babel/transform-react-jsx src/node_modules --out-dir lib --copy-files",```
7. I skipped adding the CSS loader since CSS is properly handled by create-react-app as the time of this writing
8. Create the necessary folder structure for your module:
    - ```cd src```
    - ```mkdir -p node_modules/components/YourComponent```
9. Add a package.json, your custom styling, and actual component code for each custom component you create. For me I followed the tutorial and 
simply created a single component called YourComponent. Here is my relevant code more or less verbatim from the tutorial:

#### src/node_modules/components/YourComponent/package.json

```json
{
    "private": true,
    "name": "YourComponent",
    "main": "./YourComponent"
}
```
#### Note: I removed the .js extension from the "main" entry point for my custom component as this will cause [issues:](https://stackoverflow.com/questions/41292559/could-not-find-a-declaration-file-for-module-module-name-path-to-module-nam)

#### src/node_modules/components/YourComponent/YourComponent.css
```css
.root {
    background: linear-gradient(to top,#fed835 20px,#ffeb3c 20px);
    font-size: 30px;
    color: white;
    line-height: 35px;
    text-align: center;
}
```

#### src/node_modules/components/YourComponent/YourComponent.js
```javascript
import React from 'react'
import s from './YourComponent.css'
class YourComponent extends React.Component {
  render() {
    return (
      <div className={ s.root }>
        { this.props.children }
      </div>
    )
  }
}
export default YourComponent
```

10. create an index file within src/node_modules to export your custom components:
#### src/node_modules/index.js
```javascript
export { default as YourComponent } from './components/YourComponent'
```

11. Edit ```src/App.js``` as stated in the tutorial:
####src/App.js
```javascript
import React from 'react'
import YourComponent from 'components/YourComponent'
class App extends React.Component {
  render() {
    return (
      <YourComponent>
        1
      </YourComponent>
    )
  }
}
export default App
```

#### If you now try to run as the tutorial states: npm run start. Your application will error out due to babel not transpiling your custom component and it will complain about your jsx syntax:

```
Failed to compile.

./src/node_modules/components/YourComponent/YourComponent.js
SyntaxError: /Users/nathanwright/Desktop/create-react-app-npm/create-react-app-npm/src/node_modules/components/YourComponent/YourComponent.js: Unexpected token (6:6)

  4 |   render() {
  5 |     return (
> 6 |       <div className={ s.root }>
    |       ^
  7 |         { this.props.children }
  8 |       </div>
  9 |     )
```

12. Lets fix the above mention error, within your webpack.config.js lets add the react preset to your module rules:

#### config/webpack.config.js

Line 339 starts your webpack rule for dealing with React type files (jsx) for your application's code, but it's missing the necessary babel presets
to properly transpile your code: '@babel/preset-env' and '@babel/preset-react'. So lets add the proper presets, on line 337 add the following line:

```javascript
presets: ['@babel/preset-env', '@babel/preset-react'],
```

This is within the options object and before the plugins array, for reference: 
```javascript
 // Process application JS with Babel.
// The preset includes JSX, Flow, TypeScript, and some ESnext features.
{
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
    customize: require.resolve(
        'babel-preset-react-app/webpack-overrides'
    ),
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        [
        require.resolve('babel-plugin-named-asset-import'),
        {
            loaderMap: {
            svg: {
                ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
            },
            },
        },
        ],
    ],
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    cacheDirectory: true,
    cacheCompression: isEnvProduction,
    compact: isEnvProduction,
    },
},
```

#### If that didn't make sense just copy paste my webpack.config.js.

Ok now rerun your application with a ```npm run start``` You should see 1 on http://localhost:3000/ and your application should successfully compile.

You shouldn't need to add  the ```.gitignore``` file since create-react-app provided you with one, I'd just modify that one to your needs.

13. Compile your custom library components with your custom 'lib' command: ```npm run lib``` or ```yarn run lib```. See steps 4 and 6 if you
have issues with compiling your library as the tutorial is no longer relevant in this respect since the babel-cli and babel jsx transform plugin are 
now necessary. Additionally, you need to modify your custom 'lib' command. Copy my package.json file if this doesn't make sense and issue a ```npm i```
to ensure you have all the necessary libs.

14. The rest of the tutorial is just comitting your code to source control and publishing on npmjs and should work the same as stated. If not I can take a
look into it.


Author
------
I can be reach at the following if you need help:<br/>
[Nathan Wright](https://github.com/nathanwright1242/create-react-app-npm)
<br/>
Email: nathanwright1242@gmail.com
