import { Component, ComponentInterface, Prop, h, Event, EventEmitter, Watch, State, Element } from '@stencil/core';
import { fetchResources } from "@molit/fhir-api"; 
import {fhirpath} from "../../util/fhirpath/fhirpath.min.js";
import { getLocaleComponentStrings } from "../../util/locale";


@Component({
  tag: 'genomics-report',
  styleUrl: 'genomics-report.css',
  shadow: false,
  scoped: true
})
export class GenomicsReport implements ComponentInterface {

  @Element() element: HTMLElement;

  @State() localeString: any;
  
  /**
   * Base URL to fhir-resource 
   */
  @Prop() fhirBaseUrl!: string;
  @Watch('fhirBaseUrl')
  validateFhirBaseUrl() {
    if (this.fhirBaseUrl == null){ throw new Error('fhir-base-url: required'); }
  }
  /**
   * ID of the to be requested resource
   */
  @Prop() idGenomicsReport!: string;
  @Watch('idGenomicsReport')
  validateIdGenomicsReport() {
    if (this.idGenomicsReport == null){ throw new Error('id-molecular-report: required'); } 
  } 
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
   * TODO Funtionalty to be added
   */
  @Prop() tableRelevantBackground: string = "#ecf0f1";
  /**
   * TODO Funtionalty to be added
   */
  @Prop() tableRelevantHeaderBackground: string = "#ecf0f1";
  /**
   * TODO Funtionalty to be added
   */
  @Prop() enableRelevantVariants: boolean = false;
  /**
   * Language property of the component. </br>
   * Currently suported: [de, en]
   */
  @Prop() locale: string = "en";
  @Watch('locale')
  async watchLocale(newValue: string){
    console.log(newValue)
    this.localeString = await getLocaleComponentStrings(this.element, newValue);
  }
  /**
   * If `true`, the component will show meta informations as a table. 
   */
  @Prop() metaAsTable: boolean = false;
  
  bundle: any; 
  params: any = this.getParams(); 
  diagnosticReport: any;
  presentedForms: any;
  svs: any[];
  snvs: any[];
  cnvs: any[];

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
    params.append("_count", '1'); //TODO Check if correct... (1 wasn't in '' originaly. Error: Argument of type '1' is not assignable to parameter of type 'string')
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
    return fhirpath.evaluate(this.bundle, this.FHIRPATH_CHROMOSOMAL_INSTABILITY)[0];
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
  @Event() errorOccurred: EventEmitter;
  async fetchResources() {
    try {
      const response = await fetchResources(this.fhirBaseUrl, "DiagnosticReport", this.params, this.token);
      this.bundle = response.data;    
    } catch (e) {
      console.error(e);
      this.errorOccurred.emit(e);
    }
  };

  getDocumentUrl(url) {
    if (url.startsWith("http")) {
      return url;
    } else {
      return `${this.fhirBaseUrl}/${url}`;
    }
  };
  
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
  };    
  componentWillRender(){
    this.cnvs = this.getCnvs();
    this.snvs = this.getSnvs();
    this.svs = this.getSvs();
    }
  
  render() {
    if(this.diagnosticReport){ 
    return ([
      <div> 
        <h4>{this.localeString.report}</h4>
        {!this.metaAsTable ? 
          <div>
            <h5>{this.localeString.meta}</h5>
            <div class="form-row">
              <label class="col-md-3 col-form-label">{this.localeString.issued}</label>
              {this.diagnosticReport.issued ?
                <label class="col-md-9 col-form-label">{ new Date(this.diagnosticReport.issued).toLocaleString() }</label>
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
                    { index + 1 }
                  </a>
                )}
              </label> 
            </div>
            <h5>{this.localeString.otherObservations}</h5>
            <div class="form-row">
              <label class="col-md-3 col-form-label">{this.localeString.chromosomalInstability}</label>
              <label class="col-md-9 col-form-label">{this.chromosomalInstability().toString() }</label>  
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
              <label class="col-md-9 col-form-label">{this.qualityFlags() }</label>
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
                    <span v-if="diagnosticReport.issued">{ new Date(this.diagnosticReport.issued).toLocaleString() }</span>
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
                        { index + 1 }
                      </a>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>{this.localeString.chromosomalInstability}</th>
                  <td>{this.chromosomalInstability().toString() }</td>
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
                  <td>{this.qualityFlags() }</td>
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
        
        <div>
          <h4>{this.localeString.allVariants}</h4>
          { this.snvs && this.snvs.length ? 
            <genetic-variants geneticObservations={this.snvs} type="snv" gvTitle="SNVs" tableBackground={this.tableBackground} tableHeaderBackground={this.tableHeaderBackground} locale={this.locale}/>
          : null
          }
          {this.cnvs && this.cnvs.length ?
            <genetic-variants geneticObservations={this.cnvs} type="cnv" gvTitle="CNVs" tableBackground={this.tableBackground} tableHeaderBackground={this.tableHeaderBackground} locale={this.locale}/>
          : null
          }
          {this.svs && this.svs.length ? 
            <genetic-variants geneticObservations={this.svs} type="sv" gvTitle="SVs" tableBackground={this.tableBackground} tableHeaderBackground={this.tableHeaderBackground} locale={this.locale}/>
          : null
          }
        </div>
        
      </div>
     ]);
  }}
}
