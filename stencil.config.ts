import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'genomics-reporting-viewer',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
      footer: '*Built with love! by MOLIT Institut gGmbH ❤❤*',
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    },
  ],
  // testing: {
  //   transformIgnorePatterns: [
  //     "src/util/(?!(fhirpath.min.js))"
  //   ]
  // }
};
