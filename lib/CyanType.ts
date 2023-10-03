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
  @property({type: Boolean, reflect: true})
    toolbar = false

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

  onStyleChange = (e: Event) => {
    this.boxEvent(e)
    const name = (e as CustomEvent).detail.name
    if (!name) return

    // Get the current selection
    const selection = this.getSelection()

    // Get the current value
    const value = this.value

    // if bold, add ** before and after
    if (name === 'bold') {
      this.value = 
        value.substring(0, selection.start) +
        ' **' +
        value.substring(selection.start, selection.end) +
        '** ' +
        value.substring(selection.end)
    }

    // if italic, add * before and after
    if (name === 'italic') {
      this.value = 
        value.substring(0, selection.start) +
        ' *' +
        value.substring(selection.start, selection.end) +
        '* ' +
        value.substring(selection.end)
    }
  }

  render() {
    return html`
    ${ this.toolbar ? html`<cyantype-editor-toolbar
      @stylechange=${this.onStyleChange}
      >
      <div slot="custom">
        <slot name="actions"></slot>
      </div>
    </cyantype-editor-toolbar>` : ''}
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
    ${ this.info ? html`<cyantype-editor-infobar
      value="${this.value}"
      selectionStart="${this.selectionStart}"
      selectionEnd="${this.selectionEnd}"
      lineNumber="${this.lineNumber}"
    ></cyantype-editor-infobar>` : ''}
    `;
  }
}
