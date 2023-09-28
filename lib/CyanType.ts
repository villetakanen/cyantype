import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// import { logDebug } from './logger';

@customElement('cyantype-editor')
export class MyElement extends LitElement {
  @property({type: Boolean, reflect: true})
    disabled = false
  @property({type: String, reflect: true})
    value = ''
  @property({type: String, reflect: true})
    placeholder = ''
  

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      border: var(--cn-border, none);
      margin: 0;
      padding: 0; 
      height: 100%;
    }
    :host textarea {
      border: 0;
      width: 100%;
      height: 100%;
      padding: var(--cn-padding, 0);
      margin: 0;
      box-sizing: border-box;
      background: var(--cn-background-input);
      font-family: var(--cn-font-family-ui);
      font-size: var(--cn-font-size-ui);
      outline: none;
      resize: none;
    }
  `

  onBlur (e: Event) {
    e.preventDefault()
    e.stopPropagation()
    // logDebug('blur', e)
    this.dispatchEvent(new Event('blur', {bubbles: true, composed: true}))
  }

  onChange (e: Event) {
    e.preventDefault()
    e.stopPropagation()
    // logDebug('change', e)
    this.dispatchEvent(new Event('change', {bubbles: true, composed: true}))
  }

  onInput (e: Event) {
    e.preventDefault()
    e.stopPropagation()
    this.value = (e.target as HTMLTextAreaElement).value
    // logDebug('input', e)
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}))
  }

  render() {
    return html`
    <textarea
      ?disabled=${this.disabled}
      placeholder="${this.placeholder}" 
      @input="${this.onInput}"
      @change="${this.onChange}"
      @blur="${this.onBlur}"
      .value=${this.value}
    ></textarea>
    `;
  }
}
