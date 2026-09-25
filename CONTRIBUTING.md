# Contributing to PrismJS

First off, thank you for considering contributing to PrismJS! It's people like you that make Prism such a great tool. 

This guide will help you understand how Prism works under the hood and how you can add new plugins to extend its functionality.

---

## 1. How Prism Works

At its core, Prism is a lightweight, regex-based syntax highlighter. It works by taking a string of code and a "Grammar" (a collection of regular expressions), and breaking the code down into an array of tokens (like `keyword`, `string`, `function`, etc.). These tokens are then wrapped in HTML `<span>` elements with specific CSS classes, which are styled by Prism's themes.

**The core components are:**
* **`Prism.core.js`**: The main engine that handles tokenization and hooks.
* **Grammars**: Objects containing regular expressions that define a language's syntax.
* **Hooks**: Prism provides a callback architecture (`Prism.hooks`) that allows plugins to modify the core behavior without changing the core code.

---

## 2. Writing a New Plugin

We highly encourage developers to build plugins to extend Prism's functionality beyond basic syntax highlighting (e.g., line numbers, show invisibles, etc.).

Since Prism relies heavily on its hook system, plugins are written by tapping into these hooks rather than modifying the core engine.

1. **Create the directory**: Create a new folder in `plugins/` named `your-plugin-name`.
2. **Create the files**: Create `prism-your-plugin-name.js` and (if needed) `prism-your-plugin-name.css`.
3. **Use Hooks**: Hook into Prism's execution lifecycle to modify the DOM or the token stream.
```javascript
   Prism.hooks.add('complete', function (env) {
       // Your plugin logic here
       // 'env' contains the code, grammar, language, and the DOM element
   });
Register the Plugin: Make sure to add your new plugin to components.json or the relevant build configuration so the build system recognizes it and can generate the necessary bundles.

3. Submitting your Pull Request
Fork the repository and create your branch from master.

Run npm install to get everything set up.

Make your plugin additions.

Run npm test and ensure all tests pass (Prism uses standard Mocha tests).

Commit your changes with a clear and descriptive commit message.

Open a Pull Request! Please include a summary of your changes and reference the issue number if applicable.