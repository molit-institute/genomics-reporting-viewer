import { Component, ComponentInterface, h, Prop, State, Watch, Element } from '@stencil/core';
import {fhirpath} from "../../util/fhirpath/fhirpath.min.js";
import uniqueId from "lodash";
import { getLocaleComponentStrings } from "../../util/locale";

@Component({
  tag: 'genetic-variants',
  styleUrl: 'genetic-variants.css',
  shadow: false,
  scoped: true
})
export class GeneticVariants implements ComponentInterface {

  @Element() element: HTMLElement;

  @State() localeString: any;
  @State() showId: boolean = true;
  @State() showVariantBrowser: boolean;
  @State() filteredComponents: Array<any> = []; 
  @State() showDropdown: boolean = false; 

  /**
   * If `true`, the table will include a column to show the ID.
   */
  @Prop() hideId: boolean = false;
  /**
   * If `true`, the table will include a column to show a link to open the Variant Browser.
   */
  @Prop() hideLinkVariantBrowser: boolean = false;
  /**
   * If `true`, the component will show a button to select column options. 
   */
  @Prop() showColumnHideOptions: boolean = true;
  /**
   * The following components are included by default:
   * <ul>
   *  <li>Gene</li>
   *  <li>Chromosome</li>
   *  <li>Copy Number</li>
   *  <li>Reference</li>
   *  <li>Genomic source class</li>
   *  <li>DNA change type</li>
   *  <li>c.HGVS</li>
   *  <li>p.HGVS</li>
   *  <li>Transcript ID</li>
   *  <li>Sample Allelic Frequency</li>
   *  <li>Allelic read depth</li>
   *  <li>Associated phenotype</li>
   *  <li>Clinical significance</li>
   *  <li>exact-start-end</li>
   *  <li>Ref allele</li>
   *  <li>Alt allele</li>
   *  <li>Left breakpoint position</li>
   *  <li>Right breakpoint position</li>
   *  <li>CNV Size</li>
   *  <li>Exons</li>
   * </ul>
   * 
   * **Example Struktur of a component:** </br>
   * ```
   * {
      system: "http://loinc.org",
      code: "62374-4",
      display: "Reference",
      expression: null,
      visible: false,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv", "sv"]
      }
      ```
      </br>
   * Needs to be an array of JSON objects
   */
  @Prop() components: any; 
  /**
   * Genetic Observations to be displayed. </br>
   * Needs to be an array of JSON objects
   */
  @Prop({ reflect: true, mutable: true }) geneticObservations: any = [];
  /**
   * Can be one of the following: "snv", "cnv", "sv"
   */
  @Prop() type: string = "snv";
  /**
   * Title of the variant table
   */
  @Prop() gvTitle: string = "Variants";
  /**
   * Defines colour of the table background
   */
  @Prop() tableBackground: string = "";
  /**
   * Defines colour of the table-header background
   */
  @Prop() tableHeaderBackground: string = "";
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

