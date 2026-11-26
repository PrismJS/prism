## Contribute to Prism!

### **Important Notice**

We are currently working on [Prism v2](https://github.com/PrismJS/prism/discussions/3531) and will only accept security-relevant PRs for the time being.

Once work on Prism v2 is sufficiently advanced, we will accept regular PRs again. This will be announced on our [Discussions](https://github.com/PrismJS/prism/discussions) page.

---

<details>
<summary>Prism v1 contributing notes</summary>

Prism depends on community contributions to expand and cover a wider array of use cases. If you like it, consider giving back by sending a pull request. Here are a few tips:

- Read the [documentation](https://prismjs.com/extending.html). Prism was designed to be extensible.
- **Do not edit `prism.js`**. It is generated automatically for the website. Edit only the unminified files in the `components/` folder.
- Use **`npm ci`** to install dependencies. Do not use `npm install`, as it may produce non-deterministic builds.
- The build system uses **Gulp** to minify files and build `prism.js`. After installing dependencies, run:

  ```sh
  npm run build

