![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - React Template Boilerplate

This is a [React](https://reactjs.org/) boilerplate for building [HTML-based templates](https://developers.dsplay.tv/docs/html-templates) for [DSPLAY - Digital Signage](https://dsplay.tv/) platform.

You can use this project as a skeleton for creating a new HTML Template with React. If you prefer to use another JS library, check the [other boilerplates](https://developers.dsplay.tv/docs/html-templates/boilerplates/) available.

> This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Getting started

```
git clone https://github.com/dsplay/template-boilerplate-react.git my-awesome-template
cd my-awesome-template
rm -rf .git
npm i
npm start
```


## `dsplay-data.js`

In this boilerplate project, `dsplay-data.js` is located at `public` folder.

> During template development, `dsplay-data.js` will be just a mock with your test data. The DSPLAY Player App will automatically replace this file with real content at runtime.

### Using `dsplay-data.js` vars in template

The easiest way to access `dsplay-data.js` values in your project is by using the support library `@dsplay/template-utils` (already included in this boilerplate). 

Here is a small snippet showing how to get values inside a React component:

```jsx
import React from 'react';
import {
    // values
    config, // player configuration
    media, // current media
    template, // custom template values
    // utility functions
    tval, // custom template string value
    tbval, // custom template boolean value
    tival, // custom template int value
    tfval, // custom template float value
    isVertical, // boolean flag to indicate screen orientation

} from '@dsplay/template-utils';
import './App.css';

const { duration } = media;
const { orientation, locale } = config;

function App() {
    return (
        <div className="App">
            <h1>DSPLAY Template</h1>
            <h2>Raw Values</h2>
            <div>
                <p>Config:</p>
                <pre>{JSON.stringify(config, null, 4)}</pre>

                <p>Media:</p>
                <pre>{JSON.stringify(media, null, 4)}</pre>

                <p>Template:</p>
                <pre>{JSON.stringify(template, null, 4)}</pre>
            </div>
            <h2>Configuration Values Examples</h2>
            <div>
                <p>
                    Orientation:
                    <span class="val">{orientation}</span>
                </p>
                <p>
                    Locale:
                    <span class="val">{locale}</span>
                </p>
            </div>
            <h2>Media Values Examples</h2>
            <div>
                <p>
                    Duration:
                    <span class="val">{duration}</span>
                </p>
            </div>
            <h2>Custom Template Var Examples</h2>
            <div>
                <p>
                    String:
                    <span class="val">{tval('title', 'Default Value')}</span>
                </p>
                <p>
                    Boolean:
                    <span class="val">{tbval('expanded', true) ? 'Yes' : 'No'}</span>
                </p>
                <p>
                    Int:
                    <span class="val">{tival('page_size', 10)}</span>
                </p>
                <p>
                    Double:
                    <span class="val">{tfval('rate', .75)}</span>
                </p>
                <p>
                    Vertical?:
                    <span class="val">{isVertical ? 'Yes' : 'No'}</span>
                </p>
            </div>
        </div>
    );
}


export default App;
```

## Packing (release build)

To create a release build of the template, ready to be uploaded to DSPLAY, just run:

```
npm run zip
```

It will generate a `template.zip` file ready to be deployed to [DSPLAY Web Manager](https://manager.dsplay.tv/template/create)

## More

The see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates