# Roadmap for v2

With Prism finally moving towards v2, we finally have an opportunity to revisit the many breaking changes we've received over the years. Below are some of the changes we'll be implementing, and how.

## ESM

This is by far the most important change in v2: ES modules.

In the long long ago of 2015, when people were looking forward to wonders ES6 will bring, Prism v1.0.0 was published.
The project had been developed since mid 2012 and even before then as part of Dabblet.
While many things changed over the years, one of the things that stayed the same since the very beginning is Prism's complete lack of a module system.

At the time, there wasn't a standardized module system for JavaScript that worked for everything, so we made our own.
The basic idea was that the one loading a component was responsible for loading its dependencies.
This meant that Prism's components could be loaded with any module system or none at all.
Components could even be imported in the browser with simple `<script>` tags.

However, this system has one problem: you can get the dependencies wrong.
When components are imported in the wrong order or dependencies forgotten, you'd only get a cryptic error.

With Prism v2, component dependencies will be handled entirely by the components themselves.
We will use ESM to handle all required dependencies statically and handle optional dependencies are runtime automatically.
This will make importing a component as simple as importing a single file.

Since ESM isn't supported everywhere, we will offer 2 distributions: ESM and bundled.
The bundle distribution of a component will be one monolithic file with all of its dependencies included.

For more information see #2715, #2880, and #2736.

## Public API

We also plan a few other changes to the public API.
These changes will generally make the API simpler and resolve accumulated tech debt.

For more information see #3416, #3528, #2948, #3420, #2982, and #1844.

## IE11

It's time to let it go.
Prism v2 will no longer support IE11.

For more information see #1578 and #2457.