  parsedObservations: any;
  allComponents = [
    {
      system: "http://loinc.org",
      code: "48018-6",
      display: "Gene",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv", "sv"],
      link: {
        url: "https://oncokb.org/gene/%s",
        attribute: "display"
      }
    },
    {
      system: "http://loinc.org",
      code: "48001-2",
      display: "Chromosome",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["cnv", "snv"]
    },
    {
      system: "http://loinc.org",
      code: "82155-3",
      display: "Copy Number",
      expression: null,
      visible: true,
      valueType: "Quantity",
      variantTypes: ["cnv"]
    },
    {
      system: "http://loinc.org",
      code: "62374-4",
      display: "Reference",
      expression: null,
      visible: false,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv", "sv"]
    },
    {
      system: "http://loinc.org",
      code: "48002-0",
      display: "Genomic source class",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv", "sv"]
    },
    {
      system: "http://loinc.org",
      code: "48019-4",
      display: "DNA change type",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv", "sv"]
    },
    {
      system: "http://loinc.org",
      code: "48004-6",
      display: "c.HGVS",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["snv"]
    },
    {
      system: "http://loinc.org",
      code: "48005-3",
      display: "p.HGVS",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["snv"]
    },
    {
      system: "http://loinc.org",
      code: "51958-7",
      display: "Transcript ID",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv"],
      link: {
        url: "https://www.ncbi.nlm.nih.gov/nuccore/%s",
        attribute: "display"
      }
    },
    {
      system: "http://loinc.org",
      code: "81258-6",
      display: "Sample Allelic Frequency",
      expression: null,
      visible: true,
      valueType: "Quantity",
      variantTypes: ["snv"]
    },
    {
      system: "http://loinc.org",
      code: "82121-5",
      display: "Allelic read depth",
      expression: null,
      visible: false,
      valueType: "integer",
      variantTypes: ["snv", "cnv"]
    },
    {
      system: "http://loinc.org",
      code: "81259-4",
      display: "Associated phenotype",
      expression: null,
      visible: false,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv", "sv"]
    },
    {
      system: "http://loinc.org",
      code: "53037-8",
      display: "Clinical significance",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["snv", "cnv", "sv"]
    },
    {
      system: "http://hl7.org/fhir/uv/genomics-reporting/CodeSystem/tbd-codes",
      code: "exact-start-end",
      display: "Start & End",
      expression: null,
      visible: false,
      valueType: "Range",
      variantTypes: ["snv", "cnv"]
    },
    {
      system: "http://loinc.org",
      code: "69547-8",
      display: "Ref allele",
      expression: null,
      visible: false,
      valueType: "string",
      variantTypes: ["snv", "cnv"]
    },
    {
      system: "http://loinc.org",
      code: "69551-0",
      display: "Alt allele",
      expression: null,
      visible: false,
      valueType: "string",
      variantTypes: ["snv", "cnv"]
    },
    {
      system: "http://molit.eu/fhir/vitu-tbd-codes",
      code: "left-bp",
      display: "Left breakpoint position",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["sv"]
    },
    {
      system: "http://molit.eu/fhir/vitu-tbd-codes",
      code: "right-bp",
      display: "Right breakpoint position",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["sv"]
    },
    {
      system: "http://molit.eu/fhir/vitu-tbd-codes",
      code: "cnv-size",
      display: "CNV Size",
      expression: null,
      visible: true,
      valueType: "CodeableConcept",
      variantTypes: ["cnv"]
    },
    {
      system: "http://molit.eu/fhir/vitu-tbd-codes",
      code: "exons",
      display: "Exons",
      expression: null,
      visible: false,
      valueType: "Range",
      variantTypes: ["cnv"]
    }
  ];

  readonly EXPRESSION_BASE: string = "Observation.component.where(code.coding.system='%system' and code.coding.code='%code')"; 
  readonly EXPRESSION_CODEABLE_CONCEPT: string = this.EXPRESSION_BASE + ".valueCodeableConcept.coding.iif($this.display.exists(), $this.display, $this.code)"; 
  readonly EXPRESSION_QUANTITY: string = this.EXPRESSION_BASE + ".valueQuantity.value";
  readonly EXPRESSION_RANGE: string = this.EXPRESSION_BASE + ".valueRange.select(iif($this.low.value.exists(), $this.low.value.toString(), '') + '-' + iif($this.high.value.exists(), $this.high.value.toString(), ''))";
  readonly EXPRESSION_INTEGER: string = this.EXPRESSION_BASE + ".valueInteger";
  readonly EXPRESSION_STRING: string = this.EXPRESSION_BASE + ".valueString";

  /* computed */
  id() {
    return uniqueId();
  };

  visibleComponents() {
    return this.filteredComponents ? this.filteredComponents.filter(c => c.visible !== false) : [];
  };

