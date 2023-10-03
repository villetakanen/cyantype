import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import { logDebug } from './logger';
import TurndownService from 'turndown'

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

  renderMarkdowBlock () {
    if (!this.info) return html``

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

  getSelection () {
    const start = Number.parseInt(this.selectionStart)
    const selectionEndAsInt = Number.parseInt(this.selectionEnd)
    const end = selectionEndAsInt > start ? selectionEndAsInt : start

    return { start, end}
  }

  handlePaste (e: ClipboardEvent) {
    this.boxEvent(e)
   
    // Get the current selection
    const selection = this.getSelection()
    let len = 0
   
    // If it's HTML, we need to convert it to markdown
    const html = e.clipboardData?.getData('text/html')
    if (html) {
      // Convert it to markdown using Turndown
      const turndownService = new TurndownService()
      const markdown = turndownService.turndown(html)

      // Insert the markdown at the current cursor position
      const selection = this.getSelection()
      this.value = 
        this.value.substring(0, selection.start) +
        markdown +
        this.value.substring(selection.end)

      // Fix caret position to start + markdown.length
      const textarea = this.shadowRoot?.querySelector('textarea')
      if (!textarea) return // Should not happen
      textarea.selectionStart = selection.start
      textarea.selectionEnd = selection.start + markdown.length
      
      len = markdown.length
    } 
    else {
      // Insert the text at the current cursor position
      const text = e.clipboardData?.getData('text/plain') || ''

      if (!text) {
        logDebug('No text or html in clipboard, nothing to paste')
        return
      }

      // Insert the text at the current cursor position
      this.value = 
      this.value.substring(0, selection.start) +
      text +
      this.value.substring(selection.end) 
      len = text.length
    }

    // Fix caret position to start + content length
    const textarea = this.shadowRoot?.querySelector('textarea')
    if (!textarea) return // Should not happen
    (textarea as HTMLTextAreaElement).setSelectionRange(selection.start, selection.start + len)
  }


  renderInfo () {
    if (!this.info) return html``
    return html`
    <div class="info">
      <div>i</div>
      ${this.renderMarkdowBlock()}
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

    this.lineNumber = textarea.value.substring(0, textarea.selectionStart).split("\n").length.toString()
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
      @paste="${this.handlePaste}"
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
