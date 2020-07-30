This bootstraps a react application with typescript and tailwind css (or SCSS). Includes webpack configs, with support for templating the entry index.html file, copying over static and asset files and other basics. Sensible defaults for dev/prod development. Prepopulated .gitignore file.

## To use:

-   Remove anything you're sure you don't need from `package.json`
-   Update metadata in `package.json` and `src/template.html` (description, title, etc)
-   Change the name of the output bundle you want webpack to generate, from "main" to whatever in `webpack.common.js`
-   Run `npm install` (or `yarn` equivalent)
-   Run `npm run watch` to build for dev, and run in watch mode to watch for file changes (will watch for changes to static files too and copy those over). Output dir is `dist-dev` by default, can change in `webpack.dev.js`

## CSS

If you want to swap Tailwind for something else (like SASS):

-   Remove from `package.json`
-   Remove tailwind directives in `App.css`
-   Remove placeholder tailwind CSS class names in `App.tsx`

## Production:

-   Run `npm run build`. Output dir is `dist-prod` by default, can change in `webpack.prod.js`

## If you need to add another react target:

-   edit webpack.common.js: add entry point, and add HtmlWebpackPlugin entry for that entry point
