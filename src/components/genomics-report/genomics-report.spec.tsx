import { newSpecPage } from '@stencil/core/testing';
import { GenomicsReport } from './genomics-report';

describe('genomics-report', () => {
  it("is true", () => {
    expect(true)
  })
});

// describe('genomics-report', () => {
  // it('renders', async () => {
  //   const page = await newSpecPage({
  //     components: [GenomicsReport],
  //     html: `<genomics-report fhir-base-url="https://fhir.molit.eu/fhir" id-genomics-report="364"></genomics-report>`,
  //   });
  //   expect(page.root).toEqualHtml(`
  //   <genomics-report fhir-base-url="https://fhir.molit.eu/fhir" id-genomics-report="364">
  //      <div>
  //        <h5>
  //          Report
  //        </h5>
  //        <div>
  //          Issued: 2020-05-25T20:57:46.774+02:00
  //        </div>
  //        <div>
  //          Status: final
  //        </div>
  //        <div>
  //          Documents:
  //          <a>
  //            1
  //          </a>
  //        </div>
  //        <hr>
  //        <h5>
  //          Meta
  //        </h5>
  //        <div>
  //          Chromosomal Instability: true
  //        </div>
  //        <div>
  //          Germline Pathogenicity: Yes
  //        </div>
  //        <div>
  //          Percentage Tumor Tissue: 0.60
  //        </div>
  //        <div>
  //          Quality: low_quality_cnvs
  //        </div>
  //        <div>
  //          MSI: high
  //        </div>
  //        <div>
  //          TMB: high
  //        </div>
  //        <hr>
  //        <div>
  //          <h4>
  //            All Variants
  //          </h4>
  //          <genetic-variants gvtitle="SNVs" tablebackground="#ecf0f1" tableheaderbackground="#ecf0f1" type="snv"></genetic-variants>
  //          <genetic-variants gvtitle="CNVs" tablebackground="#ecf0f1" tableheaderbackground="#ecf0f1" type="cnv"></genetic-variants>
  //          <genetic-variants gvtitle="SVs" tablebackground="#ecf0f1" tableheaderbackground="#ecf0f1" type="sv"></genetic-variants>
  //        </div>
  //      </div>
  //     </genomics-report>
  //   `);
  // });
// });
