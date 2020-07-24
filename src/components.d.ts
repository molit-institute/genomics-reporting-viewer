/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface GeneticVariants {
        /**
          * The following components are included by default: <ul>   <li>Gene</li>   <li>Chromosome</li>   <li>Copy Number</li>   <li>Reference</li>   <li>Genomic source class</li>   <li>DNA change type</li>   <li>c.HGVS</li>   <li>p.HGVS</li>   <li>Transcript ID</li>   <li>Sample Allelic Frequency</li>   <li>Allelic read depth</li>   <li>Associated phenotype</li>   <li>Clinical significance</li>   <li>exact-start-end</li>   <li>Ref allele</li>   <li>Alt allele</li>   <li>Left breakpoint position</li>   <li>Right breakpoint position</li>   <li>CNV Size</li>   <li>Exons</li> </ul>  **Example Struktur of a component:** </br> ``` {   system: "http://loinc.org",   code: "62374-4",   display: "Reference",   expression: null,   visible: false,   valueType: "CodeableConcept",   variantTypes: ["snv", "cnv", "sv"]   }   ```   </br> Needs to be an array of JSON objects
         */
        "components": any;
        /**
          * Genetic Observations to be displayed. </br> Needs to be an array of JSON objects
         */
        "geneticObservations": any;
        /**
          * Title of the variant table
         */
        "gvTitle": string;
        /**
          * If `true`, the table will include a column to show the ID.
         */
        "hideId": boolean;
        /**
          * If `true`, the component will show a button to select column options.
         */
        "showColumnHideOptions": boolean;
        /**
          * Defines colour of the table background
         */
        "tableBackground": string;
        /**
          * Defines colour of the table-header background
         */
        "tableHeaderBackground": string;
        /**
          * Can be one of the following: "snv", "cnv", "sv"
         */
        "type": string;
    }
    interface MolecularReport {
        /**
          * TODO Funtionalty to be added
         */
        "enableRelevantVariants": boolean;
        /**
          * Base URL to fhir-resource
         */
        "fhirBaseUrl": string;
        /**
          * ID of the to be requested resource
         */
        "idMolecularReport": string;
        /**
          * Defines colour of the background of *genetic-variants*-table
         */
        "tableBackground": string;
        /**
          * Defines colour of the header background of *genetic-variants*-table
         */
        "tableHeaderBackground": string;
        /**
          * TODO Funtionalty to be added
         */
        "tableRelevantBackground": string;
        /**
          * TODO Funtionalty to be added
         */
        "tableRelevantHeaderBackground": string;
        /**
          * Authentication token that will be added to the Authorization Header within all request in the fhir-server. </br> ```Authorization: Bearer <token>```
         */
        "token": string;
    }
}
declare global {
    interface HTMLGeneticVariantsElement extends Components.GeneticVariants, HTMLStencilElement {
    }
    var HTMLGeneticVariantsElement: {
        prototype: HTMLGeneticVariantsElement;
        new (): HTMLGeneticVariantsElement;
    };
    interface HTMLMolecularReportElement extends Components.MolecularReport, HTMLStencilElement {
    }
    var HTMLMolecularReportElement: {
        prototype: HTMLMolecularReportElement;
        new (): HTMLMolecularReportElement;
    };
    interface HTMLElementTagNameMap {
        "genetic-variants": HTMLGeneticVariantsElement;
        "molecular-report": HTMLMolecularReportElement;
    }
}
declare namespace LocalJSX {
    interface GeneticVariants {
        /**
          * The following components are included by default: <ul>   <li>Gene</li>   <li>Chromosome</li>   <li>Copy Number</li>   <li>Reference</li>   <li>Genomic source class</li>   <li>DNA change type</li>   <li>c.HGVS</li>   <li>p.HGVS</li>   <li>Transcript ID</li>   <li>Sample Allelic Frequency</li>   <li>Allelic read depth</li>   <li>Associated phenotype</li>   <li>Clinical significance</li>   <li>exact-start-end</li>   <li>Ref allele</li>   <li>Alt allele</li>   <li>Left breakpoint position</li>   <li>Right breakpoint position</li>   <li>CNV Size</li>   <li>Exons</li> </ul>  **Example Struktur of a component:** </br> ``` {   system: "http://loinc.org",   code: "62374-4",   display: "Reference",   expression: null,   visible: false,   valueType: "CodeableConcept",   variantTypes: ["snv", "cnv", "sv"]   }   ```   </br> Needs to be an array of JSON objects
         */
        "components"?: any;
        /**
          * Genetic Observations to be displayed. </br> Needs to be an array of JSON objects
         */
        "geneticObservations"?: any;
        /**
          * Title of the variant table
         */
        "gvTitle"?: string;
        /**
          * If `true`, the table will include a column to show the ID.
         */
        "hideId"?: boolean;
        /**
          * If `true`, the component will show a button to select column options.
         */
        "showColumnHideOptions"?: boolean;
        /**
          * Defines colour of the table background
         */
        "tableBackground"?: string;
        /**
          * Defines colour of the table-header background
         */
        "tableHeaderBackground"?: string;
        /**
          * Can be one of the following: "snv", "cnv", "sv"
         */
        "type"?: string;
    }
    interface MolecularReport {
        /**
          * TODO Funtionalty to be added
         */
        "enableRelevantVariants"?: boolean;
        /**
          * Base URL to fhir-resource
         */
        "fhirBaseUrl": string;
        /**
          * ID of the to be requested resource
         */
        "idMolecularReport": string;
        "onErrorOccurred"?: (event: CustomEvent<any>) => void;
        /**
          * Defines colour of the background of *genetic-variants*-table
         */
        "tableBackground"?: string;
        /**
          * Defines colour of the header background of *genetic-variants*-table
         */
        "tableHeaderBackground"?: string;
        /**
          * TODO Funtionalty to be added
         */
        "tableRelevantBackground"?: string;
        /**
          * TODO Funtionalty to be added
         */
        "tableRelevantHeaderBackground"?: string;
        /**
          * Authentication token that will be added to the Authorization Header within all request in the fhir-server. </br> ```Authorization: Bearer <token>```
         */
        "token"?: string;
    }
    interface IntrinsicElements {
        "genetic-variants": GeneticVariants;
        "molecular-report": MolecularReport;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "genetic-variants": LocalJSX.GeneticVariants & JSXBase.HTMLAttributes<HTMLGeneticVariantsElement>;
            "molecular-report": LocalJSX.MolecularReport & JSXBase.HTMLAttributes<HTMLMolecularReportElement>;
        }
    }
}
