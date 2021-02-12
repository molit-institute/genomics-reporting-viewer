import { newSpecPage } from '@stencil/core/testing';
import { GeneticVariants } from './genetic-variants';

describe('genomics-report', () => {
  it("is true", () => {
    expect(true)
  })
});

// describe('genetic-variants', () => {
  // it('renders', async () => {
  //   const page = await newSpecPage({
  //     components: [GeneticVariants],
  //     html: `<genetic-variants></genetic-variants>`,
  //   });
  //   expect(page.root).toEqualHtml(`
  //     <genetic-variants>
  //        <div>
  //          <div class="genetic-header">
  //            <h5>
  //              Variants
  //            </h5>
  //            <button class="btn btn-link" type="button">
  //              Column selection ▾
  //            </button>
  //          </div>
  //          <div class="dropdown-wrapper"></div>
  //          <table class="table table-sm">
  //            <thead>
  //              <tr>
  //                <th>
  //                  Id
  //                </th>
  //                <th>
  //                  Gene
  //                </th>
  //                <th>
  //                  Chromosome
  //                </th>
  //                <th>
  //                  Genomic source class
  //                </th>
  //                <th>
  //                  DNA change type
  //                </th>
  //                <th>
  //                  c.HGVS
  //                </th>
  //                <th>
  //                  p.HGVS
  //                </th>
  //                <th>
  //                  Transcript ID
  //                </th>
  //                <th>
  //                  Sample Allelic Frequency
  //                </th>
  //                <th>
  //                  Clinical significance
  //                </th>
  //              </tr>
  //            </thead>
  //            <tbody></tbody>
  //          </table>
  //        </div>
  //     </genetic-variants>
  //   `);
  // });
// });
