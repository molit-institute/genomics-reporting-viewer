import { Component, ComponentInterface, Prop, h, Event, EventEmitter, Watch, State, Element, Listen } from '@stencil/core';
import { fetchResources, fetchResource, updateResource } from "@molit/fhir-api";
import { fhirpath } from "../../util/fhirpath/fhirpath.min.js";
import { getLocaleComponentStrings } from "../../util/locale";
import { keyboard_arrow_down, keyboard_arrow_right } from "../../util/svg-icons";


@Component({
  tag: 'genomics-report',
  styleUrl: 'genomics-report.css',
  shadow: false,
  scoped: true
})
export class GenomicsReport implements ComponentInterface {

  @Element() element: HTMLElement;

  @State() changedRelevant: boolean = false; //TODO find better way of triggering render upon change
  @State() localeString: any;

  /**
   * Base URL to fhir-resource
   */
  @Prop() fhirBaseUrl!: string;
  @Watch('fhirBaseUrl')
  validateFhirBaseUrl() {
    if (this.fhirBaseUrl == null) { throw new Error('fhir-base-url: required'); }
  }
  /**
   * ID of the to be requested resource
   */
  @Prop() idGenomicsReport!: string;
  @Watch('idGenomicsReport')
  validateIdGenomicsReport() {
    if (this.idGenomicsReport == null) { throw new Error('id-genomics-report: required'); }
  }
  /**
   * Id of the list of important variants
   */
  @Prop() idImportantVariantsList: string;
  /**
   * Authentication token that will be added to the Authorization Header within all request in the fhir-server. </br>
   * ```Authorization: Bearer <token>```
   */
  @Prop() token: string;
  /**
   * Defines colour of the background of *genetic-variants*-table
   */
  @Prop() tableBackground: string = "#ecf0f1";
  /**
   * Defines colour of the header background of *genetic-variants*-table
   */
  @Prop() tableHeaderBackground: string = "#ecf0f1";
  /**
     * Defines colour of the background of *genetic-variants*-table containing relevant variants
     */
  @Prop() tableRelevantBackground: string = "#8fd0e3"; //TODO add correct colour
  /**
   * Defines colour of the header background of *genetic-variants*-table containing relevant variants
   */
  @Prop() tableRelevantHeaderBackground: string = "#8fd0e3"; //TODO add correct colour
  /**
   * If `true`, the component will show Relevant Variants unfolded when first opened.
   */
  @Prop() enableRelevantVariants: boolean = false;
  /**
 * If `true`, the component will show All Variants unfolded when first opened.
 */
  @Prop() enableAllVariants: boolean = true;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en]
   */
  @Prop() locale: string = "en";
  @Watch('locale')
  async watchLocale(newValue: string) {
    this.localeString = await getLocaleComponentStrings(this.element, newValue);
  }
  /**
   * If `true`, the component will show meta informations as a table.
   */
  @Prop() metaAsTable: boolean = false;
  /**
   * If `true`, the table will include a column to show a link to open the Variant Browser.
   */
  @Prop() hideLinkVariantBrowser: boolean = false;

  bundle: any;
  params: any = this.getParams();
  diagnosticReport: any;
  presentedForms: any;
  importantVariants: any;
  svs: any[];
  snvs: any[];
  cnvs: any[];
  relevantSvs: any[];
  relevantSnvs: any[];
  relevantCnvs: any[];

  readonly FHIRPATH_CHROMOSOMAL_INSTABILITY: string = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://ncit.nci.nih.gov' and code.coding.code='C48195').valueBoolean`;
  readonly FHIRPATH_CNVS: string = `Bundle.entry.resource.where(resourceType='Observation')
    .where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')
    .where(component.code.coding.exists(system='http://loinc.org' and code='48019-4') and component.valueCodeableConcept.coding.exists(system='http://sequenceontology.org' and code='SO:0001019'))`;
  readonly FHIRPATH_DIAGNOSTIC_REPORT: string = "Bundle.entry.resource.where(resourceType='DiagnosticReport').single()";
  readonly FHIRPATH_GERMLINE_PATHOGENICITY: string = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://ncit.nci.nih.gov' and code.coding.code='C168797')
    .valueCodeableConcept.coding.where(system='http://terminology.hl7.org/CodeSystem/v2-0136').display`;
  readonly FHIRPATH_MSI: string = `Bundle.entry.resource.where(resourceType='Observation')
    .where(code.coding.system='http://loinc.org' and code.coding.code='81695-9')
    .valueCodeableConcept.coding.where(system='http://loinc.org').display`;
  readonly FHIRPATH_PATIENT: string = `Bundle.entry.resource.where(resourceType='Patient').single()`;
  readonly FHIRPATH_PERCENT_TUMOR_TISSUE: string = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://ncit.nci.nih.gov' and code.coding.code='C166246').valueQuantity.value`;
  readonly FHIRPATH_QUALITY_FLAGS: string = `Bundle.entry.resource.where(resourceType='Observation')
    .where(code.coding.system='http://molit.eu/fhir/vitu-tbd-codes' and code.coding.code='quality_flags')
    .valueCodeableConcept.coding.where(system='http://molit.eu/fhir/vitu-tbd-codes').display`;
  readonly FHIRPATH_RESULTS: string = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')`;
  readonly FHIRPATH_SNVS: string = `Bundle.entry.resource.where(resourceType='Observation')
    .where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')
    .where(component.code.coding.exists(system='http://loinc.org' and code='48019-4') and component.valueCodeableConcept.coding.exists(system='http://sequenceontology.org' and code='SO:0001483'))`;
  readonly FHIRPATH_SVS: string = `Bundle.entry.resource.where(resourceType='Observation')
    .where(code.coding.system='http://loinc.org' and code.coding.code='69548-6')
    .where(component.code.coding.exists(system='http://loinc.org' and code='48019-4') and component.valueCodeableConcept.coding.exists(system='http://sequenceontology.org' and code='SO:0001785'))`;
  readonly FHIRPATH_SPECIMEN: string = `Bundle.entry.resource.where(resourceType='Specimen').single()`;
  readonly FHIRPATH_TMB: string = `Bundle.entry.resource.where(resourceType='Observation').where(code.coding.system='http://loinc.org' and code.coding.code='94076-7')
    .interpretation.coding.where(system='http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation').display`;

  /* computed */
  getParams() {
    const params = new URLSearchParams();
    params.append("_id", this.idGenomicsReport);
    params.append("_include", "DiagnosticReport:result");
    params.append("_include", "DiagnosticReport:performer");
    params.append("_include", "DiagnosticReport:specimen");
    params.append("_include", "DiagnosticReport:subject");
    params.append("_count", '1');
    return params;
  };

  getDiagnosticReport() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_DIAGNOSTIC_REPORT)[0];
  };

  getPresentedForms() {
    if (!this.diagnosticReport || !this.diagnosticReport.presentedForm) {
      return [];
    } else {
      return this.diagnosticReport.presentedForm;
    }
  };

  chromosomalInstability() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_CHROMOSOMAL_INSTABILITY).join(",");
  };

  getCnvs() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_CNVS);
  };

  germlinePathogenicity() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_GERMLINE_PATHOGENICITY).join(",");
  };

  msi() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_MSI).join(",");
  };

  patient() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_PATIENT)[0];
  };

  percentTumorTissue() {
    return fhirpath
      .evaluate(this.bundle, this.FHIRPATH_PERCENT_TUMOR_TISSUE)
      .map(p => p.toFixed(2))
      .join(",");
  };

  qualityFlags() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_QUALITY_FLAGS).join(",");
  };

  results() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_RESULTS);
  };

  getSnvs() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_SNVS);
  };

  getSvs() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_SVS);
  };

  specimen() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_SPECIMEN)[0];
  };

  tmb() {
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_TMB).join(",");
  };

  /* methods */

  addRelevantToObservations(observations: any[]) {
    if (this.importantVariants == null) {
      return observations;
    }
    for (let i = 0; i < observations.length; i++) {
      const idString = "Observation/" + observations[i].id;
      if (this.importantVariants.entry == null) {
        this.importantVariants.entry = [];
      }
      if (this.importantVariants.entry.some(e => e.item.reference === idString)) {
        observations[i].relevant = true;
      } else {
        observations[i].relevant = false;
      }
    }
    return observations;
  }

  @Listen('changeRelevant')
  async handleChangeRelevant(event: CustomEvent) { // Update importantVariants on Server
    if (this.importantVariants == null) {
      return;
    }
    const idString = "Observation/" + event.detail.id;
    if (event.detail.relevant === true) { // Adds new entry to importantVariants.entry
      const entry = this.importantVariants.entry.find(e => e.item.reference === idString);
      if (entry == null) {
        this.importantVariants.entry.push({ "item": { "reference": idString } });
      }
    } else { // Removes entry from importantVariants.entry
      this.importantVariants.entry = this.importantVariants.entry.filter(e => e.item.reference != idString);
    }
    await updateResource(this.fhirBaseUrl, this.importantVariants, this.token);
    this.changedRelevant = !this.changedRelevant;
  }

  @Event() errorOccurred: EventEmitter;
  async fetchResources() {
    try {
      const response = await fetchResources(this.fhirBaseUrl, "DiagnosticReport", this.params, this.token);
      this.bundle = response.data;
      if (this.idImportantVariantsList != null && this.idImportantVariantsList != "") {
        const responseImportantVariants = await fetchResource(this.fhirBaseUrl, "List", this.idImportantVariantsList, {}, this.token);
        this.importantVariants = responseImportantVariants.data;
      }
    } catch (e) {
      console.error(e);
      this.errorOccurred.emit(e);
    }
  };

  filterRelevant(observations: any[]) {
    return observations.filter(o => o.relevant);
  }

  getDocumentUrl(url) {
    if (url.startsWith("http")) {
      return url;
    } else {
      return `${this.fhirBaseUrl}/${url}`;
    }
  }

  enableRelevantV() {
    this.enableRelevantVariants = !this.enableRelevantVariants;
  }

  enableAllV() {
    this.enableAllVariants = !this.enableAllVariants;
  }

  exportBundleJson() {
    if (this.bundle != null) {
      const exportArray = [];
      exportArray.push(this.bundle);
      if (this.importantVariants != null) {
        exportArray.push(this.importantVariants);
      }
      const linkSource = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportArray))}`;
      const downloadLink = document.createElement("a");
      const fileName = "bundle.json";
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }

  /* Lifecycle Methods */
  async componentWillLoad() {
    try {
      this.validateFhirBaseUrl();
      this.validateIdGenomicsReport();
      this.localeString = await getLocaleComponentStrings(this.element, this.locale);
    } catch (e) {
      console.error(e);
    }
    await this.fetchResources();
    this.diagnosticReport = this.getDiagnosticReport();
    this.presentedForms = this.getPresentedForms();
  }

  componentWillRender() {
    this.snvs = this.addRelevantToObservations(this.getSnvs());
    this.cnvs = this.addRelevantToObservations(this.getCnvs());
    this.svs = this.addRelevantToObservations(this.getSvs());
    this.relevantSnvs = this.filterRelevant(this.snvs);
    this.relevantCnvs = this.filterRelevant(this.cnvs);
    this.relevantSvs = this.filterRelevant(this.svs);
  }

  render() {
    if (this.diagnosticReport) {
      return ([
        <div>
          <h4>{this.localeString.report}</h4>
          {!this.metaAsTable ?
            <div>
              <h5>{this.localeString.meta}</h5>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.issued}</label>
                {this.diagnosticReport.issued ?
                  <label class="col-md-9 col-form-label">{new Date(this.diagnosticReport.issued).toLocaleString()}</label>
                  : null}
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.status}</label>
                <label class="col-md-9 col-form-label">{this.diagnosticReport.status}</label>
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.documents}</label>
                <label class="col-md-9 col-form-label">
                  {this.presentedForms.map((document, index) =>
                    <a key={this.getDocumentUrl(document.url)}>
                      {index + 1}
                    </a>
                  )}
                </label>
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.export}</label>
                <label class="col-md-9 col-form-label">
                  <a href="#" onClick={() => this.exportBundleJson()}>
                    .json
                  </a>
                </label>
              </div>
              <h5>{this.localeString.otherObservations}</h5>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.chromosomalInstability}</label>
                <label class="col-md-9 col-form-label">{this.chromosomalInstability()}</label>
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.germlinePathogenicity}</label>
                <label class="col-md-9 col-form-label">{this.germlinePathogenicity()}</label>
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.percentageTumorTissue}</label>
                <label class="col-md-9 col-form-label">{this.percentTumorTissue()}</label>
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.quality}</label>
                <label class="col-md-9 col-form-label">{this.qualityFlags()}</label>
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.msi}</label>
                <label class="col-md-9 col-form-label">{this.msi()}</label>
              </div>
              <div class="form-row">
                <label class="col-md-3 col-form-label">{this.localeString.tmb}</label>
                <label class="col-md-9 col-form-label">{this.tmb()}</label>
              </div>
            </div>
            :
            <div>
              <table class="table table-sm table-hover meta-table" v-else>
                <tbody>
                  <tr>
                    <th>{this.localeString.issued}</th>
                    <td>
                      <span v-if="diagnosticReport.issued">{new Date(this.diagnosticReport.issued).toLocaleString()}</span>
                    </td>
                  </tr>
                  <tr>
                    <th>{this.localeString.status}</th>
                    <td>{this.diagnosticReport.status}</td>
                  </tr>
                  <tr>
                    <th>{this.localeString.documents}</th>
                    <td>
                      {this.presentedForms.map((document, index) =>
                        <a key={this.getDocumentUrl(document.url)}>
                          {index + 1}
                        </a>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>{this.localeString.chromosomalInstability}</th>
                    <td>{this.chromosomalInstability()}</td>
                  </tr>
                  <tr>
                    <th>{this.localeString.germlinePathogenicity}</th>
                    <td>{this.germlinePathogenicity()}</td>
                  </tr>
                  <tr>
                    <th>{this.localeString.percentageTumorTissue}</th>
                    <td>{this.percentTumorTissue()}</td>
                  </tr>
                  <tr>
                    <th>{this.localeString.quality}</th>
                    <td>{this.qualityFlags()}</td>
                  </tr>
                  <tr>
                    <th>{this.localeString.msi}</th>
                    <td>{this.msi()}</td>
                  </tr>
                  <tr>
                    <th>{this.localeString.tmb}</th>
                    <td>{this.tmb()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
          <h4>
            {this.enableRelevantVariants ?
              <a innerHTML={keyboard_arrow_down + "" + this.localeString.relevantVariants} onClick={() => this.enableRelevantV()}></a>
              : <a innerHTML={keyboard_arrow_right + "" + this.localeString.relevantVariants} onClick={() => this.enableRelevantV()}></a>
            }
          </h4>
          {this.enableRelevantVariants ?
            <div>
              {this.relevantSnvs && this.relevantSnvs.length ?
                <genetic-variants geneticObservations={this.relevantSnvs} type="snv" gvTitle="SNVs" tableBackground={this.tableRelevantBackground} tableHeaderBackground={this.tableRelevantHeaderBackground} locale={this.locale} hideLinkVariantBrowser={this.hideLinkVariantBrowser} />
                : null
              }
              {this.relevantCnvs && this.relevantCnvs.length ?
                <genetic-variants geneticObservations={this.relevantCnvs} type="cnv" gvTitle="CNVs" tableBackground={this.tableRelevantBackground} tableHeaderBackground={this.tableRelevantHeaderBackground} locale={this.locale} hideLinkVariantBrowser={this.hideLinkVariantBrowser} />
                : null
              }
              {this.relevantSvs && this.relevantSvs.length ?
                <genetic-variants geneticObservations={this.relevantSvs} type="sv" gvTitle="SVs" tableBackground={this.tableRelevantBackground} tableHeaderBackground={this.tableRelevantHeaderBackground} locale={this.locale} hideLinkVariantBrowser={true} />
                : null
              }
            </div>
            : null}
          <h4>
            {this.enableAllVariants ?
              <a innerHTML={keyboard_arrow_down + "" + this.localeString.allVariants} onClick={() => this.enableAllV()}></a>
              : <a innerHTML={keyboard_arrow_right + "" + this.localeString.allVariants} onClick={() => this.enableAllV()}></a>
            }
          </h4>
          {this.enableAllVariants ?
            <div>
              {this.snvs && this.snvs.length ?
                <genetic-variants geneticObservations={this.snvs} type="snv" gvTitle="SNVs" tableBackground={this.tableBackground} tableHeaderBackground={this.tableHeaderBackground} locale={this.locale} hideLinkVariantBrowser={this.hideLinkVariantBrowser} />
                : null
              }
              {this.cnvs && this.cnvs.length ?
                <genetic-variants geneticObservations={this.cnvs} type="cnv" gvTitle="CNVs" tableBackground={this.tableBackground} tableHeaderBackground={this.tableHeaderBackground} locale={this.locale} hideLinkVariantBrowser={this.hideLinkVariantBrowser} />
                : null
              }
              {this.svs && this.svs.length ?
                <genetic-variants geneticObservations={this.svs} type="sv" gvTitle="SVs" tableBackground={this.tableBackground} tableHeaderBackground={this.tableHeaderBackground} locale={this.locale} hideLinkVariantBrowser={true} />
                : null
              }
            </div>
            : null}
        </div>
      ]);
    }
  }
}
