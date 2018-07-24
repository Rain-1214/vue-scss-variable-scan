# vue-scss-variable-scan

This is a extension that allows vscode to prompt custom variables for SCSS in Vue and Scss files.

## Extension Settings

There four settings following:

* `vue-scss-variable-scan.globalPath`: the path of scan variables for SCSS.(default: src/**/*.scss)
* `vue-scss-variable-scan.globalExcludePath`: the exclude path of scan variables for SCSS.(default: "")
* `vue-scss-variable-scan.addCustomCssProperty`: this extension only support some property of css,if you want to support more property,you can add some property in this settings.(default: [])(PS: default support:["background", "border", "color", "width", "height", "font-size","padding","margin"])
*  `vue-scss-variable-scan.excludeCssProperty`: if your don't like some property in default support,you can add it in this array.(default: [])

## preview

![preview.gif](/assets/preview.gif)
