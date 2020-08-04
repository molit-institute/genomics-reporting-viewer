import { newE2EPage } from '@stencil/core/testing';

describe('genomics-report', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<genomics-report fhir-base-url="https://fhir.molit.eu/fhir" id-genomics-report="364"></genomics-report>');

    const element = await page.find('genomics-report');
    expect(element).toHaveClass('hydrated');
  });
});
