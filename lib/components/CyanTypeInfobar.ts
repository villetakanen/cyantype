import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('cyantype-editor-infobar')
export class CyanTypeEditorInfobar extends LitElement {
  static styles = css`
    :host {
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
      }`

  @property({type: String, reflect: true})
    value = ''
  @property({type: String, reflect: true})
    lineNumber = ''
  @property({type: String, reflect: true})
    selectionStart = ''
  @property({type: String, reflect: true})
    selectionEnd = ''

  renderMarkdowBlock () {
    // We want to show the current block of markdown at the cursor
    // So we need to get the current line and see how it starts
    const markdown = this.value

    // Get the current line
    const lines = markdown.split('\n')
    const lineNumber = parseInt(this.lineNumber) - 1 
    const line = lines.length > 0 ? lines[lineNumber] : ''

    if(!line) return html``

    let markdownNotation = ''
    let hmtlElement = ''

    // Check if it is a header (starts with 1 to 6 #'s followed by a space)
    if (line.startsWith('#')) {
      if (line.startsWith('###### ')) markdownNotation = '######'
      if (line.startsWith('##### ')) markdownNotation = '#####'
      if (line.startsWith('#### ')) markdownNotation = '####'
      if (line.startsWith('### ')) markdownNotation = '###'
      if (line.startsWith('## ')) markdownNotation = '##'
      if (line.startsWith('# ')) markdownNotation = '#'
      if (markdownNotation) hmtlElement = 'h' + markdownNotation.length
    }
            
    if (!markdownNotation) return html``

    return html`<div>${markdownNotation}: ${hmtlElement}</div>`
  }

  renderLineNumber () {
    if (!this.lineNumber) return html``
    return html`
    <div class="line-number">
      ${this.lineNumber}
    </div>
    `
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

  render () {
    return html`
      <div>i</div>
      ${this.renderMarkdowBlock()}
      ${this.renderLineNumber()}
      ${this.renderSelection()}
    `
  }
}