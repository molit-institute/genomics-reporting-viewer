import { newE2EPage } from '@stencil/core/testing';

describe('molecular-report', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<molecular-report></molecular-report>');

    const element = await page.find('molecular-report');
    expect(element).toHaveClass('hydrated');
  });
});
