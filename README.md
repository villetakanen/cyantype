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

The package uses Reasonable colors _by default_. These can be overridden as below. <br>
See https://reasonable.work/colors/ for more info

The editor is styled using CSS variables. The following Cyan derived variables
are available (defaults shown):
```css
--cn-page-grid: 24px; /* The grid size, used as base line-height. Fefaults to 24px */

/* Input theming */
--cn-background-input: --color-yellow-1;
--cn-background-legend: --color-yellow-2;

--cn-background-input-focus: --color-amber-1;

```

Additionally, the following CSS variables only affecting this componentn are available:
```css

```