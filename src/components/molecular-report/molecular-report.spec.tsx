import { newSpecPage } from '@stencil/core/testing';
import { MolecularReport } from './molecular-report';

describe('molecular-report', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MolecularReport],
      html: `<molecular-report></molecular-report>`,
    });
    expect(page.root).toEqualHtml(`
      <molecular-report>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </molecular-report>
    `);
  });
});
