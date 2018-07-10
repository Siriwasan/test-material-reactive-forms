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
