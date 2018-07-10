# TestMaterialReactiveForms

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Setup SCSS

create new project with scss

``` npm
ng new my-sassy-app --style=scss
```

organize sass follow [7-1 Pattern](https://sass-guidelin.es/#the-7-1-pattern)

``` json
|- src/
    |- sass/
        |- _variables.scss
        |- _mixins.scss
        |- styles.scss
```

re-locate main style sheet to sass directory

``` json
{
  ...
  projects: {
    [your_project_name]: {
      ...
      architect: {
        build: {
          ...
          options: {
            styles:{
              "src/sass/styles.scss"
            }
          }
        }
      }
    }
  }
}
```

import the `_variables.scss` and `_mixins.scss` into the main `styles.scss`

``` sass
// src/sass/styles.scss
@import './variables';
@import './mixins';
```

importing sass files into Angular Components. CLI default root directory with `~`

``` sass
// src/app/app.component.scss
@import '~src/sass/variables';
```

## Setup Angular Material


### By add Angular Material Schematic

``` npm
ng add @angular/material@6.2.1
```

Note that @angular/material@6.3.0 broken

### By install Angular Material manually

install angular material components

``` npm
npm install --save @angular/material @angular/cdk @angular/animations
```

import angular material theme

``` sass
// scr/sass/style.scss
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
```

and then import Roboto font in `app.component.html`

``` html
// app.component.html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
```

## Localization DatePicker

``` npm
npm install --save moment
npm install --save @angular/material-moment-adapter
```

## Set host

ng serve --host=0.0.0.0

or

in the .angular-cli.json file
"defaults": { "serve": { "host": "0.0.0.0", "port": 4201 },
