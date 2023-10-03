import {LitElement, html, css} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('cyantype-editor-toolbar')
export class CyanTypeEditorToolbar extends LitElement {
  static styles = css`
    :host {
      background: var(--cn-background-toolbar);
      display: flex;
      flex-direction: row;
      gap: var(--cn-gap);
      height: var(--cn-height-toolbar, var(--cn-grid-unit));
    }
  `

  dispatchButtonEvent(name: string) {
    this.dispatchEvent(new CustomEvent('stylechange', {bubbles: true, composed: true, detail: {name}}));
  }

  renderButton(name: string, icon: string) {
    return html`
        <button name="${name}" @click=${() => this.dispatchButtonEvent(name)}>
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="${icon}"></path>
            </svg>
        </button>
    `;
  }


  render() {
    return html`
      <button>Heading</button>
      <div style="flex-grow: 1"></div>
      ${ this.renderButton('italic', 'italic.svg') }
      ${ this.renderButton('bold', 'bold.svg') }
      ${ this.renderButton('link', 'link.svg') }
    `
  }
}