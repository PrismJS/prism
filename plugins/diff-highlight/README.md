---
title: Diff Highlight
description: Highlight the code inside diff blocks.
owner: RunDevelopment
require: diff
resources: ../autoloader/prism-autoloader.js
---

<section class="language-none">

# How to use

Replace the `language-diff` of your code block with a `language-diff-xxxx` class to enable syntax highlighting for diff blocks.

Optional:  
You can add the `diff-highlight` class to your code block to indicate changes using the background color of a line rather than the color of the text.

## Autoloader

The [Autoloader plugin](../autoloader) understands the `language-diff-xxxx` format and will ensure that the language definitions for both Diff and the code language are loaded.

</section>

<section class="language-none">

# Example

Using `class="language-diff"`:

```diff
@@ -4,6 +4,5 @@
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
     console.log(`foo: ${foo}`);
```

Using `class="language-diff diff-highlight"`:

```diff { .diff-highlight }
@@ -4,6 +4,5 @@
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
     console.log(`foo: ${foo}`);
```

Using `class="language-diff-javascript"`:

```diff-javascript
@@ -4,6 +4,5 @@
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
     console.log(`foo: ${foo}`);
```

Using `class="language-diff-javascript diff-highlight"`:

```diff-javascript { .diff-highlight }
@@ -4,6 +4,5 @@
-    let foo = bar.baz([1, 2, 3]);
-    foo = foo + 1;
+    const foo = bar.baz([1, 2, 3]) + 1;
     console.log(`foo: ${foo}`);
```

Using `class="language-diff-rust diff-highlight"`:  
(Autoloader is used to load the Rust language definition.)

```diff-rust { .diff-highlight }
@@ -111,6 +114,9 @@
         nasty_btree_map.insert(i, MyLeafNode(i));
     }

+    let mut zst_btree_map: BTreeMap<(), ()> = BTreeMap::new();
+    zst_btree_map.insert((), ());
+
     // VecDeque
     let mut vec_deque = VecDeque::new();
     vec_deque.push_back(5);
```

</section>