  /* methods */
  getComponentValues(observation, expression) {
    if (!observation || !expression) {
      return [];
    }
    return fhirpath.evaluate(observation, expression).filter(s => s !== "SNV" && s !== "copy_number_variation" && s !== "structural_alteration");
  };

  createLink(component, value) {
    if (!component || !component.link || !component.link.url || !component.link.attribute) {
      return null;
    }
    return component.link.url.replace("%s", value);
  };

  getVariantBrowserURL(observation) {
    const baseURL = "https://variant-browser.molit.eu/";
    let url = baseURL;
    let c = this.EXPRESSION_CODEABLE_CONCEPT;    
    let r = this.EXPRESSION_RANGE;
    let s = this.EXPRESSION_STRING;
    const chromosome =  this.getComponentValues(observation, c.replace("%system", "http://loinc.org").replace("%code", "48001-2"));
    const ref = this.getComponentValues(observation, c.replace("%system", "http://loinc.org").replace("%code", "62374-4"));
    let start =  this.getComponentValues(observation, r.replace("%system", "http://hl7.org/fhir/uv/genomics-reporting/CodeSystem/tbd-codes").replace("%code", "exact-start-end"));
    const ref_allele =  this.getComponentValues(observation, s.replace("%system", "http://loinc.org").replace("%code", "69547-8"));
    const alt_allele =  this.getComponentValues(observation, s.replace("%system", "http://loinc.org").replace("%code", "69551-0"));    
    const cHGVS = this.getComponentValues(observation, c.replace("%system", "http://loinc.org").replace("%code", "48004-6"));
    const pHGVS = this.getComponentValues(observation, c.replace("%system", "http://loinc.org").replace("%code", "48005-3"));

    switch(this.type){
      case "snv":
        if (chromosome.length && start.length && ref_allele.length && alt_allele.length){
          if(start[0].endsWith("-")){
            start = start[0].slice(0,-1);
          }
          url = url + "?q=" + chromosome + ":g." + start + ref_allele + ">" + alt_allele;
          if(ref.length){
            url = url + "&ref=" + ref;
          }
        } else if (cHGVS.length && pHGVS.length) {
          url = url + "?q=" + cHGVS + " " + pHGVS;
          if(ref.length){
            url = url + "&ref=" + ref;
          }

        }
      break;
      case "cnv":
        if (chromosome.length && start.length){
          url = url + "?q=" + chromosome + ":" + start;
          if(ref.length){
            url = url + "&ref=" + ref;
          }
        }
      break;  
    }
    return url;
  };

  toggleDropdown() { 
    this.showDropdown = !this.showDropdown;
  };

  addExpressionsToComponents(components) { 
    if (!components) {
      return [];
    }
    return components.map(c => {
      switch (c.valueType) {
        case "Quantity":
          c.expression = this.EXPRESSION_QUANTITY;
          break;
        case "string":
          c.expression = this.EXPRESSION_STRING;
          break;
        case "integer":
          c.expression = this.EXPRESSION_INTEGER;
          break;
        case "Range":
          c.expression = this.EXPRESSION_RANGE;
          break;
        default:
          c.expression = this.EXPRESSION_CODEABLE_CONCEPT;
      }
      c.expression = c.expression.replace("%system", c.system).replace("%code", c.code);
      return c;
    });
  };

  initializeComponents() {
    if (this.components) {
        try {
          const parsedComponents = JSON.parse(this.components);
          this.filteredComponents = this.addExpressionsToComponents(parsedComponents);          
        } catch (e) {
          console.error("The specified string for components is not valid JSON")
        }
    } else {
      this.allComponents = this.addExpressionsToComponents(this.allComponents);
      this.filteredComponents = this.allComponents.filter(c => c && c.variantTypes && c.variantTypes.includes(this.type));
    }
  }
  
  parseGeneticObservations(){
    if(typeof this.geneticObservations === 'string')
    {
      try {
        this.parsedObservations = JSON.parse(this.geneticObservations);
      } catch (e) {
        console.error("The specified string for genetic-observations is not valid JSON")//TODO
      }
    }else if(typeof this.geneticObservations === 'object'){
      this.parsedObservations = this.geneticObservations;
    } else {
      console.error("genetic-observations are neither a string nor an object")
    }
  }

