import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('cyantype-editor')
export class MyElement extends LitElement {
  @property({type: Boolean, reflect: true})
    disabled = false
  @property({type: String, reflect: true})
    value = ''

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
  render() {
    return html`
    <textarea
      ?disabled=${this.disabled}
    >${this.value}</textarea>
    `;
  }
}
