import { newE2EPage } from '@stencil/core/testing';

describe('genetic-variants', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<genetic-variants></genetic-variants>');

    const element = await page.find('genetic-variants');
    expect(element).toHaveClass('hydrated');
  });
});