  changed(ev) {
    return ev.target.checked;
  }

  /* Lifecycle Methods */
  async componentWillLoad() {
    this.showId = !this.hideId;
    this.showVariantBrowser = !this.hideLinkVariantBrowser;
    this.initializeComponents();
    this.parseGeneticObservations();
    try {
      this.localeString = await getLocaleComponentStrings(this.element, this.locale);     
      } catch (e) {
        console.error(e);
      }
  };

  render() {
    return ([
      <div>
        <div class="genetic-header"> 
          <h6>{ this.gvTitle }</h6>
          {this.showColumnHideOptions ? 
            <button type="button" class="btn btn-link" onClick={() => this.toggleDropdown() }>{this.localeString.columnSelection} &#9662;</button>
           : null }
        </div>
        <div class="dropdown-wrapper"> 
          {this.showDropdown ? (          
            <div class="dropdown">
              <div class="dropdown-top">
                <div><strong>{this.localeString.columns}</strong></div>
                <div>
                  <button type="button" class="btn btn-link" onClick={() => this.toggleDropdown()}><strong>&times;</strong></button>
                </div>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id={this.id()} checked={this.showId} onChange={(ev) => this.showId = this.changed(ev)}/> 
                <label class="form-check-label" htmlFor={this.id()}>Id</label>
              </div>
              {this.filteredComponents.map(component => 
                <div class="form-check form-check-inline" key={component.system + '/' + component.value}> 
                  <input class="form-check-input" type="checkbox" id={this.id() + '/' + component.system + '/' + component.code} checked={component.visible} 
                    onChange={(ev) => (this.filteredComponents.find(comp => comp.code === component.code).visible = this.changed(ev),
                    this.filteredComponents = [...this.filteredComponents])}/> {/*This first replaces visible and than couses an rerender by updating via spread*/}              
                  <label class="form-check-label" htmlFor={this.id() + '/' + component.system + '/' + component.code}>{ component.display }</label>
                </div>
              )}
            </div>
          ): null }
        </div>
        
        <table class="table table-sm" style={{background: this.tableBackground }}>
          <thead>
            <tr style={{background: this.tableHeaderBackground }}>
              <th></th> {/* effect? */}
              {this.showId ? <th>{this.localeString.id} </th> : null}
              {this.visibleComponents().map(component =>
                <th key={component.system + '/' + component.code}>{ component.display }</th>
              )}
              {this.showVariantBrowser ? <th>{this.localeString.variantBrowser} </th> : null}
            </tr>
          </thead>
          <tbody>
            {this.parsedObservations.map(resource =>
              <tr key={resource.id}>
                <td>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px">
                    <path d="M0 0h24v24H0V0z" fill="none"/>
                    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
                  </svg>
                </td> {/* effect? */}
                {this.showId ? <td>{ resource.id } </td> : null}
                {this.visibleComponents().map(component =>
                  <td key={component.system + '/' + component.code}>
                    {this.getComponentValues(resource, component.expression).map(value =>
                      <span key={value}>                          
                        {(component.link && component.link.url && component.link.attribute ) ? 
                          (<span>
                          <a href={this.createLink(component, value)} target="_blank">{ value }</a> 
                          &#32;
                          </span>)
                        : <span>{ value }&#32;</span>}                    
                      </span>
                    )}
                  </td>
                )}
                {this.showVariantBrowser ? 
                  <td>
                    <span>
                      <a href={this.getVariantBrowserURL(resource)} title={this.localeString.openVariantBrowser} target="_blank"> {this.localeString.variantBrowserShort} </a> 
                      &#32;
                    </span>
                  </td>
                : null}                
              </tr>
            )}
          </tbody>
        </table>    
      </div>
    ]);        
  }
}
