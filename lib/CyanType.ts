import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('cyantype-editor')
export class MyElement extends LitElement {
  @property({type: String, reflect: true})
    value = ''

  @property()
    version = 'STARTING';

  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      border: var(--cn-border, none);
      margin: 0;
      padding: 0; 
    }
    :host textarea {
      border: 0;
      width: 100%;
      padding: var(--cn-padding, 0);
      margin: 0;
      box-sizing: border-box;
    }
  `

  render() {
    return html`
    <textarea>${this.value}</textarea>
    `;
  }
}
