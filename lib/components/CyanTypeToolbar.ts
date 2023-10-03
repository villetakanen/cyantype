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
    :host > button {
      background: none;
      border: none;
      cursor: pointer;
      height: var(--cn-height-toolbar, var(--cn-grid-unit));
      width: var(--cn-height-toolbar, var(--cn-grid-unit));
      padding: 0;
      margin: 0;
    }
    :host > button:hover {
      background: var(--cn-background-toolbar-hover);
    }
    :host > img {
      height: var(--cn-height-toolbar, var(--cn-grid-unit));
      width: var(--cn-height-toolbar, var(--cn-grid-unit));
    }
  `

  dispatchButtonEvent(name: string) {
    this.dispatchEvent(new CustomEvent('stylechange', {bubbles: true, composed: true, detail: {name}}));
  }

  renderButton(name: string, icon: string) {
    return html`
        <button name="${name}" @click=${() => this.dispatchButtonEvent(name)}>
            <img src="${icon}" alt="${name}">
        </button>
    `;
  }


  render() {
    return html`
      <button>Heading</button>
      <div style="flex-grow: 1"></div>
      ${ this.renderButton('italic', './../italic.svg') }
      ${ this.renderButton('bold', './../bold.svg') }
      ${ this.renderButton('link', 'link.svg') }
      <slot name="custom"></slot>
    `
  }
}