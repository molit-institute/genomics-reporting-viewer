# Genomics Reporting Viewer
Components for displaying FHIR genomic reports complying to the [FHIR Genomics Reporting Implementation Guide](http://hl7.org/fhir/uv/genomics-reporting/).

## Install

- Run `npm install @molit/genomics-reporting-viewer --save`

## Usage

### Angular, React, Vue

- Add the following to your 
    - Angular: `main.ts`
    - React: `index.js`
    - Vue: `main.js`

```js
import { applyPolyfills, defineCustomElements } from '@molit/genomics-reporting-viewer/loader';

applyPolyfills().then(() => { 
    // Surrounding defineCustomElemnts() with applyPolyfills() is only needed if older browsers are targeted
    defineCustomElements();
});
```
- <i> Only in Angular:</i> In your `app.module.ts` add the following 

```js
import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
```
- Then you can use the element anywhere in your template, JSX, html etc

### HTML/JavaScript

#### Script tag

- Add the script tag `<script src="https://unpkg.com/@molit/genomics-reporting-viewer/dist/genomics-reporting-viewer.js"></script>` to the head of your `index.html`
- Then you can use the element anywhere in your template, JSX, html etc

#### Node Modules
- Run `npm install @molit/genomics-reporting-viewer --save`
- Add the script tag`<script src="/node_modules/@molit/genomics-reporting-viewer/dist/genomics-reporting-viewer.js"></script>` to the head of your `index.html`
- Then you can use the element anywhere in your template, JSX, html etc

Need more information? Check out the [StencilJS Framework Integration Guide](https://stenciljs.com/docs/overview).

## Components

| Name                                                                                                                           | Description                                                                                                     | Example | Example Component |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------- | ----------------- |
| [genomics-report](https://github.com/molit-institute/genomics-reporting-viewer/tree/master/src/components/genomics-report)   | Displays the given FHIR genomic report. </br> Depends on [genetic-variants](https://github.com/molit-institute/genomics-reporting-viewer/tree/master/src/components/genetic-variants).   | `<genomics-report fhir-base-url="https://fhir.molit.eu/fhir" id-genomics-report="364" ></genomics-report>`  | [:link:](https://docs.molit.eu/genomics-reporting-viewer/) |
| [genetic-variants](https://github.com/molit-institute/genomics-reporting-viewer/tree/master/src/components/genetic-variants) | Displays the given genetic variant as a table. </br> Used by [genomics-report](https://github.com/molit-institute/genomics-reporting-viewer/tree/master/src/components/genomics-report). | `<genetic-variants  genetic-observations='[...]' type="snv" gv-title="SNVs"></genetic-variants> ` | [:link:](https://docs.molit.eu/genomics-reporting-viewer/genetic-variants-example) |

----------------------------------------------

<footer> <i>Built with love! by MOLIT Institut gGmbH ❤❤</i> </footer>
