import { newSpecPage } from '@stencil/core/testing';
import { GeneticVariants } from './genetic-variants';

describe('genetic-variants', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GeneticVariants],
      html: `<genetic-variants></genetic-variants>`,
    });
    expect(page.root).toEqualHtml(`
      <genetic-variants>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </genetic-variants>
    `);
  });
});
