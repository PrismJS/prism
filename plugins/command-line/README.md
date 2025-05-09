---
title: Command Line
description: Display a command line with a prompt and, optionally, the output/response from the commands.
owner: chriswells0
resources:
  - components/prism-bash.js
  - components/prism-powershell.js
  - components/prism-sql.js
---

<section class="language-markup">

# How to use

This is intended for code blocks (`<pre><code>`) and not for inline code.

Add class **command-line** to your `<pre>`. For a server command line, specify the user and host names using the `data-user` and `data-host` attributes. The resulting prompt displays a **#** for the root user and **$** for all other users. For any other command line, such as a Windows prompt, you may specify the entire prompt using the `data-prompt` attribute.

## Optional: Command output (positional)

You may specify the lines to be presented as output (no prompt and no highlighting) through the `data-output` attribute on the `<pre>` element in the following simple format:

- A single number refers to the line with that number
- Ranges are denoted by two numbers, separated with a hyphen (-)
- Multiple line numbers or ranges are separated by commas.
- Whitespace is allowed anywhere and will be stripped off.

Examples:

5

: The 5th line

1-5

: Lines 1 through 5

1,4

: Line 1 and line 4

1-2, 5, 9-20

: Lines 1 through 2, line 5, lines 9 through 20

## Optional: Command output (prefix)

To automatically present some lines as output, you can prefix those lines with any string and specify the prefix using the `data-filter-output` attribute on the `<pre>` element. For example, `data-filter-output="(out)"` will treat lines beginning with `(out)` as output and remove the prefix.

A blank line will render as an empty line with a prompt. If you want an empty line without a prompt then you can use a line containing just the output prefix, e.g. `(out)`. See the blank lines in the examples below.

Output lines are user selectable by default, so if you select the whole content of the code block, it will select the shell commands and any output lines. This may not be desirable if you want to copy/paste just the commands and not the output. If you want to make the output not user selectable then add the following to your CSS:

```css
.command-line span.token.output {
	user-select: none;
}
```

## Optional: Multi-line commands

You can configure the plugin to handle multi-line commands. This can be done in two ways; setting a line continuation string (as in Bash); or explicitly marking continuation lines with a prefix for languages that do not have a continuation string/character, e.g. SQL, Scala, etc..


`data-continuation-str`

: Set this attribute to the line continuation string/character, e.g. for bash `data-continuation-str="\"`

`data-filter-continuation`

: This works in a similar way to `data-filter-output`. Prefix all continuation lines with the value of `data-filter-continuation` and they will be displayed with the prompt set in `data-continuation-prompt`. For example, `data-filter-continuation="(con)"` will treat lines beginning with `(con)` as continuation lines and remove the prefix.

`data-continuation-prompt`

: Set this attribute to define the prompt to be displayed when the command has continued beyond the first line (whether using line continuation or command termination), e.g. for MySQL `data-continuation-prompt="->"`. If this attribute is not set then a default of `>` will be used.

</section>

<section>

# Examples

## Default Use Without Output

```html
<pre class="command-line">
```

```bash { .command-line }
cd ~/.vim

vim vimrc
```

## Root User Without Output

```html
<pre class="command-line"
     data-user="root"
     data-host="localhost">
```

```bash { .command-line data-user="root" data-host="localhost" }
cd /usr/local/etc
cp php.ini php.ini.bak
vi php.ini
```

## Non-Root User With Output

```html
<pre class="command-line"
     data-user="chris"
     data-host="remotehost"
     data-output="2, 4-8">
```

```bash { .command-line data-user="chris" data-host="remotehost" data-output="2, 4-8" }
pwd
/usr/home/chris/bin
ls -la
total 2
drwxr-xr-x   2 chris  chris     11 Jan 10 16:48 .
drwxr--r-x  45 chris  chris     92 Feb 14 11:10 ..
-rwxr-xr-x   1 chris  chris    444 Aug 25  2013 backup
-rwxr-xr-x   1 chris  chris    642 Jan 17 14:42 deploy
```

## Windows PowerShell With Output

```html
<pre class="command-line"
     data-prompt="PS C:\Users\Chris>"
     data-output="2-19">
```

```powershell { .command-line data-prompt="PS C:\Users\Chris>" data-output="2-19" }
dir


    Directory: C:\Users\Chris


Mode                LastWriteTime     Length Name
----                -------------     ------ ----
d-r--        10/14/2015   5:06 PM            Contacts
d-r--        12/12/2015   1:47 PM            Desktop
d-r--         11/4/2015   7:59 PM            Documents
d-r--        10/14/2015   5:06 PM            Downloads
d-r--        10/14/2015   5:06 PM            Favorites
d-r--        10/14/2015   5:06 PM            Links
d-r--        10/14/2015   5:06 PM            Music
d-r--        10/14/2015   5:06 PM            Pictures
d-r--        10/14/2015   5:06 PM            Saved Games
d-r--        10/14/2015   5:06 PM            Searches
d-r--        10/14/2015   5:06 PM            Videos
```

## Line continuation with Output (bash)

```html
<pre class="command-line"
     data-filter-output="(out)"
     data-continuation-str="\" >
```

```bash { .command-line data-filter-output="(out)" data-continuation-str="\" }
export MY_VAR=123
echo "hello"
(out)hello
echo one \
two \
three
(out)one two three
(out)
echo "goodbye"
(out)goodbye
```

## Line continuation with Output (PowerShell)

```html
<pre class="command-line"
     data-prompt="ps c:\users\chris>"
     data-continuation-prompt=">>"
     data-filter-output="(out)"
     data-continuation-str=" `">
```

<pre class="command-line" data-prompt="ps c:\users\chris>" data-continuation-prompt=">>" data-filter-output="(out)" data-continuation-str=" `"><code class="language-powershell">Write-Host `
'Hello' `
'from' `
'PowerShell!'
(out)Hello from PowerShell!
Write-Host 'Goodbye from PowerShell!'
(out)Goodbye from PowerShell!</code></pre>

## Line continuation using prefix (MySQL/SQL)

```html
<pre class="command-line"
     data-prompt="mysql>"
     data-continuation-prompt="->"
     data-filter-output="(out)"
     data-filter-continuation="(con)">
```

```sql { .command-line data-prompt="mysql>" data-continuation-prompt="->" data-filter-output="(out)" data-filter-continuation="(con)" }
set @my_var = 'foo';
set @my_other_var = 'bar';
(out)
CREATE TABLE people (
(con)first_name VARCHAR(30) NOT NULL,
(con)last_name VARCHAR(30) NOT NULL
(con));
(out)Query OK, 0 rows affected (0.09 sec)
(out)
insert into people
(con)values ('John', 'Doe');
(out)Query OK, 1 row affected (0.02 sec)
(out)
select *
(con)from people
(con)order by last_name;
(out)+------------+-----------+
(out)| first_name | last_name |
(out)+------------+-----------+
(out)| John       | Doe       |
(out)+------------+-----------+
(out)1 row in set (0.00 sec)
```

</section>
