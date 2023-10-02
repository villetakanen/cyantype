import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { logDebug } from './logger';
// import { logDebug } from './logger';

@customElement('cyantype-editor')
export class CyanTypeEditor extends LitElement {
  @property({type: Boolean, reflect: true})
    disabled = false
  @property({type: String, reflect: true})
    value = ''
  @property({type: String, reflect: true})
    placeholder = ''
  @property({type: Boolean, reflect: true})
    info = false  
  @property({type: String, reflect: true})
    selectionStart = ''
  @property({type: String, reflect: true})
    selectionEnd = ''
  @property({type: String, reflect: true})
    lineNumber = ''

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      border: var(--cn-border, none);
      margin: 0;
      padding: 0; 
      height: 100%;
    }
    :host textarea {
      border: 0;
      width: 100%;
      flex-grow: 1;
      padding: var(--cn-padding, 0);
      margin: 0;
      box-sizing: border-box;
      background: var(--cn-background-input);
      font-family: var(--cn-font-family-ui);
      font-size: var(--cn-font-size-ui);
      outline: none;
      resize: none;
      border: none;
    }
    :host div.info {
      background-color: var(--cn-background-info);
      color: var(--cn-color-info);
      font-size: var(--cn-font-size-info);
      font-family: var(--cn-font-family-info);
      padding: var(--cn-padding-info);
      box-sizing: border-box;
      display: flex;
      justify-content: flex-end;
      gap: var(--cn-gap);
      height: var(--cn-line-height-info);
      line-height: var(--cn-line-height-info);
      padding: 0 var(--cn-gap);
    }
  `

  private boxEvent = (e?: Event) => {
    if (!e) return
    e.preventDefault()
    e.stopPropagation()
  }

  onBlur (e: Event) {
    this.boxEvent(e)
    this.value = (e.target as HTMLTextAreaElement).value
    this.dispatchEvent(new Event('blur', {bubbles: true, composed: true}))
  }

  onChange (e: Event) {
    this.boxEvent(e)
    this.value = (e.target as HTMLTextAreaElement).value
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}))
  }

  onInput (e: Event) {
    this.boxEvent(e)
    this.value = (e.target as HTMLTextAreaElement).value
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}))
  }

  onSelection = (e: Event) => {
    this.boxEvent(e)
    this.updateSelection()
  }

  renderSelection () {
    if(!this.selectionStart) return html``
    if (!this.selectionEnd || this.selectionEnd === this.selectionStart) {
      return html`
      <div class="selection">
        ${this.selectionStart}
      </div>
      `
    }
    return html`
    <div class="selection">
      ${this.selectionStart} - ${this.selectionEnd}
    </div>`
  }

  renderLineNumber () {
    if (!this.lineNumber) return html``
    return html`
    <div class="line-number">
      ${this.lineNumber}
    </div>
    `
  }


  renderInfo () {
    if (!this.info) return html``
    return html`
    <div class="info">
      <div>i</div>
      ${this.renderLineNumber()}
      ${this.renderSelection()}
    </div>
    `
  }


  updateSelection = () => {
    // Get the textarea, and current selection
    const textarea = this.shadowRoot?.querySelector('textarea')
    // logDebug('textarea', textarea)
    if (!textarea) return // Should not happen

    // if the selection has not changed, we don't need to do anything
    if (this.selectionStart === textarea.selectionStart.toString() && 
      this.selectionEnd === textarea.selectionEnd.toString()) {
      return
    }

    // Update the selection properties
    this.selectionStart = textarea.selectionStart.toString()
    this.selectionEnd = textarea.selectionEnd.toString()

    // Update the line number
    this.updateLineNumber()
    
    // Fire a selectionchange event
    this.dispatchEvent(new Event('selectionchange', {bubbles: true, composed: true}))
  }

  updateLineNumber = () => {
    const textarea = this.shadowRoot?.querySelector('textarea')
    if (!textarea) return // Should not happen

    this.lineNumber = textarea.value.substr(0, textarea.selectionStart).split("\n").length.toString()
  }

  connectedCallback(): void {
    super.connectedCallback();
    logDebug('connectedCallback')

    // Chrome does not support textarea selectionchange events, so we need to
    // listen to the document selectionchange event and update the selection
    document.addEventListener('selectionchange', this.onSelection)
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    
    // Detach chrome selection change listener
    document.removeEventListener('selectionchange', this.onSelection)
  }

  onKeyUp = (e: KeyboardEvent) => {
    this.boxEvent(e)
    // logDebug('onKeyUp', e)
    this.updateSelection()
    
    this.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, composed: true, key: e.key}))
  }

  render() {
    return html`
    <textarea
      ?disabled=${this.disabled}
      placeholder="${this.placeholder}" 
      @input="${this.onInput}"
      @change="${this.onChange}"
      @blur="${this.onBlur}"
      @selectionchange="${this.onSelection}"
      @keyup="${this.onKeyUp}"
      .value=${this.value}
    ></textarea>
    ${ this.info ? this.renderInfo() : ''}
    `;
  }
}
