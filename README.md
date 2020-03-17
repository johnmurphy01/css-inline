# css-inline

CSS Inline is meant to make it easier to create JSX/TSX inline CSS styles and convert it to regular CSS styling

## Features

![CSS Inline Example](./example/example.gif)

CSS Inline currently provides 3 selection options:

1. Select a single inline style:

```
backgroundColor: 'red'
```

The result will be copied to the clipboard. Pasting the clipboard will result in:

```
background-color: red;
```

2. Select multiple inline styles:

```
backgroundColor: 'red', fontSize: '1rem'
```

The result will be copied to the clipboard. Pasting the clipboard will result in:

```
background-color: red;
font-size: 1rem;
```

3. Select entire JSX/TSX that contains a `style` prop:

```
<div style={{backgroundColor: 'red', fontSize: '1rem'}}>Content</div>
```

The result will be copied to the clipboard. Pasting the clipboard will result in:

```
background-color: red;
font-size: 1rem;
```

## Known Issues

This extension is currently in development, so any issues or feedback would be appreciated to make it a better and more robust tool.

## Release Notes

### 1.0.0

- Initial release of CSS Inline

### 1.0.1

- Added messaging for failure and success
- Include example GIF

### 1.0.2

- Add Marketplace icon
