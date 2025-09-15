# DragDropSwipe.js

A lightweight, dependency-free JavaScript module for drag, drop, and swipe interactions. Import and use with a single line!

## Features

- Drag and drop support for any elements
- Swipe detection (touch/mobile)
- Configurable selectors and event callbacks
- No dependencies
- Easy to use: just import and go

## Installation & Usage

### Import Directly from URL

Import the module directly from the raw GitHub URL (or from a CDN like jsDelivr or unpkg):

```html
<script type="module">
  import DragDropSwipe from "https://raw.githubusercontent.com/v-aibha-v-jain/drag_drop_swipe/main/drag-drop-swipe.mjs";
  DragDropSwipe.init({
    /* options */
  });
</script>
```

Or, using jsDelivr CDN:

```html
<script type="module">
  import DragDropSwipe from "https://cdn.jsdelivr.net/gh/v-aibha-v-jain/drag_drop_swipe/drag-drop-swipe.mjs";
  DragDropSwipe.init({
    /* options */
  });
</script>
```

### Install via npm (Node/Frontend projects)

You can also install the module from npm:

```sh
npm i draggrid
```

Then import and use in your Node/ESM project:

```js
import DragDropSwipe from "draggrid";
DragDropSwipe.init({
  /* options */
});
```

**Note:**

- The URL must point to a valid ES module file.
- Some CDNs (like jsDelivr) may cache files, so update the URL if you change the code.
- GitHub raw URLs work for public repos, but may have slower performance than a CDN.
- The npm package name is `drag_drop_swipe` (with underscores).
- For frontend use, you may need to bundle or serve the module with a tool like Vite, Webpack, or Parcel.

## Usage Example

```html
<div class="draggable" id="item1" data-w="2" data-h="2">2x2</div>
<div class="draggable" id="item2" data-w="3" data-h="1">3x1</div>
<div class="draggable" id="item3" data-w="1" data-h="4">1x4</div>
<div class="draggable" id="item4" data-w="2" data-h="3">2x3</div>
<div class="draggable" id="item5" data-w="4" data-h="1">4x1</div>
<div class="dropzone"></div>
<div class="trash">🗑️ Trash</div>
<script type="module">
  import DragDropSwipe from "https://cdn.jsdelivr.net/gh/v-aibha-v-jain/drag_drop_swipe/drag-drop-swipe.mjs";
  DragDropSwipe.init({
    draggableSelector: ".draggable",
    droppableSelector: ".dropzone",
    disposeSelector: ".trash",
    gridSize: { cols: 10, rows: 10 },
    onDragStart: (el, e) => {},
    SwipeThreshold: 8,
  });
</script>
```

## API

### DragDropSwipe.init(options)

| Option            | Type     | Description                                                 |
| ----------------- | -------- | ----------------------------------------------------------- |
| draggableSelector | string   | CSS selector for draggable elements (required)              |
| droppableSelector | string   | CSS selector for drop targets (optional, default: document) |
| disposeSelector   | string   | CSS selector for dispose/trash area (optional)              |
| gridSize          | object   | `{ cols: number, rows: number }` grid size for dropzone     |
| onDragStart       | function | Callback for drag start `(el, event)`                       |
| SwipeThreshold    | number   | Threshold for swipe detection (optional, default: 7)        |

## Author & License

**Author:** Vaibhav Jain ([v-aibha-v-jain](https://github.com/v-aibha-v-jain))

**License:** MIT

---

Feel free to contribute or open issues!
