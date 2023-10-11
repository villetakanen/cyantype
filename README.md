# Cyantype-editor

A Markdown editor for Cyan. The editor is provided as a lit-based web component - that works
like a textarea for form interactions.

Early alpha. Not ready for production.

## Usage

```html
<cyantype-editor
  [info]
  [toolbar]
  value=[string]
  @change
  @input
  @blur
  @keyup></cyantype-editor>
```

### Attributes

- `info` - Boolean - Show the info bar
- `toolbar` - Boolean - Show the toolbar
- `value` - String - The value of the editor
- `@change` - Event - Fired when the value changes
- `@input` - Event - Fired when the value changes
- `@blur` - Event - Fired when the editor loses focus
- `@keyup` - Event - Fired when a key is released

## Styling

The editor is styled using CSS variables. The following Cyan derived variables are available:
```css
--cn-page-grid: 24px; /* The grid size, used as base line-height. Fefaults to 24px */
```

Additionally, the following CSS variables only affecting this componentn are available:
```css

```