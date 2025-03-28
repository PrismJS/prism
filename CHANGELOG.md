# Prism Changelog

## 1.29.0 (2022-08-23)

### New components

- **BBj** ([#3511](https://github.com/PrismJS/prism/issues/3511)) [`1134bdfc`](https://github.com/PrismJS/prism/commit/1134bdfc)
- **BQN** ([#3515](https://github.com/PrismJS/prism/issues/3515)) [`859f99a0`](https://github.com/PrismJS/prism/commit/859f99a0)
- **Cilk/C** & **Cilk/C++** ([#3522](https://github.com/PrismJS/prism/issues/3522)) [`c8462a29`](https://github.com/PrismJS/prism/commit/c8462a29)
- **Gradle** ([#3443](https://github.com/PrismJS/prism/issues/3443)) [`32119823`](https://github.com/PrismJS/prism/commit/32119823)
- **METAFONT** ([#3465](https://github.com/PrismJS/prism/issues/3465)) [`2815f699`](https://github.com/PrismJS/prism/commit/2815f699)
- **WGSL** ([#3455](https://github.com/PrismJS/prism/issues/3455)) [`4c87d418`](https://github.com/PrismJS/prism/commit/4c87d418)

### Updated components

- **AsciiDoc**
    - Some regexes are too greedy ([#3481](https://github.com/PrismJS/prism/issues/3481)) [`c4cbeeaa`](https://github.com/PrismJS/prism/commit/c4cbeeaa)
- **Bash**
    - Added "sh" alias ([#3509](https://github.com/PrismJS/prism/issues/3509)) [`6b824d47`](https://github.com/PrismJS/prism/commit/6b824d47)
    - Added support for parameters and the `java` and `sysctl` commands. ([#3505](https://github.com/PrismJS/prism/issues/3505)) [`b9512b22`](https://github.com/PrismJS/prism/commit/b9512b22)
    - Added `cargo` command ([#3488](https://github.com/PrismJS/prism/issues/3488)) [`3e937137`](https://github.com/PrismJS/prism/commit/3e937137)
- **BBj**
    - Improve regexes ([#3512](https://github.com/PrismJS/prism/issues/3512)) [`0cad9ae5`](https://github.com/PrismJS/prism/commit/0cad9ae5)
- **CSS**
    - Fixed @-rules not accounting for strings ([#3438](https://github.com/PrismJS/prism/issues/3438)) [`0d4b6cb6`](https://github.com/PrismJS/prism/commit/0d4b6cb6)
- **CSS Extras**
    - Added support for `RebeccaPurple` color ([#3448](https://github.com/PrismJS/prism/issues/3448)) [`646b2e0a`](https://github.com/PrismJS/prism/commit/646b2e0a)
- **Hoon**
    - Fixed escaped strings ([#3473](https://github.com/PrismJS/prism/issues/3473)) [`64642716`](https://github.com/PrismJS/prism/commit/64642716)
- **Java**
    - Added support for constants ([#3507](https://github.com/PrismJS/prism/issues/3507)) [`342a0039`](https://github.com/PrismJS/prism/commit/342a0039)
- **Markup**
    - Fixed quotes in HTML attribute values ([#3442](https://github.com/PrismJS/prism/issues/3442)) [`ca8eaeee`](https://github.com/PrismJS/prism/commit/ca8eaeee)
- **NSIS**
    - Added missing commands ([#3504](https://github.com/PrismJS/prism/issues/3504)) [`b0c2a9b4`](https://github.com/PrismJS/prism/commit/b0c2a9b4)
- **Scala**
    - Updated keywords to support Scala 3 ([#3506](https://github.com/PrismJS/prism/issues/3506)) [`a090d063`](https://github.com/PrismJS/prism/commit/a090d063)
- **SCSS**
    - Fix casing in title of the `scss` lang ([#3501](https://github.com/PrismJS/prism/issues/3501)) [`2aed9ce7`](https://github.com/PrismJS/prism/commit/2aed9ce7)

### Updated plugins

- **Line Highlight**
    - Account for offset when clamping ranges ([#3518](https://github.com/PrismJS/prism/issues/3518)) [`098e3000`](https://github.com/PrismJS/prism/commit/098e3000)
    - Ignore ranges outside of actual lines ([#3475](https://github.com/PrismJS/prism/issues/3475)) [`9a4e725b`](https://github.com/PrismJS/prism/commit/9a4e725b)
- **Normalize Whitespace**
    - Add configuration via attributes ([#3467](https://github.com/PrismJS/prism/issues/3467)) [`91dea0c8`](https://github.com/PrismJS/prism/commit/91dea0c8)

### Other

- Added security policy ([#3070](https://github.com/PrismJS/prism/issues/3070)) [`05ee042a`](https://github.com/PrismJS/prism/commit/05ee042a)
- Added list of maintainers ([#3410](https://github.com/PrismJS/prism/issues/3410)) [`866b302e`](https://github.com/PrismJS/prism/commit/866b302e)
- Included githubactions in the dependabot config ([#3470](https://github.com/PrismJS/prism/issues/3470)) [`9561a9ab`](https://github.com/PrismJS/prism/commit/9561a9ab)
- Set permissions for GitHub actions ([#3468](https://github.com/PrismJS/prism/issues/3468)) [`b85e1ada`](https://github.com/PrismJS/prism/commit/b85e1ada)
- **Website**
    - Website: Added third-party tutorial for Pug template ([#3459](https://github.com/PrismJS/prism/issues/3459)) [`15272f76`](https://github.com/PrismJS/prism/commit/15272f76)
    - Docs: Add missing word ([#3489](https://github.com/PrismJS/prism/issues/3489)) [`9d603ef4`](https://github.com/PrismJS/prism/commit/9d603ef4)

## 1.28.0 (2022-04-17)

### New components

- **Ado** & **Mata** (Stata) ([#3383](https://github.com/PrismJS/prism/issues/3383)) [`63806d57`](https://github.com/PrismJS/prism/commit/63806d57)
- **ARM Assembly** ([#3376](https://github.com/PrismJS/prism/issues/3376)) [`554ff324`](https://github.com/PrismJS/prism/commit/554ff324)
- **Arturo** ([#3403](https://github.com/PrismJS/prism/issues/3403)) [`e2fe1f79`](https://github.com/PrismJS/prism/commit/e2fe1f79)
- **AWK** & **GAWK** ([#3374](https://github.com/PrismJS/prism/issues/3374)) [`ea8a0f40`](https://github.com/PrismJS/prism/commit/ea8a0f40)
- **Cooklang** ([#3337](https://github.com/PrismJS/prism/issues/3337)) [`4eb928c3`](https://github.com/PrismJS/prism/commit/4eb928c3)
- **CUE** ([#3375](https://github.com/PrismJS/prism/issues/3375)) [`a1340666`](https://github.com/PrismJS/prism/commit/a1340666)
- **gettext** ([#3369](https://github.com/PrismJS/prism/issues/3369)) [`dfef9b61`](https://github.com/PrismJS/prism/commit/dfef9b61)
- **GNU Linker Script** ([#3373](https://github.com/PrismJS/prism/issues/3373)) [`33f2cf95`](https://github.com/PrismJS/prism/commit/33f2cf95)
- **Odin** ([#3424](https://github.com/PrismJS/prism/issues/3424)) [`8a3fef6d`](https://github.com/PrismJS/prism/commit/8a3fef6d)
- **PlantUML** ([#3372](https://github.com/PrismJS/prism/issues/3372)) [`0d49553c`](https://github.com/PrismJS/prism/commit/0d49553c)
- **ReScript** ([#3435](https://github.com/PrismJS/prism/issues/3435)) [`cbef9af7`](https://github.com/PrismJS/prism/commit/cbef9af7)
- **SuperCollider** ([#3371](https://github.com/PrismJS/prism/issues/3371)) [`1b1d6731`](https://github.com/PrismJS/prism/commit/1b1d6731)

### Updated components

- **.properties**
    - Use `key`, `value` for token names; `attr-name`, `attr-value` as aliases ([#3377](https://github.com/PrismJS/prism/issues/3377)) [`b94a664d`](https://github.com/PrismJS/prism/commit/b94a664d)
- **ABAP**
    - Sorted keyword list ([#3368](https://github.com/PrismJS/prism/issues/3368)) [`7bda2bf1`](https://github.com/PrismJS/prism/commit/7bda2bf1)
- **Ada**
    - Changed `attr-name` to `attribute`; Use `attr-name` as alias ([#3381](https://github.com/PrismJS/prism/issues/3381)) [`cde0b5b2`](https://github.com/PrismJS/prism/commit/cde0b5b2)
    - Added `or` keyword ([#3380](https://github.com/PrismJS/prism/issues/3380)) [`c30b736f`](https://github.com/PrismJS/prism/commit/c30b736f)
- **Atmel AVR Assembly**
    - Fixed `&=` and `|=` operators ([#3395](https://github.com/PrismJS/prism/issues/3395)) [`8c4ae5a5`](https://github.com/PrismJS/prism/commit/8c4ae5a5)
- **AutoHotkey**
    - Use standard tokens ([#3385](https://github.com/PrismJS/prism/issues/3385)) [`61c460e8`](https://github.com/PrismJS/prism/commit/61c460e8)
    - Use general pattern instead of name list for directives ([#3384](https://github.com/PrismJS/prism/issues/3384)) [`7ac84dda`](https://github.com/PrismJS/prism/commit/7ac84dda)
- **CFScript**
    - Simplified operator regex ([#3396](https://github.com/PrismJS/prism/issues/3396)) [`6a215fe0`](https://github.com/PrismJS/prism/commit/6a215fe0)
- **CMake**
    - Simplified `variable` and `operator` regexes ([#3398](https://github.com/PrismJS/prism/issues/3398)) [`8e59744b`](https://github.com/PrismJS/prism/commit/8e59744b)
- **Erlang**
    - Added `begin` keyword ([#3387](https://github.com/PrismJS/prism/issues/3387)) [`cf38d059`](https://github.com/PrismJS/prism/commit/cf38d059)
- **Excel Formula**
    - Use more fitting aliases for `function-name`, `range`, and `cell` ([#3391](https://github.com/PrismJS/prism/issues/3391)) [`ef0ec02a`](https://github.com/PrismJS/prism/commit/ef0ec02a)
- **Flow**
    - Changed alias of `type` to `class-name` ([#3390](https://github.com/PrismJS/prism/issues/3390)) [`ce41434d`](https://github.com/PrismJS/prism/commit/ce41434d)
    - Recognise `[Ss]ymbol` as a type ([#3388](https://github.com/PrismJS/prism/issues/3388)) [`3916883a`](https://github.com/PrismJS/prism/commit/3916883a)
- **GEDCOM**
    - Update `tag` to `record` ([#3386](https://github.com/PrismJS/prism/issues/3386)) [`f8f95340`](https://github.com/PrismJS/prism/commit/f8f95340)
- **Groovy**
    - Added string interpolation without hook ([#3366](https://github.com/PrismJS/prism/issues/3366)) [`5617765f`](https://github.com/PrismJS/prism/commit/5617765f)
- **Handlebars**
    - Added Mustache alias ([#3422](https://github.com/PrismJS/prism/issues/3422)) [`cb5229af`](https://github.com/PrismJS/prism/commit/cb5229af)
- **Java**
    - Improved class name detection ([#3351](https://github.com/PrismJS/prism/issues/3351)) [`4cb3d038`](https://github.com/PrismJS/prism/commit/4cb3d038)
    - Fixed `record` false positives ([#3348](https://github.com/PrismJS/prism/issues/3348)) [`3bd8fdb1`](https://github.com/PrismJS/prism/commit/3bd8fdb1)
- **JavaScript**
    - Added support for new regex syntax ([#3399](https://github.com/PrismJS/prism/issues/3399)) [`ca78cde6`](https://github.com/PrismJS/prism/commit/ca78cde6)
- **Keyman**
    - Added new keywords ([#3401](https://github.com/PrismJS/prism/issues/3401)) [`bac36827`](https://github.com/PrismJS/prism/commit/bac36827)
- **MEL**
    - Improved functions, code, and comments ([#3393](https://github.com/PrismJS/prism/issues/3393)) [`8e648dab`](https://github.com/PrismJS/prism/commit/8e648dab)
- **NEON**
    - Change alias of `key` to `property` ([#3394](https://github.com/PrismJS/prism/issues/3394)) [`1c533f4a`](https://github.com/PrismJS/prism/commit/1c533f4a)
- **PHP**
    - Added `never` return type + minor fix of named arguments ([#3421](https://github.com/PrismJS/prism/issues/3421)) [`4ffab525`](https://github.com/PrismJS/prism/commit/4ffab525)
    - Added `readonly` keyword ([#3349](https://github.com/PrismJS/prism/issues/3349)) [`4c3f1969`](https://github.com/PrismJS/prism/commit/4c3f1969)
- **PureBasic**
    - Added support for pointer to string operator ([#3362](https://github.com/PrismJS/prism/issues/3362)) [`499b1fa0`](https://github.com/PrismJS/prism/commit/499b1fa0)
- **Razor C#**
    - Added support for `@helper` and inline C# inside attribute values ([#3355](https://github.com/PrismJS/prism/issues/3355)) [`31a38d0c`](https://github.com/PrismJS/prism/commit/31a38d0c)
- **VHDL**
    - Add `private`, `view` keywords; Distinguish `attribute` from `keyword` ([#3389](https://github.com/PrismJS/prism/issues/3389)) [`d1a5ce30`](https://github.com/PrismJS/prism/commit/d1a5ce30)
- **Wolfram language**
    - Simplified `operator` regex ([#3397](https://github.com/PrismJS/prism/issues/3397)) [`10ae6da3`](https://github.com/PrismJS/prism/commit/10ae6da3)

### Updated plugins

- **Autolinker**
    - Fixed URL regex to match more valid URLs ([#3358](https://github.com/PrismJS/prism/issues/3358)) [`17ed9160`](https://github.com/PrismJS/prism/commit/17ed9160)
- **Command Line**
    - Add support for command continuation prefix ([#3344](https://github.com/PrismJS/prism/issues/3344)) [`b53832cd`](https://github.com/PrismJS/prism/commit/b53832cd)
    - Increased prompt opacity ([#3352](https://github.com/PrismJS/prism/issues/3352)) [`f95dd190`](https://github.com/PrismJS/prism/commit/f95dd190)
- **Keep Markup**
    - Use original nodes instead of clones ([#3365](https://github.com/PrismJS/prism/issues/3365)) [`8a843a17`](https://github.com/PrismJS/prism/commit/8a843a17)

### Other

- **Infrastructure**
    - Use terser ([#3407](https://github.com/PrismJS/prism/issues/3407)) [`11c54624`](https://github.com/PrismJS/prism/commit/11c54624)
    - Tests: Cache results for exp backtracking check ([#3356](https://github.com/PrismJS/prism/issues/3356)) [`ead22e1e`](https://github.com/PrismJS/prism/commit/ead22e1e)
- **Website**
    - More documentation for language definitons ([#3427](https://github.com/PrismJS/prism/issues/3427)) [`333bd590`](https://github.com/PrismJS/prism/commit/333bd590)

## 1.27.0 (2022-02-17)

### New components

- **UO Razor Script** ([#3309](https://github.com/PrismJS/prism/issues/3309)) [`3f8cc5a0`](https://github.com/PrismJS/prism/commit/3f8cc5a0)

### Updated components

- **AutoIt**
    - Allow hyphen in directive ([#3308](https://github.com/PrismJS/prism/issues/3308)) [`bcb2e2c8`](https://github.com/PrismJS/prism/commit/bcb2e2c8)
- **EditorConfig**
    - Change alias of `section` from `keyword` to `selector` ([#3305](https://github.com/PrismJS/prism/issues/3305)) [`e46501b9`](https://github.com/PrismJS/prism/commit/e46501b9)
- **Ini**
    - Swap out `header` for `section` ([#3304](https://github.com/PrismJS/prism/issues/3304)) [`deb3a97f`](https://github.com/PrismJS/prism/commit/deb3a97f)
- **MongoDB**
    - Added v5 support ([#3297](https://github.com/PrismJS/prism/issues/3297)) [`8458c41f`](https://github.com/PrismJS/prism/commit/8458c41f)
- **PureBasic**
    - Added missing keyword and fixed constants ending with `$` ([#3320](https://github.com/PrismJS/prism/issues/3320)) [`d6c53726`](https://github.com/PrismJS/prism/commit/d6c53726)
- **Scala**
    - Added support for interpolated strings ([#3293](https://github.com/PrismJS/prism/issues/3293)) [`441a1422`](https://github.com/PrismJS/prism/commit/441a1422)
- **Systemd configuration file**
    - Swap out `operator` for `punctuation` ([#3306](https://github.com/PrismJS/prism/issues/3306)) [`2eb89e15`](https://github.com/PrismJS/prism/commit/2eb89e15)

### Updated plugins

- **Command Line**
    - Escape markup in command line output ([#3341](https://github.com/PrismJS/prism/issues/3341)) [`e002e78c`](https://github.com/PrismJS/prism/commit/e002e78c)
    - Add support for line continuation and improved colors ([#3326](https://github.com/PrismJS/prism/issues/3326)) [`1784b175`](https://github.com/PrismJS/prism/commit/1784b175)
    - Added span around command and output ([#3312](https://github.com/PrismJS/prism/issues/3312)) [`82d0ca15`](https://github.com/PrismJS/prism/commit/82d0ca15)

### Other

- **Core**
    - Added better error message for missing grammars ([#3311](https://github.com/PrismJS/prism/issues/3311)) [`2cc4660b`](https://github.com/PrismJS/prism/commit/2cc4660b)

## 1.26.0 (2022-01-06)

### New components

- **Atmel AVR Assembly** ([#2078](https://github.com/PrismJS/prism/issues/2078)) [`b5a70e4c`](https://github.com/PrismJS/prism/commit/b5a70e4c)
- **Go module** ([#3209](https://github.com/PrismJS/prism/issues/3209)) [`8476a9ab`](https://github.com/PrismJS/prism/commit/8476a9ab)
- **Keepalived Configure** ([#2417](https://github.com/PrismJS/prism/issues/2417)) [`d908e457`](https://github.com/PrismJS/prism/commit/d908e457)
- **Tremor** & **Trickle** & **Troy** ([#3087](https://github.com/PrismJS/prism/issues/3087)) [`ec25ba65`](https://github.com/PrismJS/prism/commit/ec25ba65)
- **Web IDL** ([#3107](https://github.com/PrismJS/prism/issues/3107)) [`ef53f021`](https://github.com/PrismJS/prism/commit/ef53f021)

### Updated components

- Use `\d` for `[0-9]` ([#3097](https://github.com/PrismJS/prism/issues/3097)) [`9fe2f93e`](https://github.com/PrismJS/prism/commit/9fe2f93e)
- **6502 Assembly**
    - Use standard tokens and minor improvements ([#3184](https://github.com/PrismJS/prism/issues/3184)) [`929c33e0`](https://github.com/PrismJS/prism/commit/929c33e0)
- **AppleScript**
    - Use `class-name` standard token ([#3182](https://github.com/PrismJS/prism/issues/3182)) [`9f5e511d`](https://github.com/PrismJS/prism/commit/9f5e511d)
- **AQL**
    - Differentiate between strings and identifiers ([#3183](https://github.com/PrismJS/prism/issues/3183)) [`fa540ab7`](https://github.com/PrismJS/prism/commit/fa540ab7)
- **Arduino**
    - Added `ino` alias ([#2990](https://github.com/PrismJS/prism/issues/2990)) [`5b7ce5e4`](https://github.com/PrismJS/prism/commit/5b7ce5e4)
- **Avro IDL**
    - Removed char syntax ([#3185](https://github.com/PrismJS/prism/issues/3185)) [`c7809285`](https://github.com/PrismJS/prism/commit/c7809285)
- **Bash**
    - Added `node` to known commands ([#3291](https://github.com/PrismJS/prism/issues/3291)) [`4b19b502`](https://github.com/PrismJS/prism/commit/4b19b502)
    - Added `vcpkg` command ([#3282](https://github.com/PrismJS/prism/issues/3282)) [`b351bc69`](https://github.com/PrismJS/prism/commit/b351bc69)
    - Added `docker` and `podman` commands ([#3237](https://github.com/PrismJS/prism/issues/3237)) [`8c5ed251`](https://github.com/PrismJS/prism/commit/8c5ed251)
- **Birb**
    - Fixed class name false positives ([#3111](https://github.com/PrismJS/prism/issues/3111)) [`d7017beb`](https://github.com/PrismJS/prism/commit/d7017beb)
- **Bro**
    - Removed `variable` and minor improvements ([#3186](https://github.com/PrismJS/prism/issues/3186)) [`4cebf34c`](https://github.com/PrismJS/prism/commit/4cebf34c)
- **BSL (1C:Enterprise)**
    - Made `directive` greedy ([#3112](https://github.com/PrismJS/prism/issues/3112)) [`5c412cbb`](https://github.com/PrismJS/prism/commit/5c412cbb)
- **C**
    - Added `char` token ([#3207](https://github.com/PrismJS/prism/issues/3207)) [`d85a64ae`](https://github.com/PrismJS/prism/commit/d85a64ae)
- **C#**
    - Added `char` token ([#3270](https://github.com/PrismJS/prism/issues/3270)) [`220bc40f`](https://github.com/PrismJS/prism/commit/220bc40f)
    - Move everything into the IIFE ([#3077](https://github.com/PrismJS/prism/issues/3077)) [`9ed4cf6e`](https://github.com/PrismJS/prism/commit/9ed4cf6e)
- **Clojure**
    - Added `char` token ([#3188](https://github.com/PrismJS/prism/issues/3188)) [`1c88c7da`](https://github.com/PrismJS/prism/commit/1c88c7da)
- **Concurnas**
    - Improved tokenization ([#3189](https://github.com/PrismJS/prism/issues/3189)) [`7b34e65d`](https://github.com/PrismJS/prism/commit/7b34e65d)
- **Content-Security-Policy**
    - Improved tokenization ([#3276](https://github.com/PrismJS/prism/issues/3276)) [`a943f2bb`](https://github.com/PrismJS/prism/commit/a943f2bb)
- **Coq**
    - Improved attribute pattern performance ([#3085](https://github.com/PrismJS/prism/issues/3085)) [`2f9672aa`](https://github.com/PrismJS/prism/commit/2f9672aa)
- **Crystal**
    - Improved tokenization ([#3194](https://github.com/PrismJS/prism/issues/3194)) [`51e3ecc0`](https://github.com/PrismJS/prism/commit/51e3ecc0)
- **Cypher**
    - Removed non-standard use of `symbol` token name ([#3195](https://github.com/PrismJS/prism/issues/3195)) [`6af8a644`](https://github.com/PrismJS/prism/commit/6af8a644)
- **D**
    - Added standard char token ([#3196](https://github.com/PrismJS/prism/issues/3196)) [`dafdbdec`](https://github.com/PrismJS/prism/commit/dafdbdec)
- **Dart**
    - Added string interpolation and improved metadata ([#3197](https://github.com/PrismJS/prism/issues/3197)) [`e1370357`](https://github.com/PrismJS/prism/commit/e1370357)
- **DataWeave**
    - Fixed keywords being highlighted as functions ([#3113](https://github.com/PrismJS/prism/issues/3113)) [`532212b2`](https://github.com/PrismJS/prism/commit/532212b2)
- **EditorConfig**
    - Swap out `property` for `key`; alias with `attr-name` ([#3272](https://github.com/PrismJS/prism/issues/3272)) [`bee6ad56`](https://github.com/PrismJS/prism/commit/bee6ad56)
- **Eiffel**
    - Removed non-standard use of `builtin` name ([#3198](https://github.com/PrismJS/prism/issues/3198)) [`6add768b`](https://github.com/PrismJS/prism/commit/6add768b)
- **Elm**
    - Recognize unicode escapes as valid Char ([#3105](https://github.com/PrismJS/prism/issues/3105)) [`736c581d`](https://github.com/PrismJS/prism/commit/736c581d)
- **ERB**
    - Better embedding of Ruby ([#3192](https://github.com/PrismJS/prism/issues/3192)) [`336edeea`](https://github.com/PrismJS/prism/commit/336edeea)
- **F#**
    - Added `char` token ([#3271](https://github.com/PrismJS/prism/issues/3271)) [`b58cd722`](https://github.com/PrismJS/prism/commit/b58cd722)
- **G-code**
    - Use standard-conforming alias for checksum ([#3205](https://github.com/PrismJS/prism/issues/3205)) [`ee7ab563`](https://github.com/PrismJS/prism/commit/ee7ab563)
- **GameMaker Language**
    - Fixed `operator` token and added tests ([#3114](https://github.com/PrismJS/prism/issues/3114)) [`d359eeae`](https://github.com/PrismJS/prism/commit/d359eeae)
- **Go**
    - Added `char` token and improved `string` and `number` tokens ([#3208](https://github.com/PrismJS/prism/issues/3208)) [`f11b86e2`](https://github.com/PrismJS/prism/commit/f11b86e2)
- **GraphQL**
    - Optimized regexes ([#3136](https://github.com/PrismJS/prism/issues/3136)) [`8494519e`](https://github.com/PrismJS/prism/commit/8494519e)
- **Haml**
    - Use `symbol` alias for filter names ([#3210](https://github.com/PrismJS/prism/issues/3210)) [`3d410670`](https://github.com/PrismJS/prism/commit/3d410670)
    - Improved filter and interpolation tokenization ([#3191](https://github.com/PrismJS/prism/issues/3191)) [`005ba469`](https://github.com/PrismJS/prism/commit/005ba469)
- **Haxe**
    - Improved tokenization ([#3211](https://github.com/PrismJS/prism/issues/3211)) [`f41bcf23`](https://github.com/PrismJS/prism/commit/f41bcf23)
- **Hoon**
    - Simplified the language definition a little ([#3212](https://github.com/PrismJS/prism/issues/3212)) [`81920b62`](https://github.com/PrismJS/prism/commit/81920b62)
- **HTTP**
    - Added support for special header value tokenization ([#3275](https://github.com/PrismJS/prism/issues/3275)) [`3362fc79`](https://github.com/PrismJS/prism/commit/3362fc79)
    - Relax pattern for body ([#3169](https://github.com/PrismJS/prism/issues/3169)) [`22d0c6ba`](https://github.com/PrismJS/prism/commit/22d0c6ba)
- **HTTP Public-Key-Pins**
    - Improved tokenization ([#3278](https://github.com/PrismJS/prism/issues/3278)) [`0f1b5810`](https://github.com/PrismJS/prism/commit/0f1b5810)
- **HTTP Strict-Transport-Security**
    - Improved tokenization ([#3277](https://github.com/PrismJS/prism/issues/3277)) [`3d708b97`](https://github.com/PrismJS/prism/commit/3d708b97)
- **Idris**
    - Fixed import statements ([#3115](https://github.com/PrismJS/prism/issues/3115)) [`15cb3b78`](https://github.com/PrismJS/prism/commit/15cb3b78)
- **Io**
    - Simplified comment token ([#3214](https://github.com/PrismJS/prism/issues/3214)) [`c2afa59b`](https://github.com/PrismJS/prism/commit/c2afa59b)
- **J**
    - Made comments greedy ([#3215](https://github.com/PrismJS/prism/issues/3215)) [`5af16014`](https://github.com/PrismJS/prism/commit/5af16014)
- **Java**
    - Added `char` token ([#3217](https://github.com/PrismJS/prism/issues/3217)) [`0a9f909c`](https://github.com/PrismJS/prism/commit/0a9f909c)
- **Java stack trace**
    - Removed unreachable parts of regexes ([#3219](https://github.com/PrismJS/prism/issues/3219)) [`fa55492b`](https://github.com/PrismJS/prism/commit/fa55492b)
    - Added missing lookbehinds ([#3116](https://github.com/PrismJS/prism/issues/3116)) [`cfb2e782`](https://github.com/PrismJS/prism/commit/cfb2e782)
- **JavaScript**
    - Improved `number` pattern ([#3149](https://github.com/PrismJS/prism/issues/3149)) [`5a24cbff`](https://github.com/PrismJS/prism/commit/5a24cbff)
    - Added properties ([#3099](https://github.com/PrismJS/prism/issues/3099)) [`3b2238fa`](https://github.com/PrismJS/prism/commit/3b2238fa)
- **Jolie**
    - Improved tokenization ([#3221](https://github.com/PrismJS/prism/issues/3221)) [`dfbb2020`](https://github.com/PrismJS/prism/commit/dfbb2020)
- **JQ**
    - Improved performance of strings ([#3084](https://github.com/PrismJS/prism/issues/3084)) [`233415b8`](https://github.com/PrismJS/prism/commit/233415b8)
- **JS stack trace**
    - Added missing boundary assertion ([#3117](https://github.com/PrismJS/prism/issues/3117)) [`23d9aec1`](https://github.com/PrismJS/prism/commit/23d9aec1)
- **Julia**
    - Added `char` token ([#3223](https://github.com/PrismJS/prism/issues/3223)) [`3a876df0`](https://github.com/PrismJS/prism/commit/3a876df0)
- **Keyman**
    - Improved tokenization ([#3224](https://github.com/PrismJS/prism/issues/3224)) [`baa95cab`](https://github.com/PrismJS/prism/commit/baa95cab)
- **Kotlin**
    - Added `char` token and improved string interpolation ([#3225](https://github.com/PrismJS/prism/issues/3225)) [`563cd73e`](https://github.com/PrismJS/prism/commit/563cd73e)
- **Latte**
    - Use standard token names and combined delimiter tokens ([#3226](https://github.com/PrismJS/prism/issues/3226)) [`6b168a3b`](https://github.com/PrismJS/prism/commit/6b168a3b)
- **Liquid**
    - Removed unmatchable object variants ([#3135](https://github.com/PrismJS/prism/issues/3135)) [`05e7ab04`](https://github.com/PrismJS/prism/commit/05e7ab04)
- **Lisp**
    - Improved `defun` ([#3130](https://github.com/PrismJS/prism/issues/3130)) [`e8f84a6c`](https://github.com/PrismJS/prism/commit/e8f84a6c)
- **Makefile**
    - Use standard token names correctly ([#3227](https://github.com/PrismJS/prism/issues/3227)) [`21a3c2d7`](https://github.com/PrismJS/prism/commit/21a3c2d7)
- **Markdown**
    - Fixed typo in token name ([#3101](https://github.com/PrismJS/prism/issues/3101)) [`00f77a2c`](https://github.com/PrismJS/prism/commit/00f77a2c)
- **MAXScript**
    - Various improvements ([#3181](https://github.com/PrismJS/prism/issues/3181)) [`e9b856c8`](https://github.com/PrismJS/prism/commit/e9b856c8)
    - Fixed booleans not being highlighted ([#3134](https://github.com/PrismJS/prism/issues/3134)) [`c6574e6b`](https://github.com/PrismJS/prism/commit/c6574e6b)
- **Monkey**
    - Use standard tokens correctly ([#3228](https://github.com/PrismJS/prism/issues/3228)) [`c1025aa6`](https://github.com/PrismJS/prism/commit/c1025aa6)
- **N1QL**
    - Updated keywords + minor improvements ([#3229](https://github.com/PrismJS/prism/issues/3229)) [`642d93ec`](https://github.com/PrismJS/prism/commit/642d93ec)
- **nginx**
    - Made some patterns greedy ([#3230](https://github.com/PrismJS/prism/issues/3230)) [`7b72e0ad`](https://github.com/PrismJS/prism/commit/7b72e0ad)
- **Nim**
    - Added `char` token and made some tokens greedy ([#3231](https://github.com/PrismJS/prism/issues/3231)) [`2334b4b6`](https://github.com/PrismJS/prism/commit/2334b4b6)
    - Fixed backtick identifier ([#3118](https://github.com/PrismJS/prism/issues/3118)) [`75331bea`](https://github.com/PrismJS/prism/commit/75331bea)
- **Nix**
    - Use standard token name correctly ([#3232](https://github.com/PrismJS/prism/issues/3232)) [`5bf6e35f`](https://github.com/PrismJS/prism/commit/5bf6e35f)
    - Removed unmatchable token ([#3119](https://github.com/PrismJS/prism/issues/3119)) [`dc1e808f`](https://github.com/PrismJS/prism/commit/dc1e808f)
- **NSIS**
    - Made `comment` greedy ([#3234](https://github.com/PrismJS/prism/issues/3234)) [`969f152a`](https://github.com/PrismJS/prism/commit/969f152a)
    - Update regex pattern for variables ([#3266](https://github.com/PrismJS/prism/issues/3266)) [`adcc8784`](https://github.com/PrismJS/prism/commit/adcc8784)
    - Update regex for constants pattern ([#3267](https://github.com/PrismJS/prism/issues/3267)) [`55583fb2`](https://github.com/PrismJS/prism/commit/55583fb2)
- **Objective-C**
    - Improved `string` token ([#3235](https://github.com/PrismJS/prism/issues/3235)) [`8e0e95f3`](https://github.com/PrismJS/prism/commit/8e0e95f3)
- **OCaml**
    - Improved tokenization ([#3269](https://github.com/PrismJS/prism/issues/3269)) [`7bcc5da0`](https://github.com/PrismJS/prism/commit/7bcc5da0)
    - Removed unmatchable punctuation variant ([#3120](https://github.com/PrismJS/prism/issues/3120)) [`314d6994`](https://github.com/PrismJS/prism/commit/314d6994)
- **Oz**
    - Improved tokenization ([#3240](https://github.com/PrismJS/prism/issues/3240)) [`a3905c04`](https://github.com/PrismJS/prism/commit/a3905c04)
- **Pascal**
    - Added support for asm and directives ([#2653](https://github.com/PrismJS/prism/issues/2653)) [`f053af13`](https://github.com/PrismJS/prism/commit/f053af13)
- **PATROL Scripting Language**
    - Added `boolean` token ([#3248](https://github.com/PrismJS/prism/issues/3248)) [`a5b6c5eb`](https://github.com/PrismJS/prism/commit/a5b6c5eb)
- **Perl**
    - Improved tokenization ([#3241](https://github.com/PrismJS/prism/issues/3241)) [`f22ea9f9`](https://github.com/PrismJS/prism/commit/f22ea9f9)
- **PHP**
    - Removed useless keyword tokens ([#3121](https://github.com/PrismJS/prism/issues/3121)) [`ee62a080`](https://github.com/PrismJS/prism/commit/ee62a080)
- **PHP Extras**
    - Improved `scope` and `this` ([#3243](https://github.com/PrismJS/prism/issues/3243)) [`59ef51db`](https://github.com/PrismJS/prism/commit/59ef51db)
- **PL/SQL**
    - Updated keywords + other improvements ([#3109](https://github.com/PrismJS/prism/issues/3109)) [`e7ba877b`](https://github.com/PrismJS/prism/commit/e7ba877b)
- **PowerQuery**
    - Improved tokenization and use standard tokens correctly ([#3244](https://github.com/PrismJS/prism/issues/3244)) [`5688f487`](https://github.com/PrismJS/prism/commit/5688f487)
    - Removed useless `data-type` alternative ([#3122](https://github.com/PrismJS/prism/issues/3122)) [`eeb13996`](https://github.com/PrismJS/prism/commit/eeb13996)
- **PowerShell**
    - Fixed lookbehind + refactoring ([#3245](https://github.com/PrismJS/prism/issues/3245)) [`d30a2da6`](https://github.com/PrismJS/prism/commit/d30a2da6)
- **Processing**
    - Use standard tokens correctly ([#3246](https://github.com/PrismJS/prism/issues/3246)) [`5ee8c557`](https://github.com/PrismJS/prism/commit/5ee8c557)
- **Prolog**
    - Removed variable token + minor improvements ([#3247](https://github.com/PrismJS/prism/issues/3247)) [`bacf9ae3`](https://github.com/PrismJS/prism/commit/bacf9ae3)
- **Pug**
    - Improved filter tokenization ([#3258](https://github.com/PrismJS/prism/issues/3258)) [`0390e644`](https://github.com/PrismJS/prism/commit/0390e644)
- **PureBasic**
    - Fixed token order inside `asm` token ([#3123](https://github.com/PrismJS/prism/issues/3123)) [`f3b25786`](https://github.com/PrismJS/prism/commit/f3b25786)
- **Python**
    - Made `comment` greedy ([#3249](https://github.com/PrismJS/prism/issues/3249)) [`8ecef306`](https://github.com/PrismJS/prism/commit/8ecef306)
    - Add `match` and `case` (soft) keywords ([#3142](https://github.com/PrismJS/prism/issues/3142)) [`3f24dc72`](https://github.com/PrismJS/prism/commit/3f24dc72)
    - Recognize walrus operator ([#3126](https://github.com/PrismJS/prism/issues/3126)) [`18bd101c`](https://github.com/PrismJS/prism/commit/18bd101c)
    - Fixed numbers ending with a dot ([#3106](https://github.com/PrismJS/prism/issues/3106)) [`2c63efa6`](https://github.com/PrismJS/prism/commit/2c63efa6)
- **QML**
    - Made `string` greedy ([#3250](https://github.com/PrismJS/prism/issues/3250)) [`1e6dcb51`](https://github.com/PrismJS/prism/commit/1e6dcb51)
- **React JSX**
    - Move alias property ([#3222](https://github.com/PrismJS/prism/issues/3222)) [`18c92048`](https://github.com/PrismJS/prism/commit/18c92048)
- **React TSX**
    - Removed `parameter` token ([#3090](https://github.com/PrismJS/prism/issues/3090)) [`0a313f4f`](https://github.com/PrismJS/prism/commit/0a313f4f)
- **Reason**
    - Use standard tokens correctly ([#3251](https://github.com/PrismJS/prism/issues/3251)) [`809af0d9`](https://github.com/PrismJS/prism/commit/809af0d9)
- **Regex**
    - Fixed char-class/char-set confusion ([#3124](https://github.com/PrismJS/prism/issues/3124)) [`4dde2e20`](https://github.com/PrismJS/prism/commit/4dde2e20)
- **Ren'py**
    - Improved language + added tests ([#3125](https://github.com/PrismJS/prism/issues/3125)) [`ede55b2c`](https://github.com/PrismJS/prism/commit/ede55b2c)
- **Rip**
    - Use standard `char` token ([#3252](https://github.com/PrismJS/prism/issues/3252)) [`2069ab0c`](https://github.com/PrismJS/prism/commit/2069ab0c)
- **Ruby**
    - Improved tokenization ([#3193](https://github.com/PrismJS/prism/issues/3193)) [`86028adb`](https://github.com/PrismJS/prism/commit/86028adb)
- **Rust**
    - Improved `type-definition` and use standard tokens correctly ([#3253](https://github.com/PrismJS/prism/issues/3253)) [`4049e5c6`](https://github.com/PrismJS/prism/commit/4049e5c6)
- **Scheme**
    - Use standard `char` token ([#3254](https://github.com/PrismJS/prism/issues/3254)) [`7d740c45`](https://github.com/PrismJS/prism/commit/7d740c45)
    - Updates syntax for reals ([#3159](https://github.com/PrismJS/prism/issues/3159)) [`4eb81fa1`](https://github.com/PrismJS/prism/commit/4eb81fa1)
- **Smalltalk**
    - Use standard `char` token ([#3255](https://github.com/PrismJS/prism/issues/3255)) [`a7bb3001`](https://github.com/PrismJS/prism/commit/a7bb3001)
    - Added `boolean` token ([#3100](https://github.com/PrismJS/prism/issues/3100)) [`51382524`](https://github.com/PrismJS/prism/commit/51382524)
- **Smarty**
    - Improved tokenization ([#3268](https://github.com/PrismJS/prism/issues/3268)) [`acc0bc09`](https://github.com/PrismJS/prism/commit/acc0bc09)
- **SQL**
    - Added identifier token ([#3141](https://github.com/PrismJS/prism/issues/3141)) [`4e00cddd`](https://github.com/PrismJS/prism/commit/4e00cddd)
- **Squirrel**
    - Use standard `char` token ([#3256](https://github.com/PrismJS/prism/issues/3256)) [`58a65bfd`](https://github.com/PrismJS/prism/commit/58a65bfd)
- **Stan**
    - Added missing keywords and HOFs ([#3238](https://github.com/PrismJS/prism/issues/3238)) [`afd77ed1`](https://github.com/PrismJS/prism/commit/afd77ed1)
- **Structured Text (IEC 61131-3)**
    - Structured text: Improved tokenization ([#3213](https://github.com/PrismJS/prism/issues/3213)) [`d04d166d`](https://github.com/PrismJS/prism/commit/d04d166d)
- **Swift**
    - Added support for `isolated` keyword ([#3174](https://github.com/PrismJS/prism/issues/3174)) [`18c828a6`](https://github.com/PrismJS/prism/commit/18c828a6)
- **TAP**
    - Conform to quoted-properties style ([#3127](https://github.com/PrismJS/prism/issues/3127)) [`3ef71533`](https://github.com/PrismJS/prism/commit/3ef71533)
- **Tremor**
    - Use standard `regex` token ([#3257](https://github.com/PrismJS/prism/issues/3257)) [`c56e4bf5`](https://github.com/PrismJS/prism/commit/c56e4bf5)
- **Twig**
    - Improved tokenization ([#3259](https://github.com/PrismJS/prism/issues/3259)) [`e03a7c24`](https://github.com/PrismJS/prism/commit/e03a7c24)
- **TypeScript**
    - Removed duplicate keywords ([#3132](https://github.com/PrismJS/prism/issues/3132)) [`91060fd6`](https://github.com/PrismJS/prism/commit/91060fd6)
- **URI**
    - Fixed IPv4 regex ([#3128](https://github.com/PrismJS/prism/issues/3128)) [`599e30ee`](https://github.com/PrismJS/prism/commit/599e30ee)
- **V**
    - Use standard `char` token ([#3260](https://github.com/PrismJS/prism/issues/3260)) [`e4373256`](https://github.com/PrismJS/prism/commit/e4373256)
- **Verilog**
    - Use standard tokens correctly ([#3261](https://github.com/PrismJS/prism/issues/3261)) [`43124129`](https://github.com/PrismJS/prism/commit/43124129)
- **Visual Basic**
    - Simplify regexes and use more common aliases ([#3262](https://github.com/PrismJS/prism/issues/3262)) [`aa73d448`](https://github.com/PrismJS/prism/commit/aa73d448)
- **Wolfram language**
    - Removed unmatchable punctuation variant ([#3133](https://github.com/PrismJS/prism/issues/3133)) [`a28a86ad`](https://github.com/PrismJS/prism/commit/a28a86ad)
- **Xojo (REALbasic)**
    - Proper token name for directives ([#3263](https://github.com/PrismJS/prism/issues/3263)) [`ffd8343f`](https://github.com/PrismJS/prism/commit/ffd8343f)
- **Zig**
    - Added missing keywords ([#3279](https://github.com/PrismJS/prism/issues/3279)) [`deed35e3`](https://github.com/PrismJS/prism/commit/deed35e3)
    - Use standard `char` token ([#3264](https://github.com/PrismJS/prism/issues/3264)) [`c3f9fb70`](https://github.com/PrismJS/prism/commit/c3f9fb70)
    - Fixed module comments and astral chars ([#3129](https://github.com/PrismJS/prism/issues/3129)) [`09a0e2ba`](https://github.com/PrismJS/prism/commit/09a0e2ba)

### Updated plugins

- **File Highlight**
    - File highlight+data range ([#1813](https://github.com/PrismJS/prism/issues/1813)) [`d38592c5`](https://github.com/PrismJS/prism/commit/d38592c5)
- **Keep Markup**
    - Added `drop-tokens` option class ([#3166](https://github.com/PrismJS/prism/issues/3166)) [`b679cfe6`](https://github.com/PrismJS/prism/commit/b679cfe6)
- **Line Highlight**
    - Expose `highlightLines` function as `Prism.plugins.highlightLines` ([#3086](https://github.com/PrismJS/prism/issues/3086)) [`9f4c0e74`](https://github.com/PrismJS/prism/commit/9f4c0e74)
- **Toolbar**
    - Set `z-index` of `.toolbar` to 10 ([#3163](https://github.com/PrismJS/prism/issues/3163)) [`1cac3559`](https://github.com/PrismJS/prism/commit/1cac3559)

### Updated themes

- Coy: Set `z-index` to make shadows visible in colored table cells ([#3161](https://github.com/PrismJS/prism/issues/3161)) [`79f250f3`](https://github.com/PrismJS/prism/commit/79f250f3)
- Coy: Added padding to account for box shadow ([#3143](https://github.com/PrismJS/prism/issues/3143)) [`a6a4ce7e`](https://github.com/PrismJS/prism/commit/a6a4ce7e)

### Other

- **Core**
    - Added `setLanguage` util function ([#3167](https://github.com/PrismJS/prism/issues/3167)) [`b631949a`](https://github.com/PrismJS/prism/commit/b631949a)
    - Fixed type error on null ([#3057](https://github.com/PrismJS/prism/issues/3057)) [`a80a68ba`](https://github.com/PrismJS/prism/commit/a80a68ba)
    - Document `disableWorkerMessageHandler` ([#3088](https://github.com/PrismJS/prism/issues/3088)) [`213cf7be`](https://github.com/PrismJS/prism/commit/213cf7be)
- **Infrastructure**
    - Tests: Added `.html.test` files for replace `.js` language tests ([#3148](https://github.com/PrismJS/prism/issues/3148)) [`2e834c8c`](https://github.com/PrismJS/prism/commit/2e834c8c)
    - Added regex coverage ([#3138](https://github.com/PrismJS/prism/issues/3138)) [`5333e281`](https://github.com/PrismJS/prism/commit/5333e281)
    - Tests: Added `TestCaseFile` class and generalized `runTestCase` ([#3147](https://github.com/PrismJS/prism/issues/3147)) [`ae8888a0`](https://github.com/PrismJS/prism/commit/ae8888a0)
    - Added even more language tests ([#3137](https://github.com/PrismJS/prism/issues/3137)) [`344d0b27`](https://github.com/PrismJS/prism/commit/344d0b27)
    - Added more plugin tests ([#1969](https://github.com/PrismJS/prism/issues/1969)) [`a394a14d`](https://github.com/PrismJS/prism/commit/a394a14d)
    - Added more language tests ([#3131](https://github.com/PrismJS/prism/issues/3131)) [`2f7f7364`](https://github.com/PrismJS/prism/commit/2f7f7364)
    - `package.json`: Added `engines.node` field ([#3108](https://github.com/PrismJS/prism/issues/3108)) [`798ee4f6`](https://github.com/PrismJS/prism/commit/798ee4f6)
    - Use tabs in `package(-lock).json` ([#3098](https://github.com/PrismJS/prism/issues/3098)) [`8daebb4a`](https://github.com/PrismJS/prism/commit/8daebb4a)
    - Update `eslint-plugin-regexp@1.2.0` ([#3091](https://github.com/PrismJS/prism/issues/3091)) [`e6e1d5ae`](https://github.com/PrismJS/prism/commit/e6e1d5ae)
    - Added minified CSS ([#3073](https://github.com/PrismJS/prism/issues/3073)) [`d63d6c0e`](https://github.com/PrismJS/prism/commit/d63d6c0e)
- **Website**
    - Readme: Clarify usage of our build system ([#3239](https://github.com/PrismJS/prism/issues/3239)) [`6f1d904a`](https://github.com/PrismJS/prism/commit/6f1d904a)
    - Improved CDN usage URLs ([#3285](https://github.com/PrismJS/prism/issues/3285)) [`6c21b2f7`](https://github.com/PrismJS/prism/commit/6c21b2f7)
    - Update download.html [`9d5424b6`](https://github.com/PrismJS/prism/commit/9d5424b6)
    - Autoloader: Mention how to load grammars from URLs ([#3218](https://github.com/PrismJS/prism/issues/3218)) [`cefccdd1`](https://github.com/PrismJS/prism/commit/cefccdd1)
    - Added PrismJS React and HTML tutorial link ([#3190](https://github.com/PrismJS/prism/issues/3190)) [`0ecdbdce`](https://github.com/PrismJS/prism/commit/0ecdbdce)
    - Improved readability ([#3177](https://github.com/PrismJS/prism/issues/3177)) [`4433d7fe`](https://github.com/PrismJS/prism/commit/4433d7fe)
    - Fixed red highlighting in Firefox ([#3178](https://github.com/PrismJS/prism/issues/3178)) [`746da79b`](https://github.com/PrismJS/prism/commit/746da79b)
    - Use Keep markup to highlight code section ([#3164](https://github.com/PrismJS/prism/issues/3164)) [`ebd59e32`](https://github.com/PrismJS/prism/commit/ebd59e32)
    - Document standard tokens and provide examples ([#3104](https://github.com/PrismJS/prism/issues/3104)) [`37551200`](https://github.com/PrismJS/prism/commit/37551200)
    - Fixed dead link to third-party tutorial [#3155](https://github.com/PrismJS/prism/issues/3155) ([#3156](https://github.com/PrismJS/prism/issues/3156)) [`31b4c1b8`](https://github.com/PrismJS/prism/commit/31b4c1b8)
    - Repositioned theme selector ([#3146](https://github.com/PrismJS/prism/issues/3146)) [`ea361e5a`](https://github.com/PrismJS/prism/commit/ea361e5a)
    - Adjusted TOC's line height for better readability ([#3145](https://github.com/PrismJS/prism/issues/3145)) [`c5629706`](https://github.com/PrismJS/prism/commit/c5629706)
    - Updated plugin header template ([#3144](https://github.com/PrismJS/prism/issues/3144)) [`faedfe85`](https://github.com/PrismJS/prism/commit/faedfe85)
    - Update test and example pages to use Autoloader ([#1936](https://github.com/PrismJS/prism/issues/1936)) [`3d96eedc`](https://github.com/PrismJS/prism/commit/3d96eedc)

## 1.25.0 (2021-09-16)

### New components

- **AviSynth** ([#3071](https://github.com/PrismJS/prism/issues/3071)) [`746a4b1a`](https://github.com/PrismJS/prism/commit/746a4b1a)
- **Avro IDL** ([#3051](https://github.com/PrismJS/prism/issues/3051)) [`87e5a376`](https://github.com/PrismJS/prism/commit/87e5a376)
- **Bicep** ([#3027](https://github.com/PrismJS/prism/issues/3027)) [`c1dce998`](https://github.com/PrismJS/prism/commit/c1dce998)
- **GAP (CAS)** ([#3054](https://github.com/PrismJS/prism/issues/3054)) [`23cd9b65`](https://github.com/PrismJS/prism/commit/23cd9b65)
- **GN** ([#3062](https://github.com/PrismJS/prism/issues/3062)) [`4f97b82b`](https://github.com/PrismJS/prism/commit/4f97b82b)
- **Hoon** ([#2978](https://github.com/PrismJS/prism/issues/2978)) [`ea776756`](https://github.com/PrismJS/prism/commit/ea776756)
- **Kusto** ([#3068](https://github.com/PrismJS/prism/issues/3068)) [`e008ea05`](https://github.com/PrismJS/prism/commit/e008ea05)
- **Magma (CAS)** ([#3055](https://github.com/PrismJS/prism/issues/3055)) [`a1b67ce3`](https://github.com/PrismJS/prism/commit/a1b67ce3)
- **MAXScript** ([#3060](https://github.com/PrismJS/prism/issues/3060)) [`4fbdd2f8`](https://github.com/PrismJS/prism/commit/4fbdd2f8)
- **Mermaid** ([#3050](https://github.com/PrismJS/prism/issues/3050)) [`148c1eca`](https://github.com/PrismJS/prism/commit/148c1eca)
- **Razor C#** ([#3064](https://github.com/PrismJS/prism/issues/3064)) [`4433ccfc`](https://github.com/PrismJS/prism/commit/4433ccfc)
- **Systemd configuration file** ([#3053](https://github.com/PrismJS/prism/issues/3053)) [`8df825e0`](https://github.com/PrismJS/prism/commit/8df825e0)
- **Wren** ([#3063](https://github.com/PrismJS/prism/issues/3063)) [`6a356d25`](https://github.com/PrismJS/prism/commit/6a356d25)

### Updated components

- **Bicep**
    - Added support for multiline and interpolated strings and other improvements ([#3028](https://github.com/PrismJS/prism/issues/3028)) [`748bb9ac`](https://github.com/PrismJS/prism/commit/748bb9ac)
- **C#**
    - Added `with` keyword & improved record support ([#2993](https://github.com/PrismJS/prism/issues/2993)) [`fdd291c0`](https://github.com/PrismJS/prism/commit/fdd291c0)
    - Added `record`, `init`, and `nullable` keyword ([#2991](https://github.com/PrismJS/prism/issues/2991)) [`9b561565`](https://github.com/PrismJS/prism/commit/9b561565)
    - Added context check for `from` keyword ([#2970](https://github.com/PrismJS/prism/issues/2970)) [`158f25d4`](https://github.com/PrismJS/prism/commit/158f25d4)
- **C++**
    - Fixed generic function false positive ([#3043](https://github.com/PrismJS/prism/issues/3043)) [`5de8947f`](https://github.com/PrismJS/prism/commit/5de8947f)
- **Clojure**
    - Improved tokenization ([#3056](https://github.com/PrismJS/prism/issues/3056)) [`8d0b74b5`](https://github.com/PrismJS/prism/commit/8d0b74b5)
- **Hoon**
    - Fixed mixed-case aura tokenization ([#3002](https://github.com/PrismJS/prism/issues/3002)) [`9c8911bd`](https://github.com/PrismJS/prism/commit/9c8911bd)
- **Liquid**
    - Added all objects from Shopify reference ([#2998](https://github.com/PrismJS/prism/issues/2998)) [`693b7433`](https://github.com/PrismJS/prism/commit/693b7433)
    - Added `empty` keyword ([#2997](https://github.com/PrismJS/prism/issues/2997)) [`fe3bc526`](https://github.com/PrismJS/prism/commit/fe3bc526)
- **Log file**
    - Added support for Java stack traces ([#3003](https://github.com/PrismJS/prism/issues/3003)) [`b0365e70`](https://github.com/PrismJS/prism/commit/b0365e70)
- **Markup**
    - Made most patterns greedy ([#3065](https://github.com/PrismJS/prism/issues/3065)) [`52e8cee9`](https://github.com/PrismJS/prism/commit/52e8cee9)
    - Fixed ReDoS ([#3078](https://github.com/PrismJS/prism/issues/3078)) [`0ff371bb`](https://github.com/PrismJS/prism/commit/0ff371bb)
- **PureScript**
    - Made `∀` a keyword (alias for `forall`) ([#3005](https://github.com/PrismJS/prism/issues/3005)) [`b38fc89a`](https://github.com/PrismJS/prism/commit/b38fc89a)
    - Improved Haskell and PureScript ([#3020](https://github.com/PrismJS/prism/issues/3020)) [`679539ec`](https://github.com/PrismJS/prism/commit/679539ec)
- **Python**
    - Support for underscores in numbers ([#3039](https://github.com/PrismJS/prism/issues/3039)) [`6f5d68f7`](https://github.com/PrismJS/prism/commit/6f5d68f7)
- **Sass**
    - Fixed issues with CSS Extras ([#2994](https://github.com/PrismJS/prism/issues/2994)) [`14fdfe32`](https://github.com/PrismJS/prism/commit/14fdfe32)
- **Shell session**
    - Fixed command false positives ([#3048](https://github.com/PrismJS/prism/issues/3048)) [`35b88fcf`](https://github.com/PrismJS/prism/commit/35b88fcf)
    - Added support for the percent sign as shell symbol ([#3010](https://github.com/PrismJS/prism/issues/3010)) [`4492b62b`](https://github.com/PrismJS/prism/commit/4492b62b)
- **Swift**
    - Major improvements ([#3022](https://github.com/PrismJS/prism/issues/3022)) [`8541db2e`](https://github.com/PrismJS/prism/commit/8541db2e)
    - Added support for `@propertyWrapper`, `@MainActor`, and `@globalActor` ([#3009](https://github.com/PrismJS/prism/issues/3009)) [`ce5e0f01`](https://github.com/PrismJS/prism/commit/ce5e0f01)
    - Added support for new Swift 5.5 keywords ([#2988](https://github.com/PrismJS/prism/issues/2988)) [`bb93fac0`](https://github.com/PrismJS/prism/commit/bb93fac0)
- **TypeScript**
    - Fixed keyword false positives ([#3001](https://github.com/PrismJS/prism/issues/3001)) [`212e0ef2`](https://github.com/PrismJS/prism/commit/212e0ef2)

### Updated plugins

- **JSONP Highlight**
    - Refactored JSONP logic ([#3018](https://github.com/PrismJS/prism/issues/3018)) [`5126d1e1`](https://github.com/PrismJS/prism/commit/5126d1e1)
- **Line Highlight**
    - Extend highlight to full line width inside scroll container ([#3011](https://github.com/PrismJS/prism/issues/3011)) [`e289ec60`](https://github.com/PrismJS/prism/commit/e289ec60)
- **Normalize Whitespace**
    - Removed unnecessary checks ([#3017](https://github.com/PrismJS/prism/issues/3017)) [`63edf14c`](https://github.com/PrismJS/prism/commit/63edf14c)
- **Previewers**
    - Ensure popup is visible across themes ([#3080](https://github.com/PrismJS/prism/issues/3080)) [`c7b6a7f6`](https://github.com/PrismJS/prism/commit/c7b6a7f6)

### Updated themes

- **Twilight**
    - Increase selector specificities of plugin overrides ([#3081](https://github.com/PrismJS/prism/issues/3081)) [`ffb20439`](https://github.com/PrismJS/prism/commit/ffb20439)

### Other

- **Infrastructure**
    - Added benchmark suite ([#2153](https://github.com/PrismJS/prism/issues/2153)) [`44456b21`](https://github.com/PrismJS/prism/commit/44456b21)
    - Tests: Insert expected JSON by Default ([#2960](https://github.com/PrismJS/prism/issues/2960)) [`e997dd35`](https://github.com/PrismJS/prism/commit/e997dd35)
    - Tests: Improved dection of empty patterns ([#3058](https://github.com/PrismJS/prism/issues/3058)) [`d216e602`](https://github.com/PrismJS/prism/commit/d216e602)
- **Website**
    - Highlight Keywords: More documentation ([#3049](https://github.com/PrismJS/prism/issues/3049)) [`247fd9a3`](https://github.com/PrismJS/prism/commit/247fd9a3)

## 1.24.1 (2021-07-03)

### Updated components

- **Markdown**
    - Fixed Markdown not working in NodeJS ([#2977](https://github.com/PrismJS/prism/issues/2977)) [`151121cd`](https://github.com/PrismJS/prism/commit/151121cd)

### Updated plugins

- **Toolbar**
    - Fixed styles being applies to nested elements ([#2980](https://github.com/PrismJS/prism/issues/2980)) [`748ecddc`](https://github.com/PrismJS/prism/commit/748ecddc)

## 1.24.0 (2021-06-27)

### New components

- **CFScript** ([#2771](https://github.com/PrismJS/prism/issues/2771)) [`b0a6ec85`](https://github.com/PrismJS/prism/commit/b0a6ec85)
- **ChaiScript** ([#2706](https://github.com/PrismJS/prism/issues/2706)) [`3f7d7453`](https://github.com/PrismJS/prism/commit/3f7d7453)
- **COBOL** ([#2800](https://github.com/PrismJS/prism/issues/2800)) [`7e5f78ff`](https://github.com/PrismJS/prism/commit/7e5f78ff)
- **Coq** ([#2803](https://github.com/PrismJS/prism/issues/2803)) [`41e25d3c`](https://github.com/PrismJS/prism/commit/41e25d3c)
- **CSV** ([#2794](https://github.com/PrismJS/prism/issues/2794)) [`f9b69528`](https://github.com/PrismJS/prism/commit/f9b69528)
- **DOT (Graphviz)** ([#2690](https://github.com/PrismJS/prism/issues/2690)) [`1f91868e`](https://github.com/PrismJS/prism/commit/1f91868e)
- **False** ([#2802](https://github.com/PrismJS/prism/issues/2802)) [`99a21dc5`](https://github.com/PrismJS/prism/commit/99a21dc5)
- **ICU Message Format** ([#2745](https://github.com/PrismJS/prism/issues/2745)) [`bf4e7ba9`](https://github.com/PrismJS/prism/commit/bf4e7ba9)
- **Idris** ([#2755](https://github.com/PrismJS/prism/issues/2755)) [`e9314415`](https://github.com/PrismJS/prism/commit/e9314415)
- **Jexl** ([#2764](https://github.com/PrismJS/prism/issues/2764)) [`7e51b99c`](https://github.com/PrismJS/prism/commit/7e51b99c)
- **KuMir (КуМир)** ([#2760](https://github.com/PrismJS/prism/issues/2760)) [`3419fb77`](https://github.com/PrismJS/prism/commit/3419fb77)
- **Log file** ([#2796](https://github.com/PrismJS/prism/issues/2796)) [`2bc6475b`](https://github.com/PrismJS/prism/commit/2bc6475b)
- **Nevod** ([#2798](https://github.com/PrismJS/prism/issues/2798)) [`f84c49c5`](https://github.com/PrismJS/prism/commit/f84c49c5)
- **OpenQasm** ([#2797](https://github.com/PrismJS/prism/issues/2797)) [`1a2347a3`](https://github.com/PrismJS/prism/commit/1a2347a3)
- **PATROL Scripting Language** ([#2739](https://github.com/PrismJS/prism/issues/2739)) [`18c67b49`](https://github.com/PrismJS/prism/commit/18c67b49)
- **Q#** ([#2804](https://github.com/PrismJS/prism/issues/2804)) [`1b63cd01`](https://github.com/PrismJS/prism/commit/1b63cd01)
- **Rego** ([#2624](https://github.com/PrismJS/prism/issues/2624)) [`e38986f9`](https://github.com/PrismJS/prism/commit/e38986f9)
- **Squirrel** ([#2721](https://github.com/PrismJS/prism/issues/2721)) [`fd1081d2`](https://github.com/PrismJS/prism/commit/fd1081d2)
- **URI** ([#2708](https://github.com/PrismJS/prism/issues/2708)) [`bbc77d19`](https://github.com/PrismJS/prism/commit/bbc77d19)
- **V** ([#2687](https://github.com/PrismJS/prism/issues/2687)) [`72962701`](https://github.com/PrismJS/prism/commit/72962701)
- **Wolfram language** & **Mathematica** & **Mathematica Notebook** ([#2921](https://github.com/PrismJS/prism/issues/2921)) [`c4f6b2cc`](https://github.com/PrismJS/prism/commit/c4f6b2cc)

### Updated components

- Fixed problems reported by `regexp/no-dupe-disjunctions` ([#2952](https://github.com/PrismJS/prism/issues/2952)) [`f471d2d7`](https://github.com/PrismJS/prism/commit/f471d2d7)
- Fixed some cases of quadratic worst-case runtime ([#2922](https://github.com/PrismJS/prism/issues/2922)) [`79d22182`](https://github.com/PrismJS/prism/commit/79d22182)
- Fixed 2 cases of exponential backtracking ([#2774](https://github.com/PrismJS/prism/issues/2774)) [`d85e30da`](https://github.com/PrismJS/prism/commit/d85e30da)
- **AQL**
    - Update for ArangoDB 3.8 ([#2842](https://github.com/PrismJS/prism/issues/2842)) [`ea82478d`](https://github.com/PrismJS/prism/commit/ea82478d)
- **AutoHotkey**
    - Improved tag pattern ([#2920](https://github.com/PrismJS/prism/issues/2920)) [`fc2a3334`](https://github.com/PrismJS/prism/commit/fc2a3334)
- **Bash**
    - Accept hyphens in function names ([#2832](https://github.com/PrismJS/prism/issues/2832)) [`e4ad22ad`](https://github.com/PrismJS/prism/commit/e4ad22ad)
    - Fixed single-quoted strings ([#2792](https://github.com/PrismJS/prism/issues/2792)) [`e5cfdb4a`](https://github.com/PrismJS/prism/commit/e5cfdb4a)
- **C++**
    - Added support for generic functions and made `::` punctuation ([#2814](https://github.com/PrismJS/prism/issues/2814)) [`3df62fd0`](https://github.com/PrismJS/prism/commit/3df62fd0)
    - Added missing keywords and modules ([#2763](https://github.com/PrismJS/prism/issues/2763)) [`88fa72cf`](https://github.com/PrismJS/prism/commit/88fa72cf)
- **Dart**
    - Improved support for classes & generics ([#2810](https://github.com/PrismJS/prism/issues/2810)) [`d0bcd074`](https://github.com/PrismJS/prism/commit/d0bcd074)
- **Docker**
    - Improvements ([#2720](https://github.com/PrismJS/prism/issues/2720)) [`93dd83c2`](https://github.com/PrismJS/prism/commit/93dd83c2)
- **Elixir**
    - Added missing keywords ([#2958](https://github.com/PrismJS/prism/issues/2958)) [`114e4626`](https://github.com/PrismJS/prism/commit/114e4626)
    - Added missing keyword and other improvements ([#2773](https://github.com/PrismJS/prism/issues/2773)) [`e6c0d298`](https://github.com/PrismJS/prism/commit/e6c0d298)
    - Added `defdelagate` keyword and highlighting for function/module names ([#2709](https://github.com/PrismJS/prism/issues/2709)) [`59f725d7`](https://github.com/PrismJS/prism/commit/59f725d7)
- **F#**
    - Fixed comment false positive ([#2703](https://github.com/PrismJS/prism/issues/2703)) [`a5d7178c`](https://github.com/PrismJS/prism/commit/a5d7178c)
- **GraphQL**
    - Fixed `definition-query` and `definition-mutation` tokens ([#2964](https://github.com/PrismJS/prism/issues/2964)) [`bfd7fded`](https://github.com/PrismJS/prism/commit/bfd7fded)
    - Added more detailed tokens ([#2939](https://github.com/PrismJS/prism/issues/2939)) [`34f24ac9`](https://github.com/PrismJS/prism/commit/34f24ac9)
- **Handlebars**
    - Added `hbs` alias ([#2874](https://github.com/PrismJS/prism/issues/2874)) [`43976351`](https://github.com/PrismJS/prism/commit/43976351)
- **HTTP**
    - Fixed body not being highlighted ([#2734](https://github.com/PrismJS/prism/issues/2734)) [`1dfc8271`](https://github.com/PrismJS/prism/commit/1dfc8271)
    - More granular tokenization ([#2722](https://github.com/PrismJS/prism/issues/2722)) [`6183fd9b`](https://github.com/PrismJS/prism/commit/6183fd9b)
    - Allow root path in request line ([#2711](https://github.com/PrismJS/prism/issues/2711)) [`4e7b2a82`](https://github.com/PrismJS/prism/commit/4e7b2a82)
- **Ini**
    - Consistently mimic Win32 INI parsing ([#2779](https://github.com/PrismJS/prism/issues/2779)) [`42d24fa2`](https://github.com/PrismJS/prism/commit/42d24fa2)
- **Java**
    - Improved generics ([#2812](https://github.com/PrismJS/prism/issues/2812)) [`4ec7535c`](https://github.com/PrismJS/prism/commit/4ec7535c)
- **JavaScript**
    - Added support for import assertions ([#2953](https://github.com/PrismJS/prism/issues/2953)) [`ab7c9953`](https://github.com/PrismJS/prism/commit/ab7c9953)
    - Added support for RegExp Match Indices ([#2900](https://github.com/PrismJS/prism/issues/2900)) [`415651a0`](https://github.com/PrismJS/prism/commit/415651a0)
    - Added hashbang and private getters/setters ([#2815](https://github.com/PrismJS/prism/issues/2815)) [`9c610ae6`](https://github.com/PrismJS/prism/commit/9c610ae6)
    - Improved contextual keywords ([#2713](https://github.com/PrismJS/prism/issues/2713)) [`022f90a0`](https://github.com/PrismJS/prism/commit/022f90a0)
- **JS Templates**
    - Added SQL templates ([#2945](https://github.com/PrismJS/prism/issues/2945)) [`abab9104`](https://github.com/PrismJS/prism/commit/abab9104)
- **JSON**
    - Fixed backtracking issue in Safari ([#2691](https://github.com/PrismJS/prism/issues/2691)) [`cf28d1b2`](https://github.com/PrismJS/prism/commit/cf28d1b2)
- **Liquid**
    - Added Markup support, missing tokens, and other improvements ([#2950](https://github.com/PrismJS/prism/issues/2950)) [`ac1d12f9`](https://github.com/PrismJS/prism/commit/ac1d12f9)
- **Log file**
    - Minor improvements ([#2851](https://github.com/PrismJS/prism/issues/2851)) [`45ec4a88`](https://github.com/PrismJS/prism/commit/45ec4a88)
- **Markdown**
    - Improved code snippets ([#2967](https://github.com/PrismJS/prism/issues/2967)) [`e9477d83`](https://github.com/PrismJS/prism/commit/e9477d83)
    - Workaround for incorrect highlighting due to double `wrap` hook ([#2719](https://github.com/PrismJS/prism/issues/2719)) [`2b355c98`](https://github.com/PrismJS/prism/commit/2b355c98)
- **Markup**
    - Added support for DOM event attributes ([#2702](https://github.com/PrismJS/prism/issues/2702)) [`8dbbbb35`](https://github.com/PrismJS/prism/commit/8dbbbb35)
- **nginx**
    - Complete rewrite ([#2793](https://github.com/PrismJS/prism/issues/2793)) [`5943f4cb`](https://github.com/PrismJS/prism/commit/5943f4cb)
- **PHP**
    - Fixed functions with namespaces ([#2889](https://github.com/PrismJS/prism/issues/2889)) [`87d79390`](https://github.com/PrismJS/prism/commit/87d79390)
    - Fixed string interpolation ([#2864](https://github.com/PrismJS/prism/issues/2864)) [`cf3755cb`](https://github.com/PrismJS/prism/commit/cf3755cb)
    - Added missing PHP 7.4 `fn` keyword ([#2858](https://github.com/PrismJS/prism/issues/2858)) [`e0ee93f1`](https://github.com/PrismJS/prism/commit/e0ee93f1)
    - Fixed methods with keyword names + minor improvements ([#2818](https://github.com/PrismJS/prism/issues/2818)) [`7e8cd40d`](https://github.com/PrismJS/prism/commit/7e8cd40d)
    - Improved constant support for PHP 8.1 enums ([#2770](https://github.com/PrismJS/prism/issues/2770)) [`8019e2f6`](https://github.com/PrismJS/prism/commit/8019e2f6)
    - Added support for PHP 8.1 enums ([#2752](https://github.com/PrismJS/prism/issues/2752)) [`f79b0eef`](https://github.com/PrismJS/prism/commit/f79b0eef)
    - Class names at the start of a string are now highlighted correctly ([#2731](https://github.com/PrismJS/prism/issues/2731)) [`04ef309c`](https://github.com/PrismJS/prism/commit/04ef309c)
    - Numeral syntax improvements ([#2701](https://github.com/PrismJS/prism/issues/2701)) [`01af04ed`](https://github.com/PrismJS/prism/commit/01af04ed)
- **React JSX**
    - Added support for general spread expressions ([#2754](https://github.com/PrismJS/prism/issues/2754)) [`9f59f52d`](https://github.com/PrismJS/prism/commit/9f59f52d)
    - Added support for comments inside tags ([#2728](https://github.com/PrismJS/prism/issues/2728)) [`30b0444f`](https://github.com/PrismJS/prism/commit/30b0444f)
- **reST (reStructuredText)**
    - Fixed `inline` pattern ([#2946](https://github.com/PrismJS/prism/issues/2946)) [`a7656de6`](https://github.com/PrismJS/prism/commit/a7656de6)
- **Ruby**
    - Added heredoc literals ([#2885](https://github.com/PrismJS/prism/issues/2885)) [`20b77bff`](https://github.com/PrismJS/prism/commit/20b77bff)
    - Added missing regex flags ([#2845](https://github.com/PrismJS/prism/issues/2845)) [`3786f396`](https://github.com/PrismJS/prism/commit/3786f396)
    - Added missing regex interpolation ([#2841](https://github.com/PrismJS/prism/issues/2841)) [`f08c2f7f`](https://github.com/PrismJS/prism/commit/f08c2f7f)
- **Scheme**
    - Added support for high Unicode characters ([#2693](https://github.com/PrismJS/prism/issues/2693)) [`0e61a7e1`](https://github.com/PrismJS/prism/commit/0e61a7e1)
    - Added bracket support ([#2813](https://github.com/PrismJS/prism/issues/2813)) [`1c6c0bf3`](https://github.com/PrismJS/prism/commit/1c6c0bf3)
- **Shell session**
    - Fixed multi-line commands ([#2872](https://github.com/PrismJS/prism/issues/2872)) [`cda976b1`](https://github.com/PrismJS/prism/commit/cda976b1)
    - Commands prefixed with a path are now detected ([#2686](https://github.com/PrismJS/prism/issues/2686)) [`c83fd0b8`](https://github.com/PrismJS/prism/commit/c83fd0b8)
- **SQL**
    - Added `ILIKE` operator ([#2704](https://github.com/PrismJS/prism/issues/2704)) [`6e34771f`](https://github.com/PrismJS/prism/commit/6e34771f)
- **Swift**
    - Added `some` keyword ([#2756](https://github.com/PrismJS/prism/issues/2756)) [`cf354ef5`](https://github.com/PrismJS/prism/commit/cf354ef5)
- **TypeScript**
    - Updated keywords ([#2861](https://github.com/PrismJS/prism/issues/2861)) [`fe98d536`](https://github.com/PrismJS/prism/commit/fe98d536)
    - Added support for decorators ([#2820](https://github.com/PrismJS/prism/issues/2820)) [`31cc2142`](https://github.com/PrismJS/prism/commit/31cc2142)
- **VB.Net**
    - Improved strings, comments, and punctuation ([#2782](https://github.com/PrismJS/prism/issues/2782)) [`a68f1fb6`](https://github.com/PrismJS/prism/commit/a68f1fb6)
- **Xojo (REALbasic)**
    - `REM` is no longer highlighted as a keyword in comments ([#2823](https://github.com/PrismJS/prism/issues/2823)) [`ebbbfd47`](https://github.com/PrismJS/prism/commit/ebbbfd47)
    - Added last missing Keyword "Selector" ([#2807](https://github.com/PrismJS/prism/issues/2807)) [`e32e043b`](https://github.com/PrismJS/prism/commit/e32e043b)
    - Added missing keywords ([#2805](https://github.com/PrismJS/prism/issues/2805)) [`459365ec`](https://github.com/PrismJS/prism/commit/459365ec)

### Updated plugins

- Made Match Braces and Custom Class compatible ([#2947](https://github.com/PrismJS/prism/issues/2947)) [`4b55bd6a`](https://github.com/PrismJS/prism/commit/4b55bd6a)
- Consistent Prism check ([#2788](https://github.com/PrismJS/prism/issues/2788)) [`96335642`](https://github.com/PrismJS/prism/commit/96335642)
- **Command Line**
    - Don't modify empty code blocks ([#2896](https://github.com/PrismJS/prism/issues/2896)) [`c81c3319`](https://github.com/PrismJS/prism/commit/c81c3319)
- **Copy to Clipboard**
    - Removed ClipboardJS dependency ([#2784](https://github.com/PrismJS/prism/issues/2784)) [`d5e14e1a`](https://github.com/PrismJS/prism/commit/d5e14e1a)
    - Fixed `clipboard.writeText` not working inside iFrames ([#2826](https://github.com/PrismJS/prism/issues/2826)) [`01b7b6f7`](https://github.com/PrismJS/prism/commit/01b7b6f7)
    - Added support for custom styles ([#2789](https://github.com/PrismJS/prism/issues/2789)) [`4d7f75b0`](https://github.com/PrismJS/prism/commit/4d7f75b0)
    - Make copy-to-clipboard configurable with multiple attributes ([#2723](https://github.com/PrismJS/prism/issues/2723)) [`2cb909e1`](https://github.com/PrismJS/prism/commit/2cb909e1)
- **File Highlight**
    - Fixed Prism check ([#2827](https://github.com/PrismJS/prism/issues/2827)) [`53d34b22`](https://github.com/PrismJS/prism/commit/53d34b22)
- **Line Highlight**
    - Fixed linkable line numbers not being initialized ([#2732](https://github.com/PrismJS/prism/issues/2732)) [`ccc73ab7`](https://github.com/PrismJS/prism/commit/ccc73ab7)
- **Previewers**
    - Use `classList` instead of `className` ([#2787](https://github.com/PrismJS/prism/issues/2787)) [`d298d46e`](https://github.com/PrismJS/prism/commit/d298d46e)

### Other

- **Core**
    - Add `tabindex` to code blocks to enable keyboard navigation ([#2799](https://github.com/PrismJS/prism/issues/2799)) [`dbf70515`](https://github.com/PrismJS/prism/commit/dbf70515)
    - Fixed greedy rematching reach bug ([#2705](https://github.com/PrismJS/prism/issues/2705)) [`b37987d3`](https://github.com/PrismJS/prism/commit/b37987d3)
    - Added support for plaintext ([#2738](https://github.com/PrismJS/prism/issues/2738)) [`970674cf`](https://github.com/PrismJS/prism/commit/970674cf)
- **Infrastructure**
    - Added ESLint
    - Added `npm-run-all` to clean up test command ([#2938](https://github.com/PrismJS/prism/issues/2938)) [`5d3d8088`](https://github.com/PrismJS/prism/commit/5d3d8088)
    - Added link to Q&A to issue templates ([#2834](https://github.com/PrismJS/prism/issues/2834)) [`7cd9e794`](https://github.com/PrismJS/prism/commit/7cd9e794)
    - CI: Run tests with NodeJS 16.x ([#2888](https://github.com/PrismJS/prism/issues/2888)) [`b77317c5`](https://github.com/PrismJS/prism/commit/b77317c5)
    - Dangerfile: Trim merge base ([#2761](https://github.com/PrismJS/prism/issues/2761)) [`45b0e82a`](https://github.com/PrismJS/prism/commit/45b0e82a)
    - Dangerfile: Fixed how changed files are determined ([#2757](https://github.com/PrismJS/prism/issues/2757)) [`0feb266f`](https://github.com/PrismJS/prism/commit/0feb266f)
    - Deps: Updated regex tooling ([#2923](https://github.com/PrismJS/prism/issues/2923)) [`ad9878ad`](https://github.com/PrismJS/prism/commit/ad9878ad)
    - Tests: Added `--language` for patterns tests ([#2929](https://github.com/PrismJS/prism/issues/2929)) [`a62ef796`](https://github.com/PrismJS/prism/commit/a62ef796)
    - Tests: Fixed polynomial backtracking test ([#2891](https://github.com/PrismJS/prism/issues/2891)) [`8dbf1217`](https://github.com/PrismJS/prism/commit/8dbf1217)
    - Tests: Fixed languages test discovery [`a9a199b6`](https://github.com/PrismJS/prism/commit/a9a199b6)
    - Tests: Test discovery should ignore unsupported file extensions ([#2886](https://github.com/PrismJS/prism/issues/2886)) [`4492c5ce`](https://github.com/PrismJS/prism/commit/4492c5ce)
    - Tests: Exhaustive pattern tests ([#2688](https://github.com/PrismJS/prism/issues/2688)) [`53151404`](https://github.com/PrismJS/prism/commit/53151404)
    - Tests: Fixed pretty print incorrectly calculating print width ([#2821](https://github.com/PrismJS/prism/issues/2821)) [`5bc405e7`](https://github.com/PrismJS/prism/commit/5bc405e7)
    - Tests: Automatically normalize line ends ([#2934](https://github.com/PrismJS/prism/issues/2934)) [`99f3ddcd`](https://github.com/PrismJS/prism/commit/99f3ddcd)
    - Tests: Added `--insert` and `--update` parameters to language test ([#2809](https://github.com/PrismJS/prism/issues/2809)) [`4c8b855d`](https://github.com/PrismJS/prism/commit/4c8b855d)
    - Tests: Stricter `components.json` tests ([#2758](https://github.com/PrismJS/prism/issues/2758)) [`933af805`](https://github.com/PrismJS/prism/commit/933af805)
- **Website**
    - Copy to clipboard: Fixed highlighting ([#2725](https://github.com/PrismJS/prism/issues/2725)) [`7a790bf9`](https://github.com/PrismJS/prism/commit/7a790bf9)
    - Readme: Mention `npm ci` ([#2899](https://github.com/PrismJS/prism/issues/2899)) [`91f3aaed`](https://github.com/PrismJS/prism/commit/91f3aaed)
    - Readme: Added Node and npm version requirements ([#2790](https://github.com/PrismJS/prism/issues/2790)) [`cb220168`](https://github.com/PrismJS/prism/commit/cb220168)
    - Readme: Update link to Chinese translation ([#2749](https://github.com/PrismJS/prism/issues/2749)) [`266cc700`](https://github.com/PrismJS/prism/commit/266cc700)
    - Replace `my.cdn` in code sample with Handlebars-like placeholder ([#2906](https://github.com/PrismJS/prism/issues/2906)) [`80471181`](https://github.com/PrismJS/prism/commit/80471181)
    - Set dummy domain for CDN ([#2905](https://github.com/PrismJS/prism/issues/2905)) [`38f1d289`](https://github.com/PrismJS/prism/commit/38f1d289)
    - Added MySQL to "Used by" section ([#2785](https://github.com/PrismJS/prism/issues/2785)) [`9b784ebf`](https://github.com/PrismJS/prism/commit/9b784ebf)
    - Improved basic usage section ([#2777](https://github.com/PrismJS/prism/issues/2777)) [`a1209930`](https://github.com/PrismJS/prism/commit/a1209930)
    - Updated URL in Autolinker example ([#2751](https://github.com/PrismJS/prism/issues/2751)) [`ec9767d6`](https://github.com/PrismJS/prism/commit/ec9767d6)
    - Added React native tutorial ([#2683](https://github.com/PrismJS/prism/issues/2683)) [`1506f345`](https://github.com/PrismJS/prism/commit/1506f345)

## 1.23.0 (2020-12-31)

### New components

- **Apex** ([#2622](https://github.com/PrismJS/prism/issues/2622)) [`f0e2b70e`](https://github.com/PrismJS/prism/commit/f0e2b70e)
- **DataWeave** ([#2659](https://github.com/PrismJS/prism/issues/2659)) [`0803525b`](https://github.com/PrismJS/prism/commit/0803525b)
- **PromQL** ([#2628](https://github.com/PrismJS/prism/issues/2628)) [`8831c706`](https://github.com/PrismJS/prism/commit/8831c706)

### Updated components

- Fixed multiple vulnerable regexes ([#2584](https://github.com/PrismJS/prism/issues/2584)) [`c2f6a644`](https://github.com/PrismJS/prism/commit/c2f6a644)
- **Apache Configuration**
    - Update directive-flag to match `=` ([#2612](https://github.com/PrismJS/prism/issues/2612)) [`00bf00e3`](https://github.com/PrismJS/prism/commit/00bf00e3)
- **C-like**
    - Made all comments greedy ([#2680](https://github.com/PrismJS/prism/issues/2680)) [`0a3932fe`](https://github.com/PrismJS/prism/commit/0a3932fe)
- **C**
    - Better class name and macro name detection ([#2585](https://github.com/PrismJS/prism/issues/2585)) [`129faf5c`](https://github.com/PrismJS/prism/commit/129faf5c)
- **Content-Security-Policy**
    - Added missing directives and keywords ([#2664](https://github.com/PrismJS/prism/issues/2664)) [`f1541342`](https://github.com/PrismJS/prism/commit/f1541342)
    - Do not highlight directive names with adjacent hyphens ([#2662](https://github.com/PrismJS/prism/issues/2662)) [`a7ccc16d`](https://github.com/PrismJS/prism/commit/a7ccc16d)
- **CSS**
    - Better HTML `style` attribute tokenization ([#2569](https://github.com/PrismJS/prism/issues/2569)) [`b04cbafe`](https://github.com/PrismJS/prism/commit/b04cbafe)
- **Java**
    - Improved package and class name detection ([#2599](https://github.com/PrismJS/prism/issues/2599)) [`0889bc7c`](https://github.com/PrismJS/prism/commit/0889bc7c)
    - Added Java 15 keywords ([#2567](https://github.com/PrismJS/prism/issues/2567)) [`73f81c89`](https://github.com/PrismJS/prism/commit/73f81c89)
- **Java stack trace**
    - Added support stack frame element class loaders and modules ([#2658](https://github.com/PrismJS/prism/issues/2658)) [`0bb4f096`](https://github.com/PrismJS/prism/commit/0bb4f096)
- **Julia**
    - Removed constants that are not exported by default ([#2601](https://github.com/PrismJS/prism/issues/2601)) [`093c8175`](https://github.com/PrismJS/prism/commit/093c8175)
- **Kotlin**
    - Added support for backticks in function names ([#2489](https://github.com/PrismJS/prism/issues/2489)) [`a5107d5c`](https://github.com/PrismJS/prism/commit/a5107d5c)
- **Latte**
    - Fixed exponential backtracking ([#2682](https://github.com/PrismJS/prism/issues/2682)) [`89f1e182`](https://github.com/PrismJS/prism/commit/89f1e182)
- **Markdown**
    - Improved URL tokenization ([#2678](https://github.com/PrismJS/prism/issues/2678)) [`2af3e2c2`](https://github.com/PrismJS/prism/commit/2af3e2c2)
    - Added support for YAML front matter ([#2634](https://github.com/PrismJS/prism/issues/2634)) [`5cf9cfbc`](https://github.com/PrismJS/prism/commit/5cf9cfbc)
- **PHP**
    - Added support for PHP 7.4 + other major improvements ([#2566](https://github.com/PrismJS/prism/issues/2566)) [`38808e64`](https://github.com/PrismJS/prism/commit/38808e64)
    - Added support for PHP 8.0 features ([#2591](https://github.com/PrismJS/prism/issues/2591)) [`df922d90`](https://github.com/PrismJS/prism/commit/df922d90)
    - Removed C-like dependency ([#2619](https://github.com/PrismJS/prism/issues/2619)) [`89ebb0b7`](https://github.com/PrismJS/prism/commit/89ebb0b7)
    - Fixed exponential backtracking ([#2684](https://github.com/PrismJS/prism/issues/2684)) [`37b9c9a1`](https://github.com/PrismJS/prism/commit/37b9c9a1)
- **Sass (Scss)**
    - Added support for Sass modules ([#2643](https://github.com/PrismJS/prism/issues/2643)) [`deb238a6`](https://github.com/PrismJS/prism/commit/deb238a6)
- **Scheme**
    - Fixed number pattern ([#2648](https://github.com/PrismJS/prism/issues/2648)) [`e01ecd00`](https://github.com/PrismJS/prism/commit/e01ecd00)
    - Fixed function and function-like false positives ([#2611](https://github.com/PrismJS/prism/issues/2611)) [`7951ca24`](https://github.com/PrismJS/prism/commit/7951ca24)
- **Shell session**
    - Fixed false positives because of links in command output ([#2649](https://github.com/PrismJS/prism/issues/2649)) [`8e76a978`](https://github.com/PrismJS/prism/commit/8e76a978)
- **TSX**
    - Temporary fix for the collisions of JSX tags and TS generics ([#2596](https://github.com/PrismJS/prism/issues/2596)) [`25bdb494`](https://github.com/PrismJS/prism/commit/25bdb494)

### Updated plugins

- Made Autoloader and Diff Highlight compatible ([#2580](https://github.com/PrismJS/prism/issues/2580)) [`7a74497a`](https://github.com/PrismJS/prism/commit/7a74497a)
- **Copy to Clipboard Button**
    - Set `type="button"` attribute for copy to clipboard plugin ([#2593](https://github.com/PrismJS/prism/issues/2593)) [`f59a85f1`](https://github.com/PrismJS/prism/commit/f59a85f1)
- **File Highlight**
    - Fixed IE compatibility problem ([#2656](https://github.com/PrismJS/prism/issues/2656)) [`3f4ae00d`](https://github.com/PrismJS/prism/commit/3f4ae00d)
- **Line Highlight**
    - Fixed top offset in combination with Line numbers ([#2237](https://github.com/PrismJS/prism/issues/2237)) [`b40f8f4b`](https://github.com/PrismJS/prism/commit/b40f8f4b)
    - Fixed print background color ([#2668](https://github.com/PrismJS/prism/issues/2668)) [`cdb24abe`](https://github.com/PrismJS/prism/commit/cdb24abe)
- **Line Numbers**
    - Fixed null reference ([#2605](https://github.com/PrismJS/prism/issues/2605)) [`7cdfe556`](https://github.com/PrismJS/prism/commit/7cdfe556)
- **Treeview**
    - Fixed icons on dark themes ([#2631](https://github.com/PrismJS/prism/issues/2631)) [`7266e32f`](https://github.com/PrismJS/prism/commit/7266e32f)
- **Unescaped Markup**
    - Refactoring ([#2445](https://github.com/PrismJS/prism/issues/2445)) [`fc602822`](https://github.com/PrismJS/prism/commit/fc602822)

### Other

- Readme: Added alternative link for Chinese translation [`071232b4`](https://github.com/PrismJS/prism/commit/071232b4)
- Readme: Removed broken icon for Chinese translation ([#2670](https://github.com/PrismJS/prism/issues/2670)) [`2ea202b9`](https://github.com/PrismJS/prism/commit/2ea202b9)
- Readme: Grammar adjustments ([#2629](https://github.com/PrismJS/prism/issues/2629)) [`f217ab75`](https://github.com/PrismJS/prism/commit/f217ab75)
- **Core**
    - Moved pattern matching + lookbehind logic into function ([#2633](https://github.com/PrismJS/prism/issues/2633)) [`24574406`](https://github.com/PrismJS/prism/commit/24574406)
    - Fixed bug with greedy matching ([#2632](https://github.com/PrismJS/prism/issues/2632)) [`8fa8dd24`](https://github.com/PrismJS/prism/commit/8fa8dd24)
- **Infrastructure**
    - Migrate from TravisCI -> GitHub Actions ([#2606](https://github.com/PrismJS/prism/issues/2606)) [`69132045`](https://github.com/PrismJS/prism/commit/69132045)
    - Added Dangerfile and provide bundle size info ([#2608](https://github.com/PrismJS/prism/issues/2608)) [`9df20c5e`](https://github.com/PrismJS/prism/commit/9df20c5e)
    - New `start` script to start local server ([#2491](https://github.com/PrismJS/prism/issues/2491)) [`0604793c`](https://github.com/PrismJS/prism/commit/0604793c)
    - Added test for exponential backtracking ([#2590](https://github.com/PrismJS/prism/issues/2590)) [`05afbb10`](https://github.com/PrismJS/prism/commit/05afbb10)
    - Added test for polynomial backtracking ([#2597](https://github.com/PrismJS/prism/issues/2597)) [`e644178b`](https://github.com/PrismJS/prism/commit/e644178b)
    - Tests: Better pretty print ([#2600](https://github.com/PrismJS/prism/issues/2600)) [`8bfcc819`](https://github.com/PrismJS/prism/commit/8bfcc819)
    - Tests: Fixed sorted language list test ([#2623](https://github.com/PrismJS/prism/issues/2623)) [`2d3a1267`](https://github.com/PrismJS/prism/commit/2d3a1267)
    - Tests: Stricter pattern for nice-token-names test ([#2588](https://github.com/PrismJS/prism/issues/2588)) [`0df60be1`](https://github.com/PrismJS/prism/commit/0df60be1)
    - Tests: Added strict checks for `Prism.languages.extend` ([#2572](https://github.com/PrismJS/prism/issues/2572)) [`8828500e`](https://github.com/PrismJS/prism/commit/8828500e)
- **Website**
    - Test page: Added "Share" option ([#2575](https://github.com/PrismJS/prism/issues/2575)) [`b5f4f10e`](https://github.com/PrismJS/prism/commit/b5f4f10e)
    - Test page: Don't trigger ad-blockers with class ([#2677](https://github.com/PrismJS/prism/issues/2677)) [`df0738e9`](https://github.com/PrismJS/prism/commit/df0738e9)
    - Thousands -> millions [`9f82de50`](https://github.com/PrismJS/prism/commit/9f82de50)
    - Unescaped Markup: More doc regarding comments ([#2652](https://github.com/PrismJS/prism/issues/2652)) [`add3736a`](https://github.com/PrismJS/prism/commit/add3736a)
    - Website: Added and updated documentation ([#2654](https://github.com/PrismJS/prism/issues/2654)) [`8e660495`](https://github.com/PrismJS/prism/commit/8e660495)
    - Website: Updated and improved guide on "Extending Prism" page ([#2586](https://github.com/PrismJS/prism/issues/2586)) [`8e1f38ff`](https://github.com/PrismJS/prism/commit/8e1f38ff)

## 1.22.0 (2020-10-10)

### New components

- **Birb** ([#2542](https://github.com/PrismJS/prism/issues/2542)) [`4d31e22a`](https://github.com/PrismJS/prism/commit/4d31e22a)
- **BSL (1C:Enterprise)** & **OneScript** ([#2520](https://github.com/PrismJS/prism/issues/2520)) [`5c33f0bb`](https://github.com/PrismJS/prism/commit/5c33f0bb)
- **MongoDB** ([#2518](https://github.com/PrismJS/prism/issues/2518)) [`004eaa74`](https://github.com/PrismJS/prism/commit/004eaa74)
- **Naninovel Script** ([#2494](https://github.com/PrismJS/prism/issues/2494)) [`388ad996`](https://github.com/PrismJS/prism/commit/388ad996)
- **PureScript** ([#2526](https://github.com/PrismJS/prism/issues/2526)) [`ad748a00`](https://github.com/PrismJS/prism/commit/ad748a00)
- **SML** & **SML/NJ** ([#2537](https://github.com/PrismJS/prism/issues/2537)) [`cb75d9e2`](https://github.com/PrismJS/prism/commit/cb75d9e2)
- **Stan** ([#2490](https://github.com/PrismJS/prism/issues/2490)) [`2da2beba`](https://github.com/PrismJS/prism/commit/2da2beba)
- **TypoScript** & **TSConfig** ([#2505](https://github.com/PrismJS/prism/issues/2505)) [`bf115f47`](https://github.com/PrismJS/prism/commit/bf115f47)

### Updated components

- Removed duplicate alternatives in various languages ([#2524](https://github.com/PrismJS/prism/issues/2524)) [`fa2225ff`](https://github.com/PrismJS/prism/commit/fa2225ff)
- **Haskell**
    - Improvements ([#2535](https://github.com/PrismJS/prism/issues/2535)) [`e023044c`](https://github.com/PrismJS/prism/commit/e023044c)
- **JS Extras**
    - Highlight import and export bindings ([#2533](https://github.com/PrismJS/prism/issues/2533)) [`c51ababb`](https://github.com/PrismJS/prism/commit/c51ababb)
    - Added control-flow keywords ([#2529](https://github.com/PrismJS/prism/issues/2529)) [`bcef22af`](https://github.com/PrismJS/prism/commit/bcef22af)
- **PHP**
    - Added `match` keyword (PHP 8.0) ([#2574](https://github.com/PrismJS/prism/issues/2574)) [`1761513e`](https://github.com/PrismJS/prism/commit/1761513e)
- **Processing**
    - Fixed function pattern ([#2564](https://github.com/PrismJS/prism/issues/2564)) [`35cbc02f`](https://github.com/PrismJS/prism/commit/35cbc02f)
- **Regex**
    - Changed how languages embed regexes ([#2532](https://github.com/PrismJS/prism/issues/2532)) [`f62ca787`](https://github.com/PrismJS/prism/commit/f62ca787)
- **Rust**
    - Fixed Unicode char literals ([#2550](https://github.com/PrismJS/prism/issues/2550)) [`3b4f14ca`](https://github.com/PrismJS/prism/commit/3b4f14ca)
- **Scheme**
    - Added support for R7RS syntax ([#2525](https://github.com/PrismJS/prism/issues/2525)) [`e4f6ccac`](https://github.com/PrismJS/prism/commit/e4f6ccac)
- **Shell session**
    - Added aliases ([#2548](https://github.com/PrismJS/prism/issues/2548)) [`bfb36748`](https://github.com/PrismJS/prism/commit/bfb36748)
    - Highlight all commands after the start of any Heredoc string ([#2509](https://github.com/PrismJS/prism/issues/2509)) [`6c921801`](https://github.com/PrismJS/prism/commit/6c921801)
- **YAML**
    - Improved key pattern ([#2561](https://github.com/PrismJS/prism/issues/2561)) [`59853a52`](https://github.com/PrismJS/prism/commit/59853a52)

### Updated plugins

- **Autoloader**
    - Fixed file detection regexes ([#2549](https://github.com/PrismJS/prism/issues/2549)) [`d36ea993`](https://github.com/PrismJS/prism/commit/d36ea993)
- **Match braces**
    - Fixed JS interpolation punctuation ([#2541](https://github.com/PrismJS/prism/issues/2541)) [`6b47133d`](https://github.com/PrismJS/prism/commit/6b47133d)
- **Show Language**
    - Added title for plain text ([#2555](https://github.com/PrismJS/prism/issues/2555)) [`a409245e`](https://github.com/PrismJS/prism/commit/a409245e)

### Other

- Tests: Added an option to accept the actual token stream ([#2515](https://github.com/PrismJS/prism/issues/2515)) [`bafab634`](https://github.com/PrismJS/prism/commit/bafab634)
- **Core**
    - Docs: Minor improvement ([#2513](https://github.com/PrismJS/prism/issues/2513)) [`206dc80f`](https://github.com/PrismJS/prism/commit/206dc80f)
- **Infrastructure**
    - JSDoc: Fixed line ends ([#2523](https://github.com/PrismJS/prism/issues/2523)) [`bf169e5f`](https://github.com/PrismJS/prism/commit/bf169e5f)
- **Website**
    - Website: Added new SB101 tutorial replacing the Crambler one ([#2576](https://github.com/PrismJS/prism/issues/2576)) [`655f985c`](https://github.com/PrismJS/prism/commit/655f985c)
    - Website: Fix typo on homepage by adding missing word add ([#2570](https://github.com/PrismJS/prism/issues/2570)) [`8ae6a4ba`](https://github.com/PrismJS/prism/commit/8ae6a4ba)
    - Custom class: Improved doc ([#2512](https://github.com/PrismJS/prism/issues/2512)) [`5ad6cb23`](https://github.com/PrismJS/prism/commit/5ad6cb23)

## 1.21.0 (2020-08-06)

### New components

- **.ignore** & **.gitignore** & **.hgignore** & **.npmignore** ([#2481](https://github.com/PrismJS/prism/issues/2481)) [`3fcce6fe`](https://github.com/PrismJS/prism/commit/3fcce6fe)
- **Agda** ([#2430](https://github.com/PrismJS/prism/issues/2430)) [`3a127c7d`](https://github.com/PrismJS/prism/commit/3a127c7d)
- **AL** ([#2300](https://github.com/PrismJS/prism/issues/2300)) [`de21eb64`](https://github.com/PrismJS/prism/commit/de21eb64)
- **Cypher** ([#2459](https://github.com/PrismJS/prism/issues/2459)) [`398e2943`](https://github.com/PrismJS/prism/commit/398e2943)
- **Dhall** ([#2473](https://github.com/PrismJS/prism/issues/2473)) [`649e51e5`](https://github.com/PrismJS/prism/commit/649e51e5)
- **EditorConfig** ([#2471](https://github.com/PrismJS/prism/issues/2471)) [`ed8fff91`](https://github.com/PrismJS/prism/commit/ed8fff91)
- **HLSL** ([#2318](https://github.com/PrismJS/prism/issues/2318)) [`87a5c7ae`](https://github.com/PrismJS/prism/commit/87a5c7ae)
- **JS stack trace** ([#2418](https://github.com/PrismJS/prism/issues/2418)) [`ae0327b3`](https://github.com/PrismJS/prism/commit/ae0327b3)
- **PeopleCode** ([#2302](https://github.com/PrismJS/prism/issues/2302)) [`bd4d8165`](https://github.com/PrismJS/prism/commit/bd4d8165)
- **PureBasic** ([#2369](https://github.com/PrismJS/prism/issues/2369)) [`d0c1c70d`](https://github.com/PrismJS/prism/commit/d0c1c70d)
- **Racket** ([#2315](https://github.com/PrismJS/prism/issues/2315)) [`053016ef`](https://github.com/PrismJS/prism/commit/053016ef)
- **Smali** ([#2419](https://github.com/PrismJS/prism/issues/2419)) [`22eb5cad`](https://github.com/PrismJS/prism/commit/22eb5cad)
- **Structured Text (IEC 61131-3)** ([#2311](https://github.com/PrismJS/prism/issues/2311)) [`8704cdfb`](https://github.com/PrismJS/prism/commit/8704cdfb)
- **UnrealScript** ([#2305](https://github.com/PrismJS/prism/issues/2305)) [`1093ceb3`](https://github.com/PrismJS/prism/commit/1093ceb3)
- **WarpScript** ([#2307](https://github.com/PrismJS/prism/issues/2307)) [`cde5b0fa`](https://github.com/PrismJS/prism/commit/cde5b0fa)
- **XML doc (.net)** ([#2340](https://github.com/PrismJS/prism/issues/2340)) [`caec5e30`](https://github.com/PrismJS/prism/commit/caec5e30)
- **YANG** ([#2467](https://github.com/PrismJS/prism/issues/2467)) [`ed1df1e1`](https://github.com/PrismJS/prism/commit/ed1df1e1)

### Updated components

- Markup & JSON: Added new aliases ([#2390](https://github.com/PrismJS/prism/issues/2390)) [`9782cfe6`](https://github.com/PrismJS/prism/commit/9782cfe6)
- Fixed several cases of exponential backtracking ([#2268](https://github.com/PrismJS/prism/issues/2268)) [`7a554b5f`](https://github.com/PrismJS/prism/commit/7a554b5f)
- **APL**
    - Added `⍥` ([#2409](https://github.com/PrismJS/prism/issues/2409)) [`0255cb6a`](https://github.com/PrismJS/prism/commit/0255cb6a)
- **AutoHotkey**
    - Added missing `format` built-in ([#2450](https://github.com/PrismJS/prism/issues/2450)) [`7c66cfc4`](https://github.com/PrismJS/prism/commit/7c66cfc4)
    - Improved comments and other improvements ([#2412](https://github.com/PrismJS/prism/issues/2412)) [`ddf3cc62`](https://github.com/PrismJS/prism/commit/ddf3cc62)
    - Added missing definitions ([#2400](https://github.com/PrismJS/prism/issues/2400)) [`4fe03676`](https://github.com/PrismJS/prism/commit/4fe03676)
- **Bash**
    - Added `composer` command ([#2298](https://github.com/PrismJS/prism/issues/2298)) [`044dd271`](https://github.com/PrismJS/prism/commit/044dd271)
- **Batch**
    - Fix escaped double quote ([#2485](https://github.com/PrismJS/prism/issues/2485)) [`f0f8210c`](https://github.com/PrismJS/prism/commit/f0f8210c)
- **C**
    - Improved macros and expressions ([#2440](https://github.com/PrismJS/prism/issues/2440)) [`8a72fa6f`](https://github.com/PrismJS/prism/commit/8a72fa6f)
    - Improved macros ([#2320](https://github.com/PrismJS/prism/issues/2320)) [`fdcf7ed2`](https://github.com/PrismJS/prism/commit/fdcf7ed2)
- **C#**
    - Improved pattern matching ([#2411](https://github.com/PrismJS/prism/issues/2411)) [`7f341fc1`](https://github.com/PrismJS/prism/commit/7f341fc1)
    - Fixed adjacent string interpolations ([#2402](https://github.com/PrismJS/prism/issues/2402)) [`2a2e79ed`](https://github.com/PrismJS/prism/commit/2a2e79ed)
- **C++**
    - Added support for default comparison operator ([#2426](https://github.com/PrismJS/prism/issues/2426)) [`8e9d161c`](https://github.com/PrismJS/prism/commit/8e9d161c)
    - Improved class name detection ([#2348](https://github.com/PrismJS/prism/issues/2348)) [`e3fe9040`](https://github.com/PrismJS/prism/commit/e3fe9040)
    - Fixed `enum class` class names ([#2342](https://github.com/PrismJS/prism/issues/2342)) [`30b4e254`](https://github.com/PrismJS/prism/commit/30b4e254)
- **Content-Security-Policy**
    - Fixed directives ([#2461](https://github.com/PrismJS/prism/issues/2461)) [`537a9e80`](https://github.com/PrismJS/prism/commit/537a9e80)
- **CSS**
    - Improved url and added keywords ([#2432](https://github.com/PrismJS/prism/issues/2432)) [`964de5a1`](https://github.com/PrismJS/prism/commit/964de5a1)
- **CSS Extras**
    - Optimized `class` and `id` patterns ([#2359](https://github.com/PrismJS/prism/issues/2359)) [`fdbc4473`](https://github.com/PrismJS/prism/commit/fdbc4473)
    - Renamed `attr-{name,value}` tokens and added tokens for combinators and selector lists ([#2373](https://github.com/PrismJS/prism/issues/2373)) [`e523f5d0`](https://github.com/PrismJS/prism/commit/e523f5d0)
- **Dart**
    - Added missing keywords ([#2355](https://github.com/PrismJS/prism/issues/2355)) [`4172ab6f`](https://github.com/PrismJS/prism/commit/4172ab6f)
- **Diff**
    - Added `prefix` token ([#2281](https://github.com/PrismJS/prism/issues/2281)) [`fd432a5b`](https://github.com/PrismJS/prism/commit/fd432a5b)
- **Docker**
    - Fixed strings inside comments ([#2428](https://github.com/PrismJS/prism/issues/2428)) [`37273a6f`](https://github.com/PrismJS/prism/commit/37273a6f)
- **EditorConfig**
    - Trim spaces before key and section title ([#2482](https://github.com/PrismJS/prism/issues/2482)) [`0c30c582`](https://github.com/PrismJS/prism/commit/0c30c582)
- **EJS**
    - Added `eta` alias ([#2282](https://github.com/PrismJS/prism/issues/2282)) [`0cfb6c5f`](https://github.com/PrismJS/prism/commit/0cfb6c5f)
- **GLSL**
    - Improvements ([#2321](https://github.com/PrismJS/prism/issues/2321)) [`33e49956`](https://github.com/PrismJS/prism/commit/33e49956)
- **GraphQL**
    - Added missing keywords ([#2407](https://github.com/PrismJS/prism/issues/2407)) [`de8ed16d`](https://github.com/PrismJS/prism/commit/de8ed16d)
    - Added support for multi-line strings and descriptions ([#2406](https://github.com/PrismJS/prism/issues/2406)) [`9e64c62e`](https://github.com/PrismJS/prism/commit/9e64c62e)
- **Io**
    - Fixed operator pattern ([#2365](https://github.com/PrismJS/prism/issues/2365)) [`d6055771`](https://github.com/PrismJS/prism/commit/d6055771)
- **Java**
    - Fixed `namespace` token ([#2295](https://github.com/PrismJS/prism/issues/2295)) [`62e184bb`](https://github.com/PrismJS/prism/commit/62e184bb)
- **JavaDoc**
    - Improvements ([#2324](https://github.com/PrismJS/prism/issues/2324)) [`032910ba`](https://github.com/PrismJS/prism/commit/032910ba)
- **JavaScript**
    - Improved regex detection ([#2465](https://github.com/PrismJS/prism/issues/2465)) [`4f55052f`](https://github.com/PrismJS/prism/commit/4f55052f)
    - Improved `get`/`set` and parameter detection ([#2387](https://github.com/PrismJS/prism/issues/2387)) [`ed715158`](https://github.com/PrismJS/prism/commit/ed715158)
    - Added support for logical assignment operators ([#2378](https://github.com/PrismJS/prism/issues/2378)) [`b28f21b7`](https://github.com/PrismJS/prism/commit/b28f21b7)
- **JSDoc**
    - Improvements ([#2466](https://github.com/PrismJS/prism/issues/2466)) [`2805ae35`](https://github.com/PrismJS/prism/commit/2805ae35)
- **JSON**
    - Greedy comments ([#2479](https://github.com/PrismJS/prism/issues/2479)) [`158caf52`](https://github.com/PrismJS/prism/commit/158caf52)
- **Julia**
    - Improved strings, comments, and other patterns ([#2363](https://github.com/PrismJS/prism/issues/2363)) [`81cf2344`](https://github.com/PrismJS/prism/commit/81cf2344)
- **Kotlin**
    - Added `kt` and `kts` aliases ([#2474](https://github.com/PrismJS/prism/issues/2474)) [`67f97e2e`](https://github.com/PrismJS/prism/commit/67f97e2e)
- **Markup**
    - Added tokens inside DOCTYPE ([#2349](https://github.com/PrismJS/prism/issues/2349)) [`9c7bc820`](https://github.com/PrismJS/prism/commit/9c7bc820)
    - Added `attr-equals` alias for the attribute `=` sign ([#2350](https://github.com/PrismJS/prism/issues/2350)) [`96a0116e`](https://github.com/PrismJS/prism/commit/96a0116e)
    - Added alias for named entities ([#2351](https://github.com/PrismJS/prism/issues/2351)) [`ab1e34ae`](https://github.com/PrismJS/prism/commit/ab1e34ae)
    - Added support for SSML ([#2306](https://github.com/PrismJS/prism/issues/2306)) [`eb70070d`](https://github.com/PrismJS/prism/commit/eb70070d)
- **Objective-C**
    - Added `objc` alias ([#2331](https://github.com/PrismJS/prism/issues/2331)) [`67c6b7af`](https://github.com/PrismJS/prism/commit/67c6b7af)
- **PowerShell**
    - New functions pattern bases on naming conventions ([#2301](https://github.com/PrismJS/prism/issues/2301)) [`fec39bcf`](https://github.com/PrismJS/prism/commit/fec39bcf)
- **Protocol Buffers**
    - Added support for RPC syntax ([#2414](https://github.com/PrismJS/prism/issues/2414)) [`939a17c4`](https://github.com/PrismJS/prism/commit/939a17c4)
- **Pug**
    - Improved class and id detection in tags ([#2358](https://github.com/PrismJS/prism/issues/2358)) [`7f948ecb`](https://github.com/PrismJS/prism/commit/7f948ecb)
- **Python**
    - Fixed empty multiline strings ([#2344](https://github.com/PrismJS/prism/issues/2344)) [`c9324476`](https://github.com/PrismJS/prism/commit/c9324476)
- **Regex**
    - Added aliases and minor improvements ([#2325](https://github.com/PrismJS/prism/issues/2325)) [`8a72830a`](https://github.com/PrismJS/prism/commit/8a72830a)
- **Ren'py**
    - Added `rpy` alias ([#2385](https://github.com/PrismJS/prism/issues/2385)) [`4935b5ca`](https://github.com/PrismJS/prism/commit/4935b5ca)
- **Ruby**
    - Optimized `regex` and `string` patterns ([#2354](https://github.com/PrismJS/prism/issues/2354)) [`b526e8c0`](https://github.com/PrismJS/prism/commit/b526e8c0)
- **Rust**
    - Improvements ([#2464](https://github.com/PrismJS/prism/issues/2464)) [`2ff40fe0`](https://github.com/PrismJS/prism/commit/2ff40fe0)
    - Improvements ([#2332](https://github.com/PrismJS/prism/issues/2332)) [`194c5429`](https://github.com/PrismJS/prism/commit/194c5429)
- **SAS**
    - Improved macro string functions ([#2463](https://github.com/PrismJS/prism/issues/2463)) [`278316ca`](https://github.com/PrismJS/prism/commit/278316ca)
    - Handle edge case of string macro functions ([#2451](https://github.com/PrismJS/prism/issues/2451)) [`a0a9f1ef`](https://github.com/PrismJS/prism/commit/a0a9f1ef)
    - Improved comments in `proc groovy` and `proc lua` ([#2392](https://github.com/PrismJS/prism/issues/2392)) [`475a5903`](https://github.com/PrismJS/prism/commit/475a5903)
- **Scheme**
    - Adjusted lookbehind for literals ([#2396](https://github.com/PrismJS/prism/issues/2396)) [`1e3f542b`](https://github.com/PrismJS/prism/commit/1e3f542b)
    - Improved lambda parameter ([#2346](https://github.com/PrismJS/prism/issues/2346)) [`1946918a`](https://github.com/PrismJS/prism/commit/1946918a)
    - Consistent lookaheads ([#2322](https://github.com/PrismJS/prism/issues/2322)) [`d2541d54`](https://github.com/PrismJS/prism/commit/d2541d54)
    - Improved boolean ([#2316](https://github.com/PrismJS/prism/issues/2316)) [`e27e65af`](https://github.com/PrismJS/prism/commit/e27e65af)
    - Added missing special keywords ([#2304](https://github.com/PrismJS/prism/issues/2304)) [`ac297ba5`](https://github.com/PrismJS/prism/commit/ac297ba5)
    - Improvements ([#2263](https://github.com/PrismJS/prism/issues/2263)) [`9a49f78f`](https://github.com/PrismJS/prism/commit/9a49f78f)
- **Solidity (Ethereum)**
    - Added `sol` alias ([#2382](https://github.com/PrismJS/prism/issues/2382)) [`6352213a`](https://github.com/PrismJS/prism/commit/6352213a)
- **SQL**
    - Added PostgreSQL `RETURNING` keyword ([#2476](https://github.com/PrismJS/prism/issues/2476)) [`bea7a585`](https://github.com/PrismJS/prism/commit/bea7a585)
- **Stylus**
    - Fixed comments breaking declarations + minor improvements ([#2372](https://github.com/PrismJS/prism/issues/2372)) [`6d663b6e`](https://github.com/PrismJS/prism/commit/6d663b6e)
    - New tokens and other improvements ([#2368](https://github.com/PrismJS/prism/issues/2368)) [`2c10ef8a`](https://github.com/PrismJS/prism/commit/2c10ef8a)
    - Fixed comments breaking strings and URLs ([#2361](https://github.com/PrismJS/prism/issues/2361)) [`0d65d6c9`](https://github.com/PrismJS/prism/commit/0d65d6c9)
- **T4 Text Templates (VB)**
    - Use the correct VB variant ([#2341](https://github.com/PrismJS/prism/issues/2341)) [`b6093339`](https://github.com/PrismJS/prism/commit/b6093339)
- **TypeScript**
    - Added `asserts` keyword and other improvements ([#2280](https://github.com/PrismJS/prism/issues/2280)) [`a197cfcd`](https://github.com/PrismJS/prism/commit/a197cfcd)
- **Visual Basic**
    - Added VBA alias ([#2469](https://github.com/PrismJS/prism/issues/2469)) [`78161d60`](https://github.com/PrismJS/prism/commit/78161d60)
    - Added `until` keyword ([#2423](https://github.com/PrismJS/prism/issues/2423)) [`a13ee8d9`](https://github.com/PrismJS/prism/commit/a13ee8d9)
    - Added missing keywords ([#2376](https://github.com/PrismJS/prism/issues/2376)) [`ba5ac1da`](https://github.com/PrismJS/prism/commit/ba5ac1da)

### Updated plugins

- File Highlight & JSONP Highlight update ([#1974](https://github.com/PrismJS/prism/issues/1974)) [`afea17d9`](https://github.com/PrismJS/prism/commit/afea17d9)
- Added general de/activation mechanism for plugins ([#2434](https://github.com/PrismJS/prism/issues/2434)) [`a36e96ab`](https://github.com/PrismJS/prism/commit/a36e96ab)
- **Autoloader**
    - Fixed bug breaking Autoloader ([#2449](https://github.com/PrismJS/prism/issues/2449)) [`a3416bf3`](https://github.com/PrismJS/prism/commit/a3416bf3)
    - Fixed `data-dependencies` and extensions ([#2326](https://github.com/PrismJS/prism/issues/2326)) [`1654b25f`](https://github.com/PrismJS/prism/commit/1654b25f)
    - Improved path detection and other minor improvements ([#2245](https://github.com/PrismJS/prism/issues/2245)) [`5cdc3251`](https://github.com/PrismJS/prism/commit/5cdc3251)
- **Command Line**
    - Some refactoring ([#2290](https://github.com/PrismJS/prism/issues/2290)) [`8c9c2896`](https://github.com/PrismJS/prism/commit/8c9c2896)
    - Correctly rehighlight elements ([#2291](https://github.com/PrismJS/prism/issues/2291)) [`e6b2c6fc`](https://github.com/PrismJS/prism/commit/e6b2c6fc)
- **Line Highlight**
    - Added linkable line numbers ([#2328](https://github.com/PrismJS/prism/issues/2328)) [`eb82e804`](https://github.com/PrismJS/prism/commit/eb82e804)
- **Line Numbers**
    - Improved resize performance ([#2125](https://github.com/PrismJS/prism/issues/2125)) [`b96ed225`](https://github.com/PrismJS/prism/commit/b96ed225)
    - Fixed TypeError when `lineNumberWrapper` is null ([#2337](https://github.com/PrismJS/prism/issues/2337)) [`4b61661d`](https://github.com/PrismJS/prism/commit/4b61661d)
    - Exposed `_resizeElement` function ([#2288](https://github.com/PrismJS/prism/issues/2288)) [`893f2a79`](https://github.com/PrismJS/prism/commit/893f2a79)
- **Previewers**
    - Fixed XSS ([#2506](https://github.com/PrismJS/prism/issues/2506)) [`8bba4880`](https://github.com/PrismJS/prism/commit/8bba4880)
- **Unescaped Markup**
    - No longer requires `Prism.languages.markup` ([#2444](https://github.com/PrismJS/prism/issues/2444)) [`af132dd3`](https://github.com/PrismJS/prism/commit/af132dd3)

### Updated themes

- **Coy**
    - Minor improvements ([#2176](https://github.com/PrismJS/prism/issues/2176)) [`7109c18c`](https://github.com/PrismJS/prism/commit/7109c18c)
- **Default**
    - Added a comment that declares the background color of `operator` tokens as intentional ([#2309](https://github.com/PrismJS/prism/issues/2309)) [`937e2691`](https://github.com/PrismJS/prism/commit/937e2691)
- **Okaidia**
    - Update comment text color to meet WCAG contrast recommendations to AA level ([#2292](https://github.com/PrismJS/prism/issues/2292)) [`06495f90`](https://github.com/PrismJS/prism/commit/06495f90)

### Other

- Changelog: Fixed v1.20.0 release date [`cb6349e2`](https://github.com/PrismJS/prism/commit/cb6349e2)
- **Core**
    - Fixed greedy matching bug ([#2032](https://github.com/PrismJS/prism/issues/2032)) [`40285203`](https://github.com/PrismJS/prism/commit/40285203)
    - Added JSDoc ([#1782](https://github.com/PrismJS/prism/issues/1782)) [`4ff555be`](https://github.com/PrismJS/prism/commit/4ff555be)
- **Infrastructure**
    - Update Git repo URL in package.json ([#2334](https://github.com/PrismJS/prism/issues/2334)) [`10f43275`](https://github.com/PrismJS/prism/commit/10f43275)
    - Added docs to ignore files ([#2437](https://github.com/PrismJS/prism/issues/2437)) [`05c9f20b`](https://github.com/PrismJS/prism/commit/05c9f20b)
    - Added `npm run build` command ([#2356](https://github.com/PrismJS/prism/issues/2356)) [`ff74a610`](https://github.com/PrismJS/prism/commit/ff74a610)
    - gulp: Improved `inlineRegexSource` ([#2296](https://github.com/PrismJS/prism/issues/2296)) [`abb800dd`](https://github.com/PrismJS/prism/commit/abb800dd)
    - gulp: Fixed language map ([#2283](https://github.com/PrismJS/prism/issues/2283)) [`11053193`](https://github.com/PrismJS/prism/commit/11053193)
    - gulp: Removed `premerge` task ([#2357](https://github.com/PrismJS/prism/issues/2357)) [`5ff7932b`](https://github.com/PrismJS/prism/commit/5ff7932b)
    - Tests are now faster ([#2165](https://github.com/PrismJS/prism/issues/2165)) [`e756be3f`](https://github.com/PrismJS/prism/commit/e756be3f)
    - Tests: Added extra newlines in pretty token streams ([#2070](https://github.com/PrismJS/prism/issues/2070)) [`681adeef`](https://github.com/PrismJS/prism/commit/681adeef)
    - Tests: Added test for identifier support across all languages ([#2371](https://github.com/PrismJS/prism/issues/2371)) [`48fac3b2`](https://github.com/PrismJS/prism/commit/48fac3b2)
    - Tests: Added test to sort the language list ([#2222](https://github.com/PrismJS/prism/issues/2222)) [`a3758728`](https://github.com/PrismJS/prism/commit/a3758728)
    - Tests: Always pretty-print token streams ([#2421](https://github.com/PrismJS/prism/issues/2421)) [`583e7eb5`](https://github.com/PrismJS/prism/commit/583e7eb5)
    - Tests: Always use `components.json` ([#2370](https://github.com/PrismJS/prism/issues/2370)) [`e416341f`](https://github.com/PrismJS/prism/commit/e416341f)
    - Tests: Better error messages for pattern tests ([#2364](https://github.com/PrismJS/prism/issues/2364)) [`10ca6433`](https://github.com/PrismJS/prism/commit/10ca6433)
    - Tests: Included `console` in VM context ([#2353](https://github.com/PrismJS/prism/issues/2353)) [`b4ed5ded`](https://github.com/PrismJS/prism/commit/b4ed5ded)
- **Website**
    - Fixed typos "Prims" ([#2455](https://github.com/PrismJS/prism/issues/2455)) [`dfa5498a`](https://github.com/PrismJS/prism/commit/dfa5498a)
    - New assets directory for all web-only files ([#2180](https://github.com/PrismJS/prism/issues/2180)) [`91fdd0b1`](https://github.com/PrismJS/prism/commit/91fdd0b1)
    - Improvements ([#2053](https://github.com/PrismJS/prism/issues/2053)) [`ce0fa227`](https://github.com/PrismJS/prism/commit/ce0fa227)
    - Fixed Treeview page ([#2484](https://github.com/PrismJS/prism/issues/2484)) [`a0efa40b`](https://github.com/PrismJS/prism/commit/a0efa40b)
    - Line Numbers: Fixed class name on website [`453079bf`](https://github.com/PrismJS/prism/commit/453079bf)
    - Line Numbers: Improved documentation ([#2456](https://github.com/PrismJS/prism/issues/2456)) [`447429f0`](https://github.com/PrismJS/prism/commit/447429f0)
    - Line Numbers: Style inline code on website ([#2435](https://github.com/PrismJS/prism/issues/2435)) [`ad9c13e2`](https://github.com/PrismJS/prism/commit/ad9c13e2)
    - Filter highlightAll: Fixed typo ([#2391](https://github.com/PrismJS/prism/issues/2391)) [`55bf7ec1`](https://github.com/PrismJS/prism/commit/55bf7ec1)

## 1.20.0 (2020-04-04)

### New components

- **Concurnas** ([#2206](https://github.com/PrismJS/prism/issues/2206)) [`b24f7348`](https://github.com/PrismJS/prism/commit/b24f7348)
- **DAX** ([#2248](https://github.com/PrismJS/prism/issues/2248)) [`9227853f`](https://github.com/PrismJS/prism/commit/9227853f)
- **Excel Formula** ([#2219](https://github.com/PrismJS/prism/issues/2219)) [`bf4f7bfa`](https://github.com/PrismJS/prism/commit/bf4f7bfa)
- **Factor** ([#2203](https://github.com/PrismJS/prism/issues/2203)) [`f941102e`](https://github.com/PrismJS/prism/commit/f941102e)
- **LLVM IR** ([#2221](https://github.com/PrismJS/prism/issues/2221)) [`43efde2e`](https://github.com/PrismJS/prism/commit/43efde2e)
- **PowerQuery** ([#2250](https://github.com/PrismJS/prism/issues/2250)) [`8119e57b`](https://github.com/PrismJS/prism/commit/8119e57b)
- **Solution file** ([#2213](https://github.com/PrismJS/prism/issues/2213)) [`15983d52`](https://github.com/PrismJS/prism/commit/15983d52)

### Updated components

- **Bash**
    - Added support for escaped quotes ([#2256](https://github.com/PrismJS/prism/issues/2256)) [`328d0e0e`](https://github.com/PrismJS/prism/commit/328d0e0e)
- **BBcode**
    - Added "shortcode" alias ([#2273](https://github.com/PrismJS/prism/issues/2273)) [`57eebced`](https://github.com/PrismJS/prism/commit/57eebced)
- **C/C++/OpenCL C**
    - Improvements ([#2196](https://github.com/PrismJS/prism/issues/2196)) [`674f4b35`](https://github.com/PrismJS/prism/commit/674f4b35)
- **C**
    - Improvemed `comment` pattern ([#2229](https://github.com/PrismJS/prism/issues/2229)) [`fa630726`](https://github.com/PrismJS/prism/commit/fa630726)
- **C#**
    - Fixed keywords in type lists blocking type names ([#2277](https://github.com/PrismJS/prism/issues/2277)) [`947a55bd`](https://github.com/PrismJS/prism/commit/947a55bd)
    - C# improvements ([#1444](https://github.com/PrismJS/prism/issues/1444)) [`42b15463`](https://github.com/PrismJS/prism/commit/42b15463)
- **C++**
    - Added C++20 keywords ([#2236](https://github.com/PrismJS/prism/issues/2236)) [`462ad57e`](https://github.com/PrismJS/prism/commit/462ad57e)
- **CSS**
    - Fixed `url()` containing "@" ([#2272](https://github.com/PrismJS/prism/issues/2272)) [`504a63ba`](https://github.com/PrismJS/prism/commit/504a63ba)
- **CSS Extras**
    - Added support for the selector function ([#2201](https://github.com/PrismJS/prism/issues/2201)) [`2e0eff76`](https://github.com/PrismJS/prism/commit/2e0eff76)
- **Elixir**
    - Added support for attributes names ending with `?` ([#2182](https://github.com/PrismJS/prism/issues/2182)) [`5450e24c`](https://github.com/PrismJS/prism/commit/5450e24c)
- **Java**
    - Added `record` keyword ([#2185](https://github.com/PrismJS/prism/issues/2185)) [`47910b5c`](https://github.com/PrismJS/prism/commit/47910b5c)
- **Markdown**
    - Added support for nested lists ([#2228](https://github.com/PrismJS/prism/issues/2228)) [`73c8a376`](https://github.com/PrismJS/prism/commit/73c8a376)
- **OpenCL**
    - Require C ([#2231](https://github.com/PrismJS/prism/issues/2231)) [`26626ded`](https://github.com/PrismJS/prism/commit/26626ded)
- **PHPDoc**
    - Fixed exponential backtracking ([#2198](https://github.com/PrismJS/prism/issues/2198)) [`3b42536e`](https://github.com/PrismJS/prism/commit/3b42536e)
- **Ruby**
    - Fixed exponential backtracking ([#2225](https://github.com/PrismJS/prism/issues/2225)) [`c5de5aa8`](https://github.com/PrismJS/prism/commit/c5de5aa8)
- **SAS**
    - Fixed SAS' "peerDependencies" ([#2230](https://github.com/PrismJS/prism/issues/2230)) [`7d8ff7ea`](https://github.com/PrismJS/prism/commit/7d8ff7ea)
- **Shell session**
    - Improvements ([#2208](https://github.com/PrismJS/prism/issues/2208)) [`bd16bd57`](https://github.com/PrismJS/prism/commit/bd16bd57)
- **Visual Basic**
    - Added support for comments with line continuations ([#2195](https://github.com/PrismJS/prism/issues/2195)) [`a7d67ca3`](https://github.com/PrismJS/prism/commit/a7d67ca3)
- **YAML**
    - Improvements ([#2226](https://github.com/PrismJS/prism/issues/2226)) [`5362ba16`](https://github.com/PrismJS/prism/commit/5362ba16)
    - Fixed highlighting of anchors and aliases ([#2217](https://github.com/PrismJS/prism/issues/2217)) [`6124c974`](https://github.com/PrismJS/prism/commit/6124c974)

### New plugins

- **Treeview** ([#2265](https://github.com/PrismJS/prism/issues/2265)) [`be909b18`](https://github.com/PrismJS/prism/commit/be909b18)

### Updated plugins

- **Inline Color**
    - Support for (semi-)transparent colors and minor improvements ([#2223](https://github.com/PrismJS/prism/issues/2223)) [`8d2c5a3e`](https://github.com/PrismJS/prism/commit/8d2c5a3e)
- **Keep Markup**
    - Remove self & document from IIFE arguments ([#2258](https://github.com/PrismJS/prism/issues/2258)) [`3c043338`](https://github.com/PrismJS/prism/commit/3c043338)
- **Toolbar**
    - `data-toolbar-order` is now inherited ([#2205](https://github.com/PrismJS/prism/issues/2205)) [`238f1163`](https://github.com/PrismJS/prism/commit/238f1163)

### Other

- Updated all `String.propotype.replace` calls for literal strings [`5d7aab56`](https://github.com/PrismJS/prism/commit/5d7aab56)
- **Core**
    - Linked list implementation for `matchGrammar` ([#1909](https://github.com/PrismJS/prism/issues/1909)) [`2d4c94cd`](https://github.com/PrismJS/prism/commit/2d4c94cd)
    - Faster `Token.stringify` ([#2171](https://github.com/PrismJS/prism/issues/2171)) [`f683972e`](https://github.com/PrismJS/prism/commit/f683972e)
    - Fixed scope problem in script mode ([#2184](https://github.com/PrismJS/prism/issues/2184)) [`984e5d2e`](https://github.com/PrismJS/prism/commit/984e5d2e)
- **Infrastructure**
    - Travis: Updated NodeJS versions ([#2246](https://github.com/PrismJS/prism/issues/2246)) [`e635260b`](https://github.com/PrismJS/prism/commit/e635260b)
    - gulp: Inline regex source improvement ([#2227](https://github.com/PrismJS/prism/issues/2227)) [`67afc5ad`](https://github.com/PrismJS/prism/commit/67afc5ad)
    - Tests: Added new pattern check for octal escapes ([#2189](https://github.com/PrismJS/prism/issues/2189)) [`81e1c3dd`](https://github.com/PrismJS/prism/commit/81e1c3dd)
    - Tests: Fixed optional dependencies in pattern tests ([#2242](https://github.com/PrismJS/prism/issues/2242)) [`1e3070a2`](https://github.com/PrismJS/prism/commit/1e3070a2)
    - Tests: Added test for zero-width lookbehinds ([#2220](https://github.com/PrismJS/prism/issues/2220)) [`7d03ece4`](https://github.com/PrismJS/prism/commit/7d03ece4)
    - Added tests for examples ([#2216](https://github.com/PrismJS/prism/issues/2216)) [`1f7a245c`](https://github.com/PrismJS/prism/commit/1f7a245c)
- **Website**
    - Removed invalid strings from C# example ([#2266](https://github.com/PrismJS/prism/issues/2266)) [`c917a8ca`](https://github.com/PrismJS/prism/commit/c917a8ca)
    - Fixed Diff highlight plugin page title ([#2233](https://github.com/PrismJS/prism/issues/2233)) [`a82770f8`](https://github.com/PrismJS/prism/commit/a82770f8)
    - Added link to `prism-liquibase` Bash language extension. ([#2191](https://github.com/PrismJS/prism/issues/2191)) [`0bf73dc7`](https://github.com/PrismJS/prism/commit/0bf73dc7)
    - Examples: Updated content header ([#2232](https://github.com/PrismJS/prism/issues/2232)) [`6232878b`](https://github.com/PrismJS/prism/commit/6232878b)
    - Website: Added Coy bug to the known failures page. ([#2170](https://github.com/PrismJS/prism/issues/2170)) [`e9dab85e`](https://github.com/PrismJS/prism/commit/e9dab85e)

## 1.19.0 (2020-01-13)

### New components

- **Latte** ([#2140](https://github.com/PrismJS/prism/issues/2140)) [`694a81b8`](https://github.com/PrismJS/prism/commit/694a81b8)
- **Neon** ([#2140](https://github.com/PrismJS/prism/issues/2140)) [`694a81b8`](https://github.com/PrismJS/prism/commit/694a81b8)
- **QML** ([#2139](https://github.com/PrismJS/prism/issues/2139)) [`c40d96c6`](https://github.com/PrismJS/prism/commit/c40d96c6)

### Updated components

- **Handlebars**
    - Added support for `:` and improved the `variable` pattern ([#2172](https://github.com/PrismJS/prism/issues/2172)) [`ef4d29d9`](https://github.com/PrismJS/prism/commit/ef4d29d9)
- **JavaScript**
    - Added support for keywords after a spread operator ([#2148](https://github.com/PrismJS/prism/issues/2148)) [`1f3f8929`](https://github.com/PrismJS/prism/commit/1f3f8929)
    - Better regex detection ([#2158](https://github.com/PrismJS/prism/issues/2158)) [`a23d8f84`](https://github.com/PrismJS/prism/commit/a23d8f84)
- **Markdown**
    - Better language detection for code blocks ([#2114](https://github.com/PrismJS/prism/issues/2114)) [`d7ad48f9`](https://github.com/PrismJS/prism/commit/d7ad48f9)
- **OCaml**
    - Improvements ([#2179](https://github.com/PrismJS/prism/issues/2179)) [`2a570fd4`](https://github.com/PrismJS/prism/commit/2a570fd4)
- **PHP**
    - Fixed exponential runtime of a pattern ([#2157](https://github.com/PrismJS/prism/issues/2157)) [`24c8f833`](https://github.com/PrismJS/prism/commit/24c8f833)
- **React JSX**
    - Improved spread operator in tag attributes ([#2159](https://github.com/PrismJS/prism/issues/2159)) [`fd857e7b`](https://github.com/PrismJS/prism/commit/fd857e7b)
    - Made `$` a valid character for attribute names ([#2144](https://github.com/PrismJS/prism/issues/2144)) [`f018cf04`](https://github.com/PrismJS/prism/commit/f018cf04)
- **Reason**
    - Added support for single line comments ([#2150](https://github.com/PrismJS/prism/issues/2150)) [`7f1c55b7`](https://github.com/PrismJS/prism/commit/7f1c55b7)
- **Ruby**
    - Override 'class-name' definition ([#2135](https://github.com/PrismJS/prism/issues/2135)) [`401d4b02`](https://github.com/PrismJS/prism/commit/401d4b02)
- **SAS**
    - Added CASL support ([#2112](https://github.com/PrismJS/prism/issues/2112)) [`99d979a0`](https://github.com/PrismJS/prism/commit/99d979a0)

### Updated plugins

- **Custom Class**
    - Fixed TypeError when mapper is undefined ([#2167](https://github.com/PrismJS/prism/issues/2167)) [`543f04d7`](https://github.com/PrismJS/prism/commit/543f04d7)

### Updated themes

- Added missing `.token` selector ([#2161](https://github.com/PrismJS/prism/issues/2161)) [`86780457`](https://github.com/PrismJS/prism/commit/86780457)

### Other

- Added a check for redundant dependency declarations ([#2142](https://github.com/PrismJS/prism/issues/2142)) [`a06aca06`](https://github.com/PrismJS/prism/commit/a06aca06)
- Added a check for examples ([#2128](https://github.com/PrismJS/prism/issues/2128)) [`0b539136`](https://github.com/PrismJS/prism/commit/0b539136)
- Added silent option to `loadLanguages` ([#2147](https://github.com/PrismJS/prism/issues/2147)) [`191b4116`](https://github.com/PrismJS/prism/commit/191b4116)
- **Infrastructure**
    - Dependencies: Improved `getLoader` ([#2151](https://github.com/PrismJS/prism/issues/2151)) [`199bdcae`](https://github.com/PrismJS/prism/commit/199bdcae)
    - Updated gulp to v4.0.2 ([#2178](https://github.com/PrismJS/prism/issues/2178)) [`e5678a00`](https://github.com/PrismJS/prism/commit/e5678a00)
- **Website**
    - Custom Class: Fixed examples ([#2160](https://github.com/PrismJS/prism/issues/2160)) [`0c2fe405`](https://github.com/PrismJS/prism/commit/0c2fe405)
    - Added documentation for new dependency API ([#2141](https://github.com/PrismJS/prism/issues/2141)) [`59068d67`](https://github.com/PrismJS/prism/commit/59068d67)

## 1.18.0 (2020-01-04)

### New components

- **ANTLR4** ([#2063](https://github.com/PrismJS/prism/issues/2063)) [`aaaa29a8`](https://github.com/PrismJS/prism/commit/aaaa29a8)
- **AQL** ([#2025](https://github.com/PrismJS/prism/issues/2025)) [`3fdb7d55`](https://github.com/PrismJS/prism/commit/3fdb7d55)
- **BBcode** ([#2095](https://github.com/PrismJS/prism/issues/2095)) [`aaf13aa6`](https://github.com/PrismJS/prism/commit/aaf13aa6)
- **BrightScript** ([#2096](https://github.com/PrismJS/prism/issues/2096)) [`631f1e34`](https://github.com/PrismJS/prism/commit/631f1e34)
- **Embedded Lua templating** ([#2050](https://github.com/PrismJS/prism/issues/2050)) [`0b771c90`](https://github.com/PrismJS/prism/commit/0b771c90)
- **Firestore security rules** ([#2010](https://github.com/PrismJS/prism/issues/2010)) [`9f722586`](https://github.com/PrismJS/prism/commit/9f722586)
- **FreeMarker Template Language** ([#2080](https://github.com/PrismJS/prism/issues/2080)) [`2f3da7e8`](https://github.com/PrismJS/prism/commit/2f3da7e8)
- **GDScript** ([#2006](https://github.com/PrismJS/prism/issues/2006)) [`e2b99f40`](https://github.com/PrismJS/prism/commit/e2b99f40)
- **MoonScript** ([#2100](https://github.com/PrismJS/prism/issues/2100)) [`f31946b3`](https://github.com/PrismJS/prism/commit/f31946b3)
- **Robot Framework** (only the plain text format) ([#2034](https://github.com/PrismJS/prism/issues/2034)) [`f7eaa618`](https://github.com/PrismJS/prism/commit/f7eaa618)
- **Solidity (Ethereum)** ([#2031](https://github.com/PrismJS/prism/issues/2031)) [`cc2cf3f7`](https://github.com/PrismJS/prism/commit/cc2cf3f7)
- **SPARQL** ([#2033](https://github.com/PrismJS/prism/issues/2033)) [`c42f877d`](https://github.com/PrismJS/prism/commit/c42f877d)
- **SQF: Status Quo Function (Arma 3)** ([#2079](https://github.com/PrismJS/prism/issues/2079)) [`cfac94ec`](https://github.com/PrismJS/prism/commit/cfac94ec)
- **Turtle** & **TriG** ([#2012](https://github.com/PrismJS/prism/issues/2012)) [`508d57ac`](https://github.com/PrismJS/prism/commit/508d57ac)
- **Zig** ([#2019](https://github.com/PrismJS/prism/issues/2019)) [`a7cf56b7`](https://github.com/PrismJS/prism/commit/a7cf56b7)

### Updated components

- Minor improvements for C-like and Clojure ([#2064](https://github.com/PrismJS/prism/issues/2064)) [`7db0cab3`](https://github.com/PrismJS/prism/commit/7db0cab3)
- Inlined some unnecessary rest properties ([#2082](https://github.com/PrismJS/prism/issues/2082)) [`ad3fa443`](https://github.com/PrismJS/prism/commit/ad3fa443)
- **AQL**
    - Disallow unclosed multiline comments again ([#2089](https://github.com/PrismJS/prism/issues/2089)) [`717ace02`](https://github.com/PrismJS/prism/commit/717ace02)
    - Allow unclosed multi-line comments ([#2058](https://github.com/PrismJS/prism/issues/2058)) [`f3c6ba59`](https://github.com/PrismJS/prism/commit/f3c6ba59)
    - More pseudo keywords ([#2055](https://github.com/PrismJS/prism/issues/2055)) [`899574eb`](https://github.com/PrismJS/prism/commit/899574eb)
    - Added missing keyword + minor improvements ([#2047](https://github.com/PrismJS/prism/issues/2047)) [`32a4c422`](https://github.com/PrismJS/prism/commit/32a4c422)
- **Clojure**
    - Added multiline strings (lisp style) ([#2061](https://github.com/PrismJS/prism/issues/2061)) [`8ea685b8`](https://github.com/PrismJS/prism/commit/8ea685b8)
- **CSS Extras**
    - CSS Extras & PHP: Fixed too greedy number token ([#2009](https://github.com/PrismJS/prism/issues/2009)) [`ebe363f4`](https://github.com/PrismJS/prism/commit/ebe363f4)
- **D**
    - Fixed strings ([#2029](https://github.com/PrismJS/prism/issues/2029)) [`010a0157`](https://github.com/PrismJS/prism/commit/010a0157)
- **Groovy**
    - Minor improvements ([#2036](https://github.com/PrismJS/prism/issues/2036)) [`fb618331`](https://github.com/PrismJS/prism/commit/fb618331)
- **Java**
    - Added missing `::` operator ([#2101](https://github.com/PrismJS/prism/issues/2101)) [`ee7fdbee`](https://github.com/PrismJS/prism/commit/ee7fdbee)
    - Added support for new Java 13 syntax ([#2060](https://github.com/PrismJS/prism/issues/2060)) [`a7b95dd3`](https://github.com/PrismJS/prism/commit/a7b95dd3)
- **JavaScript**
    - Added Optional Chaining and Nullish Coalescing ([#2084](https://github.com/PrismJS/prism/issues/2084)) [`fdb7de0d`](https://github.com/PrismJS/prism/commit/fdb7de0d)
    - Tokenize `:` as an operator ([#2073](https://github.com/PrismJS/prism/issues/2073)) [`0e5c48d1`](https://github.com/PrismJS/prism/commit/0e5c48d1)
- **Less**
    - Fixed exponential backtracking ([#2016](https://github.com/PrismJS/prism/issues/2016)) [`d03d19b4`](https://github.com/PrismJS/prism/commit/d03d19b4)
- **Markup**
    - Improved doctype pattern ([#2094](https://github.com/PrismJS/prism/issues/2094)) [`99994c58`](https://github.com/PrismJS/prism/commit/99994c58)
- **Python**
    - Fixed decorators ([#2018](https://github.com/PrismJS/prism/issues/2018)) [`5b8a16d9`](https://github.com/PrismJS/prism/commit/5b8a16d9)
- **Robot Framework**
    - Rename "robot-framework" to "robotframework" ([#2113](https://github.com/PrismJS/prism/issues/2113)) [`baa78774`](https://github.com/PrismJS/prism/commit/baa78774)
- **Ruby**
    - Made `true` and `false` booleans ([#2098](https://github.com/PrismJS/prism/issues/2098)) [`68d1c472`](https://github.com/PrismJS/prism/commit/68d1c472)
    - Added missing keywords ([#2097](https://github.com/PrismJS/prism/issues/2097)) [`f460eafc`](https://github.com/PrismJS/prism/commit/f460eafc)
- **SAS**
    - Added support for embedded Groovy and Lua code ([#2091](https://github.com/PrismJS/prism/issues/2091)) [`3640b3f2`](https://github.com/PrismJS/prism/commit/3640b3f2)
    - Minor improvements ([#2085](https://github.com/PrismJS/prism/issues/2085)) [`07020c7a`](https://github.com/PrismJS/prism/commit/07020c7a)
    - Fixed `proc-args` token by removing backreferences from string pattern ([#2013](https://github.com/PrismJS/prism/issues/2013)) [`af5a36ae`](https://github.com/PrismJS/prism/commit/af5a36ae)
    - Major improvements ([#1981](https://github.com/PrismJS/prism/issues/1981)) [`076f6155`](https://github.com/PrismJS/prism/commit/076f6155)
- **Smalltalk**
    - Fixed single quote character literal ([#2041](https://github.com/PrismJS/prism/issues/2041)) [`1aabcd17`](https://github.com/PrismJS/prism/commit/1aabcd17)
- **Turtle**
    - Minor improvements ([#2038](https://github.com/PrismJS/prism/issues/2038)) [`8ccd258b`](https://github.com/PrismJS/prism/commit/8ccd258b)
- **TypeScript**
    - Added missing keyword `undefined` ([#2088](https://github.com/PrismJS/prism/issues/2088)) [`c8b48b9f`](https://github.com/PrismJS/prism/commit/c8b48b9f)

### Updated plugins

- New Match Braces plugin ([#1944](https://github.com/PrismJS/prism/issues/1944)) [`365faade`](https://github.com/PrismJS/prism/commit/365faade)
- New Inline color plugin ([#2007](https://github.com/PrismJS/prism/issues/2007)) [`8403e453`](https://github.com/PrismJS/prism/commit/8403e453)
- New Filter highlightAll plugin ([#2074](https://github.com/PrismJS/prism/issues/2074)) [`a7f70090`](https://github.com/PrismJS/prism/commit/a7f70090)
- **Custom Class**
    - New class adder feature ([#2075](https://github.com/PrismJS/prism/issues/2075)) [`dab7998e`](https://github.com/PrismJS/prism/commit/dab7998e)
- **File Highlight**
    - Made the download button its own plugin ([#1840](https://github.com/PrismJS/prism/issues/1840)) [`c6c62a69`](https://github.com/PrismJS/prism/commit/c6c62a69)

### Other

- Issue template improvements ([#2069](https://github.com/PrismJS/prism/issues/2069)) [`53f07b1b`](https://github.com/PrismJS/prism/commit/53f07b1b)
- Readme: Links now use HTTPS if available ([#2045](https://github.com/PrismJS/prism/issues/2045)) [`6cd0738a`](https://github.com/PrismJS/prism/commit/6cd0738a)
- **Core**
    - Fixed null reference ([#2106](https://github.com/PrismJS/prism/issues/2106)) [`0fd062d5`](https://github.com/PrismJS/prism/commit/0fd062d5)
    - Fixed race condition caused by deferring the script ([#2103](https://github.com/PrismJS/prism/issues/2103)) [`a3785ec9`](https://github.com/PrismJS/prism/commit/a3785ec9)
    - Minor improvements ([#1973](https://github.com/PrismJS/prism/issues/1973)) [`2d858e0a`](https://github.com/PrismJS/prism/commit/2d858e0a)
    - Fixed greedy partial lookbehinds not working ([#2030](https://github.com/PrismJS/prism/issues/2030)) [`174ed103`](https://github.com/PrismJS/prism/commit/174ed103)
    - Fixed greedy targeting bug ([#1932](https://github.com/PrismJS/prism/issues/1932)) [`e864d518`](https://github.com/PrismJS/prism/commit/e864d518)
    - Doubly check the `manual` flag ([#1957](https://github.com/PrismJS/prism/issues/1957)) [`d49f0f26`](https://github.com/PrismJS/prism/commit/d49f0f26)
    - IE11 workaround for `currentScript` ([#2104](https://github.com/PrismJS/prism/issues/2104)) [`2108c60f`](https://github.com/PrismJS/prism/commit/2108c60f)
- **Infrastructure**
    - gulp: Fixed changes task [`2f495905`](https://github.com/PrismJS/prism/commit/2f495905)
    - npm: Added `.github` folder to npm ignore ([#2052](https://github.com/PrismJS/prism/issues/2052)) [`1af89e06`](https://github.com/PrismJS/prism/commit/1af89e06)
    - npm: Updated dependencies to fix 122 vulnerabilities ([#1997](https://github.com/PrismJS/prism/issues/1997)) [`3af5d744`](https://github.com/PrismJS/prism/commit/3af5d744)
    - Tests: New test for unused capturing groups ([#1996](https://github.com/PrismJS/prism/issues/1996)) [`c187e229`](https://github.com/PrismJS/prism/commit/c187e229)
    - Tests: Simplified error message format ([#2056](https://github.com/PrismJS/prism/issues/2056)) [`007c9af4`](https://github.com/PrismJS/prism/commit/007c9af4)
    - Tests: New test for nice names ([#1911](https://github.com/PrismJS/prism/issues/1911)) [`3fda5c95`](https://github.com/PrismJS/prism/commit/3fda5c95)
    - Standardized dependency logic implementation ([#1998](https://github.com/PrismJS/prism/issues/1998)) [`7a4a0c7c`](https://github.com/PrismJS/prism/commit/7a4a0c7c)
- **Website**
    - Added @mAAdhaTTah and @RunDevelopment to credits and footer [`5d07aa7c`](https://github.com/PrismJS/prism/commit/5d07aa7c)
    - Added plugin descriptions to plugin list ([#2076](https://github.com/PrismJS/prism/issues/2076)) [`cdfa60ac`](https://github.com/PrismJS/prism/commit/cdfa60ac)
    - Use HTTPS link to alistapart.com ([#2044](https://github.com/PrismJS/prism/issues/2044)) [`8bcc1b85`](https://github.com/PrismJS/prism/commit/8bcc1b85)
    - Fixed the Toolbar plugin's overflow issue ([#1966](https://github.com/PrismJS/prism/issues/1966)) [`56a8711c`](https://github.com/PrismJS/prism/commit/56a8711c)
    - FAQ update ([#1977](https://github.com/PrismJS/prism/issues/1977)) [`8a572af5`](https://github.com/PrismJS/prism/commit/8a572af5)
    - Use modern JavaScript in the NodeJS usage section ([#1942](https://github.com/PrismJS/prism/issues/1942)) [`5c68a556`](https://github.com/PrismJS/prism/commit/5c68a556)
    - Improved test page performance for Chromium ([#2020](https://github.com/PrismJS/prism/issues/2020)) [`3509f3e5`](https://github.com/PrismJS/prism/commit/3509f3e5)
    - Fixed alias example in extending page ([#2011](https://github.com/PrismJS/prism/issues/2011)) [`7cb65eec`](https://github.com/PrismJS/prism/commit/7cb65eec)
    - Robot Framework: Renamed example file ([#2126](https://github.com/PrismJS/prism/issues/2126)) [`9908ca69`](https://github.com/PrismJS/prism/commit/9908ca69)

## 1.17.1 (2019-07-21)

### Other

- **Infrastructure**
    - Add .DS_Store to npmignore [`c2229ec2`](https://github.com/PrismJS/prism/commit/c2229ec2)

## 1.17.0 (2019-07-21)

### New components

- **DNS zone file** ([#1961](https://github.com/PrismJS/prism/issues/1961)) [`bb84f98c`](https://github.com/PrismJS/prism/commit/bb84f98c)
- **JQ** ([#1896](https://github.com/PrismJS/prism/issues/1896)) [`73d964be`](https://github.com/PrismJS/prism/commit/73d964be)
- **JS Templates**: Syntax highlighting inside tagged template literals ([#1931](https://github.com/PrismJS/prism/issues/1931)) [`c8844286`](https://github.com/PrismJS/prism/commit/c8844286)
- **LilyPond** ([#1967](https://github.com/PrismJS/prism/issues/1967)) [`5d992fc5`](https://github.com/PrismJS/prism/commit/5d992fc5)
- **PascaLIGO** ([#1947](https://github.com/PrismJS/prism/issues/1947)) [`858201c7`](https://github.com/PrismJS/prism/commit/858201c7)
- **PC-Axis** ([#1940](https://github.com/PrismJS/prism/issues/1940)) [`473f7fbd`](https://github.com/PrismJS/prism/commit/473f7fbd)
- **Shell session** ([#1892](https://github.com/PrismJS/prism/issues/1892)) [`96044979`](https://github.com/PrismJS/prism/commit/96044979)
- **Splunk SPL** ([#1962](https://github.com/PrismJS/prism/issues/1962)) [`c93c066b`](https://github.com/PrismJS/prism/commit/c93c066b)

### New plugins

- **Diff Highlight**: Syntax highlighting inside diff blocks ([#1889](https://github.com/PrismJS/prism/issues/1889)) [`e7702ae1`](https://github.com/PrismJS/prism/commit/e7702ae1)

### Updated components

- **Bash**
    - Major improvements ([#1443](https://github.com/PrismJS/prism/issues/1443)) [`363281b3`](https://github.com/PrismJS/prism/commit/363281b3)
- **C#**
    - Added `cs` alias ([#1899](https://github.com/PrismJS/prism/issues/1899)) [`a8164559`](https://github.com/PrismJS/prism/commit/a8164559)
- **C++**
    - Fixed number pattern ([#1887](https://github.com/PrismJS/prism/issues/1887)) [`3de29e72`](https://github.com/PrismJS/prism/commit/3de29e72)
- **CSS**
    - Extended `url` inside ([#1874](https://github.com/PrismJS/prism/issues/1874)) [`f0a10669`](https://github.com/PrismJS/prism/commit/f0a10669)
    - Removed unnecessary flag and modifier ([#1875](https://github.com/PrismJS/prism/issues/1875)) [`74050c68`](https://github.com/PrismJS/prism/commit/74050c68)
- **CSS Extras**
    - Added `even` & `odd` keywords to `n-th` pattern ([#1872](https://github.com/PrismJS/prism/issues/1872)) [`5e5a3e00`](https://github.com/PrismJS/prism/commit/5e5a3e00)
- **F#**
    - Improved character literals ([#1956](https://github.com/PrismJS/prism/issues/1956)) [`d58d2aeb`](https://github.com/PrismJS/prism/commit/d58d2aeb)
- **JavaScript**
    - Fixed escaped template interpolation ([#1931](https://github.com/PrismJS/prism/issues/1931)) [`c8844286`](https://github.com/PrismJS/prism/commit/c8844286)
    - Added support for private fields ([#1950](https://github.com/PrismJS/prism/issues/1950)) [`7bd08327`](https://github.com/PrismJS/prism/commit/7bd08327)
    - Added support for numeric separators ([#1895](https://github.com/PrismJS/prism/issues/1895)) [`6068bf18`](https://github.com/PrismJS/prism/commit/6068bf18)
    - Increased bracket count of interpolation expressions in template strings ([#1845](https://github.com/PrismJS/prism/issues/1845)) [`c13d6e7d`](https://github.com/PrismJS/prism/commit/c13d6e7d)
    - Added support for the `s` regex flag ([#1846](https://github.com/PrismJS/prism/issues/1846)) [`9e164935`](https://github.com/PrismJS/prism/commit/9e164935)
    - Formatting: Added missing semicolon ([#1856](https://github.com/PrismJS/prism/issues/1856)) [`e2683959`](https://github.com/PrismJS/prism/commit/e2683959)
- **JSON**
    - Kinda fixed comment issue ([#1853](https://github.com/PrismJS/prism/issues/1853)) [`cbe05ec3`](https://github.com/PrismJS/prism/commit/cbe05ec3)
- **Julia**
    - Added `struct` keyword ([#1941](https://github.com/PrismJS/prism/issues/1941)) [`feb1b6f5`](https://github.com/PrismJS/prism/commit/feb1b6f5)
    - Highlight `Inf` and `NaN` as constants ([#1921](https://github.com/PrismJS/prism/issues/1921)) [`2141129f`](https://github.com/PrismJS/prism/commit/2141129f)
    - Added `in` keyword ([#1918](https://github.com/PrismJS/prism/issues/1918)) [`feb3187f`](https://github.com/PrismJS/prism/commit/feb3187f)
- **LaTeX**
    - Added TeX and ConTeXt alias ([#1915](https://github.com/PrismJS/prism/issues/1915)) [`5ad58a75`](https://github.com/PrismJS/prism/commit/5ad58a75)
    - Added support for $$ equations [`6f53f749`](https://github.com/PrismJS/prism/commit/6f53f749)
- **Markdown**
    - Markdown: Added support for auto-loading code block languages ([#1898](https://github.com/PrismJS/prism/issues/1898)) [`05823e88`](https://github.com/PrismJS/prism/commit/05823e88)
    - Improved URLs ([#1955](https://github.com/PrismJS/prism/issues/1955)) [`b9ec6fd8`](https://github.com/PrismJS/prism/commit/b9ec6fd8)
    - Added support for nested bold and italic expressions ([#1897](https://github.com/PrismJS/prism/issues/1897)) [`11903721`](https://github.com/PrismJS/prism/commit/11903721)
    - Added support for tables ([#1848](https://github.com/PrismJS/prism/issues/1848)) [`cedb8e84`](https://github.com/PrismJS/prism/commit/cedb8e84)
- **Perl**
    - Added `return` keyword ([#1943](https://github.com/PrismJS/prism/issues/1943)) [`2f39de97`](https://github.com/PrismJS/prism/commit/2f39de97)
- **Protocol Buffers**
    - Full support for PB2 and PB3 syntax + numerous other improvements ([#1948](https://github.com/PrismJS/prism/issues/1948)) [`de10bd1d`](https://github.com/PrismJS/prism/commit/de10bd1d)
- **reST (reStructuredText)**
    - Fixed exponentially backtracking pattern ([#1986](https://github.com/PrismJS/prism/issues/1986)) [`8b5d67a3`](https://github.com/PrismJS/prism/commit/8b5d67a3)
- **Rust**
    - Added `async` and `await` keywords. ([#1882](https://github.com/PrismJS/prism/issues/1882)) [`4faa3314`](https://github.com/PrismJS/prism/commit/4faa3314)
    - Improved punctuation and operators ([#1839](https://github.com/PrismJS/prism/issues/1839)) [`a42b1557`](https://github.com/PrismJS/prism/commit/a42b1557)
- **Sass (Scss)**
    - Fixed exponential url pattern ([#1938](https://github.com/PrismJS/prism/issues/1938)) [`4b6b6e8b`](https://github.com/PrismJS/prism/commit/4b6b6e8b)
- **Scheme**
    - Added support for rational number literals ([#1964](https://github.com/PrismJS/prism/issues/1964)) [`e8811d22`](https://github.com/PrismJS/prism/commit/e8811d22)
- **TOML**
    - Minor improvements ([#1917](https://github.com/PrismJS/prism/issues/1917)) [`3e181241`](https://github.com/PrismJS/prism/commit/3e181241)
- **Visual Basic**
    - Added support for interpolation strings ([#1971](https://github.com/PrismJS/prism/issues/1971)) [`4a2c90c1`](https://github.com/PrismJS/prism/commit/4a2c90c1)

### Updated plugins

- **Autolinker**
    - Improved component path guessing ([#1928](https://github.com/PrismJS/prism/issues/1928)) [`452d5c7d`](https://github.com/PrismJS/prism/commit/452d5c7d)
    - Improved URL regex ([#1842](https://github.com/PrismJS/prism/issues/1842)) [`eb28b62b`](https://github.com/PrismJS/prism/commit/eb28b62b)
- **Autoloader**
    - Fixed and improved callbacks ([#1935](https://github.com/PrismJS/prism/issues/1935)) [`b19f512f`](https://github.com/PrismJS/prism/commit/b19f512f)
- **Command Line**
    - Fix for uncaught errors for empty 'commandLine' object. ([#1862](https://github.com/PrismJS/prism/issues/1862)) [`c24831b5`](https://github.com/PrismJS/prism/commit/c24831b5)
- **Copy to Clipboard Button**
    - Switch anchor to button ([#1926](https://github.com/PrismJS/prism/issues/1926)) [`79880197`](https://github.com/PrismJS/prism/commit/79880197)
- **Custom Class**
    - Added mapper functions for language specific transformations ([#1873](https://github.com/PrismJS/prism/issues/1873)) [`acceb3b5`](https://github.com/PrismJS/prism/commit/acceb3b5)
- **Line Highlight**
    - Batching DOM read/writes to avoid reflows ([#1865](https://github.com/PrismJS/prism/issues/1865)) [`632ce00c`](https://github.com/PrismJS/prism/commit/632ce00c)
- **Toolbar**
    - Added `className` option for toolbar items ([#1951](https://github.com/PrismJS/prism/issues/1951)) [`5ab28bbe`](https://github.com/PrismJS/prism/commit/5ab28bbe)
    - Set opacity to 1 when focus is within ([#1927](https://github.com/PrismJS/prism/issues/1927)) [`0b1662dd`](https://github.com/PrismJS/prism/commit/0b1662dd)

### Updated themes

- **Funky**
    - Fixed typo ([#1960](https://github.com/PrismJS/prism/issues/1960)) [`7d056591`](https://github.com/PrismJS/prism/commit/7d056591)

### Other

- README: Added npm downloads badge ([#1934](https://github.com/PrismJS/prism/issues/1934)) [`d673d701`](https://github.com/PrismJS/prism/commit/d673d701)
- README: Minor changes ([#1857](https://github.com/PrismJS/prism/issues/1857)) [`77e403cb`](https://github.com/PrismJS/prism/commit/77e403cb)
- Clearer description for the highlighting bug report template ([#1850](https://github.com/PrismJS/prism/issues/1850)) [`2f9c9261`](https://github.com/PrismJS/prism/commit/2f9c9261)
- More language examples ([#1917](https://github.com/PrismJS/prism/issues/1917)) [`3e181241`](https://github.com/PrismJS/prism/commit/3e181241)
- **Core**
    - Removed `env.elements` from `before-highlightall` hook ([#1968](https://github.com/PrismJS/prism/issues/1968)) [`9d9e2ca4`](https://github.com/PrismJS/prism/commit/9d9e2ca4)
    - Made `language-none` the default language ([#1858](https://github.com/PrismJS/prism/issues/1858)) [`fd691c52`](https://github.com/PrismJS/prism/commit/fd691c52)
    - Removed `parent` from the `wrap` hook's environment ([#1837](https://github.com/PrismJS/prism/issues/1837)) [`65a4e894`](https://github.com/PrismJS/prism/commit/65a4e894)
- **Infrastructure**
    - gulp: Split `gulpfile.js` and expanded `changes` task ([#1835](https://github.com/PrismJS/prism/issues/1835)) [`033c5ad8`](https://github.com/PrismJS/prism/commit/033c5ad8)
    - gulp: JSON formatting for partly generated files ([#1933](https://github.com/PrismJS/prism/issues/1933)) [`d4373f3a`](https://github.com/PrismJS/prism/commit/d4373f3a)
    - gulp: Use `async` functions & drop testing on Node v6 ([#1783](https://github.com/PrismJS/prism/issues/1783)) [`0dd44d53`](https://github.com/PrismJS/prism/commit/0dd44d53)
    - Tests: `lookbehind` test for patterns ([#1890](https://github.com/PrismJS/prism/issues/1890)) [`3ba786cd`](https://github.com/PrismJS/prism/commit/3ba786cd)
    - Tests: Added test for empty regexes ([#1847](https://github.com/PrismJS/prism/issues/1847)) [`c1e6a7fd`](https://github.com/PrismJS/prism/commit/c1e6a7fd)
- **Website**
    - Added tutorial for using PrismJS with React ([#1979](https://github.com/PrismJS/prism/issues/1979)) [`f1e16c7b`](https://github.com/PrismJS/prism/commit/f1e16c7b)
    - Update footer's GitHub repository URL and capitalisation of "GitHub" ([#1983](https://github.com/PrismJS/prism/issues/1983)) [`bab744a6`](https://github.com/PrismJS/prism/commit/bab744a6)
    - Added known failures page ([#1876](https://github.com/PrismJS/prism/issues/1876)) [`36a5fa0e`](https://github.com/PrismJS/prism/commit/36a5fa0e)
    - Added basic usage for CDNs ([#1924](https://github.com/PrismJS/prism/issues/1924)) [`922ec555`](https://github.com/PrismJS/prism/commit/922ec555)
    - New tutorial for Drupal ([#1859](https://github.com/PrismJS/prism/issues/1859)) [`d2089d83`](https://github.com/PrismJS/prism/commit/d2089d83)
    - Updated website page styles to not interfere with themes ([#1952](https://github.com/PrismJS/prism/issues/1952)) [`b6543853`](https://github.com/PrismJS/prism/commit/b6543853)
    - Download page: Improved performance for Chromium-based browsers ([#1907](https://github.com/PrismJS/prism/issues/1907)) [`11f18e36`](https://github.com/PrismJS/prism/commit/11f18e36)
    - Download page: Fixed Edge's word wrap ([#1920](https://github.com/PrismJS/prism/issues/1920)) [`5d191b92`](https://github.com/PrismJS/prism/commit/5d191b92)
    - Examples page: Minor improvements ([#1919](https://github.com/PrismJS/prism/issues/1919)) [`a16d4a25`](https://github.com/PrismJS/prism/commit/a16d4a25)
    - Extending page: Fixed typo + new alias section ([#1949](https://github.com/PrismJS/prism/issues/1949)) [`24c8e717`](https://github.com/PrismJS/prism/commit/24c8e717)
    - Extending page: Added "Creating a new language definition" section ([#1925](https://github.com/PrismJS/prism/issues/1925)) [`ddf81233`](https://github.com/PrismJS/prism/commit/ddf81233)
    - Test page: Use `prism-core.js` instead of `prism.js` ([#1908](https://github.com/PrismJS/prism/issues/1908)) [`0853e694`](https://github.com/PrismJS/prism/commit/0853e694)
    - Copy to clipboard: Fixed typo ([#1869](https://github.com/PrismJS/prism/issues/1869)) [`59d4323f`](https://github.com/PrismJS/prism/commit/59d4323f)
    - JSONP Highlight: Fixed examples ([#1877](https://github.com/PrismJS/prism/issues/1877)) [`f8ae465d`](https://github.com/PrismJS/prism/commit/f8ae465d)
    - Line numbers: Fixed typo on webpage ([#1838](https://github.com/PrismJS/prism/issues/1838)) [`0f16eb87`](https://github.com/PrismJS/prism/commit/0f16eb87)

## 1.16.0 (2019-03-24)

### New components

- **ANBF** ([#1753](https://github.com/PrismJS/prism/issues/1753)) [`6d98f0e7`](https://github.com/PrismJS/prism/commit/6d98f0e7)
- **BNF** & **RBNF** ([#1754](https://github.com/PrismJS/prism/issues/1754)) [`1df96c55`](https://github.com/PrismJS/prism/commit/1df96c55)
- **CIL** ([#1593](https://github.com/PrismJS/prism/issues/1593)) [`38def334`](https://github.com/PrismJS/prism/commit/38def334)
- **CMake** ([#1820](https://github.com/PrismJS/prism/issues/1820)) [`30779976`](https://github.com/PrismJS/prism/commit/30779976)
- **Doc comment** ([#1541](https://github.com/PrismJS/prism/issues/1541)) [`493d19ef`](https://github.com/PrismJS/prism/commit/493d19ef)
- **EBNF** ([#1756](https://github.com/PrismJS/prism/issues/1756)) [`13e1c97d`](https://github.com/PrismJS/prism/commit/13e1c97d)
- **EJS** ([#1769](https://github.com/PrismJS/prism/issues/1769)) [`c37c90df`](https://github.com/PrismJS/prism/commit/c37c90df)
- **G-code** ([#1572](https://github.com/PrismJS/prism/issues/1572)) [`2288c25e`](https://github.com/PrismJS/prism/commit/2288c25e)
- **GameMaker Language** ([#1551](https://github.com/PrismJS/prism/issues/1551)) [`e529edd8`](https://github.com/PrismJS/prism/commit/e529edd8)
- **HCL** ([#1594](https://github.com/PrismJS/prism/issues/1594)) [`c939df8e`](https://github.com/PrismJS/prism/commit/c939df8e)
- **Java stack trace** ([#1520](https://github.com/PrismJS/prism/issues/1520)) [`4a8219a4`](https://github.com/PrismJS/prism/commit/4a8219a4)
- **JavaScript Extras** ([#1743](https://github.com/PrismJS/prism/issues/1743)) [`bb628606`](https://github.com/PrismJS/prism/commit/bb628606)
- **JSON5** ([#1744](https://github.com/PrismJS/prism/issues/1744)) [`64dc049d`](https://github.com/PrismJS/prism/commit/64dc049d)
- **N1QL** ([#1620](https://github.com/PrismJS/prism/issues/1620)) [`7def8f5c`](https://github.com/PrismJS/prism/commit/7def8f5c)
- **Nand To Tetris HDL** ([#1710](https://github.com/PrismJS/prism/issues/1710)) [`b94b56c1`](https://github.com/PrismJS/prism/commit/b94b56c1)
- **Regex** ([#1682](https://github.com/PrismJS/prism/issues/1682)) [`571704cb`](https://github.com/PrismJS/prism/commit/571704cb)
- **T4** ([#1699](https://github.com/PrismJS/prism/issues/1699)) [`16f2ad06`](https://github.com/PrismJS/prism/commit/16f2ad06)
- **TOML** ([#1488](https://github.com/PrismJS/prism/issues/1488)) [`5b6ad70d`](https://github.com/PrismJS/prism/commit/5b6ad70d)
- **Vala** ([#1658](https://github.com/PrismJS/prism/issues/1658)) [`b48c012c`](https://github.com/PrismJS/prism/commit/b48c012c)

### Updated components

- Fixed dependencies of Pug and Pure ([#1759](https://github.com/PrismJS/prism/issues/1759)) [`c9a32674`](https://github.com/PrismJS/prism/commit/c9a32674)
- Add file extensions support for major languages ([#1478](https://github.com/PrismJS/prism/issues/1478)) [`0c8f6504`](https://github.com/PrismJS/prism/commit/0c8f6504)
- Fixed patterns which can match the empty string ([#1775](https://github.com/PrismJS/prism/issues/1775)) [`86dd3e42`](https://github.com/PrismJS/prism/commit/86dd3e42)
- More variables for better code compression ([#1489](https://github.com/PrismJS/prism/issues/1489)) [`bc53e093`](https://github.com/PrismJS/prism/commit/bc53e093)
- Added missing aliases ([#1830](https://github.com/PrismJS/prism/issues/1830)) [`8d28c74c`](https://github.com/PrismJS/prism/commit/8d28c74c)
- Replaced all occurrences of `new RegExp` with `RegExp` ([#1493](https://github.com/PrismJS/prism/issues/1493)) [`44fed4d3`](https://github.com/PrismJS/prism/commit/44fed4d3)
- Added missing aliases to components.json ([#1503](https://github.com/PrismJS/prism/issues/1503)) [`2fb66e04`](https://github.com/PrismJS/prism/commit/2fb66e04)
- **Apacheconf**
    - Apache config: Minor improvements + new keyword ([#1823](https://github.com/PrismJS/prism/issues/1823)) [`a91be7b2`](https://github.com/PrismJS/prism/commit/a91be7b2)
- **AsciiDoc**
    - Added `adoc` alias for AsciiDoc ([#1685](https://github.com/PrismJS/prism/issues/1685)) [`88434f7a`](https://github.com/PrismJS/prism/commit/88434f7a)
- **Bash**
    - Add additional commands to bash ([#1577](https://github.com/PrismJS/prism/issues/1577)) [`a2230c38`](https://github.com/PrismJS/prism/commit/a2230c38)
    - Added `yarn add` to bash functions ([#1731](https://github.com/PrismJS/prism/issues/1731)) [`3a32cb75`](https://github.com/PrismJS/prism/commit/3a32cb75)
    - Added `pnpm` function to Bash ([#1734](https://github.com/PrismJS/prism/issues/1734)) [`fccfb98d`](https://github.com/PrismJS/prism/commit/fccfb98d)
- **Batch**
    - Remove batch's shell alias ([#1543](https://github.com/PrismJS/prism/issues/1543)) [`7155e60f`](https://github.com/PrismJS/prism/commit/7155e60f)
- **C**
    - Improve C language ([#1697](https://github.com/PrismJS/prism/issues/1697)) [`7eccea5c`](https://github.com/PrismJS/prism/commit/7eccea5c)
- **C-like**
    - Simplify function pattern of C-like language ([#1552](https://github.com/PrismJS/prism/issues/1552)) [`b520e1b6`](https://github.com/PrismJS/prism/commit/b520e1b6)
- **C/C++/Java**
    - Operator fixes ([#1528](https://github.com/PrismJS/prism/issues/1528)) [`7af8f8be`](https://github.com/PrismJS/prism/commit/7af8f8be)
- **C#**
    - Improvements to C# operator and punctuation ([#1532](https://github.com/PrismJS/prism/issues/1532)) [`3b1e0916`](https://github.com/PrismJS/prism/commit/3b1e0916)
- **CSS**
    - Fix tokenizing !important ([#1585](https://github.com/PrismJS/prism/issues/1585)) [`c1d6cb85`](https://github.com/PrismJS/prism/commit/c1d6cb85)
    - Added the comma to the list of CSS punctuation [`7ea2ff28`](https://github.com/PrismJS/prism/commit/7ea2ff28)
    - CSS: Comma punctuation ([#1632](https://github.com/PrismJS/prism/issues/1632)) [`1b812386`](https://github.com/PrismJS/prism/commit/1b812386)
    - Reuse CSS selector pattern in CSS Extras ([#1637](https://github.com/PrismJS/prism/issues/1637)) [`e2f2fd19`](https://github.com/PrismJS/prism/commit/e2f2fd19)
    - Fixed CSS extra variable ([#1649](https://github.com/PrismJS/prism/issues/1649)) [`9de47d3a`](https://github.com/PrismJS/prism/commit/9de47d3a)
    - Identify CSS units and variables ([#1450](https://github.com/PrismJS/prism/issues/1450)) [`5fcee966`](https://github.com/PrismJS/prism/commit/5fcee966)
    - Allow multiline CSS at-rules ([#1676](https://github.com/PrismJS/prism/issues/1676)) [`4f6f3c7d`](https://github.com/PrismJS/prism/commit/4f6f3c7d)
    - CSS: Highlight attribute selector ([#1671](https://github.com/PrismJS/prism/issues/1671)) [`245b59d4`](https://github.com/PrismJS/prism/commit/245b59d4)
    - CSS: Selectors can contain any string ([#1638](https://github.com/PrismJS/prism/issues/1638)) [`a2d445d0`](https://github.com/PrismJS/prism/commit/a2d445d0)
    - CSS extras: Highlighting for pseudo class arguments ([#1650](https://github.com/PrismJS/prism/issues/1650)) [`70a40414`](https://github.com/PrismJS/prism/commit/70a40414)
- **Django**
    - Django/Jinja2 improvements ([#1800](https://github.com/PrismJS/prism/issues/1800)) [`f2467488`](https://github.com/PrismJS/prism/commit/f2467488)
- **F#**
    - Chars can only contain one character ([#1570](https://github.com/PrismJS/prism/issues/1570)) [`f96b083a`](https://github.com/PrismJS/prism/commit/f96b083a)
    - Improve F# ([#1573](https://github.com/PrismJS/prism/issues/1573)) [`00bfc969`](https://github.com/PrismJS/prism/commit/00bfc969)
- **GraphQL**
    - Improved field highlighting for GraphQL ([#1711](https://github.com/PrismJS/prism/issues/1711)) [`44aeffb9`](https://github.com/PrismJS/prism/commit/44aeffb9)
    - Added GraphQL improvements and tests ([#1788](https://github.com/PrismJS/prism/issues/1788)) [`b2298b12`](https://github.com/PrismJS/prism/commit/b2298b12)
- **Haskell**
    - Added `hs` alias for Haskell ([#1831](https://github.com/PrismJS/prism/issues/1831)) [`64baec3c`](https://github.com/PrismJS/prism/commit/64baec3c)
- **HTTP**
    - Improved HTTP content highlighting ([#1598](https://github.com/PrismJS/prism/issues/1598)) [`1b75da90`](https://github.com/PrismJS/prism/commit/1b75da90)
- **Ini**
    - Add support for # comments to INI language ([#1730](https://github.com/PrismJS/prism/issues/1730)) [`baf6bb0c`](https://github.com/PrismJS/prism/commit/baf6bb0c)
- **Java**
    - Add Java 10 support ([#1549](https://github.com/PrismJS/prism/issues/1549)) [`8c981a22`](https://github.com/PrismJS/prism/commit/8c981a22)
    - Added module keywords to Java. ([#1655](https://github.com/PrismJS/prism/issues/1655)) [`6e250a5f`](https://github.com/PrismJS/prism/commit/6e250a5f)
    - Improve Java ([#1474](https://github.com/PrismJS/prism/issues/1474)) [`81bd8f0b`](https://github.com/PrismJS/prism/commit/81bd8f0b)
- **JavaScript**
    - Fix regex for `catch` and `finally` ([#1527](https://github.com/PrismJS/prism/issues/1527)) [`ebd1b9a6`](https://github.com/PrismJS/prism/commit/ebd1b9a6)
    - Highlighting of supposed classes and functions ([#1482](https://github.com/PrismJS/prism/issues/1482)) [`c40f6047`](https://github.com/PrismJS/prism/commit/c40f6047)
    - Added support for JS BigInt literals ([#1542](https://github.com/PrismJS/prism/issues/1542)) [`2b62e57b`](https://github.com/PrismJS/prism/commit/2b62e57b)
    - Fixed lowercase supposed class names ([#1544](https://github.com/PrismJS/prism/issues/1544)) [`a47c05ad`](https://github.com/PrismJS/prism/commit/a47c05ad)
    - Fixes regex for JS examples ([#1591](https://github.com/PrismJS/prism/issues/1591)) [`b41fb8f1`](https://github.com/PrismJS/prism/commit/b41fb8f1)
    - Improve regex detection in JS ([#1473](https://github.com/PrismJS/prism/issues/1473)) [`2a4758ab`](https://github.com/PrismJS/prism/commit/2a4758ab)
    - Identify JavaScript function parameters ([#1446](https://github.com/PrismJS/prism/issues/1446)) [`0cc8c56a`](https://github.com/PrismJS/prism/commit/0cc8c56a)
    - Improved JavaScript parameter recognization ([#1722](https://github.com/PrismJS/prism/issues/1722)) [`57a92035`](https://github.com/PrismJS/prism/commit/57a92035)
    - Make `undefined` a keyword in JS ([#1740](https://github.com/PrismJS/prism/issues/1740)) [`d9fa29a8`](https://github.com/PrismJS/prism/commit/d9fa29a8)
    - Fix `function-variable` in JS ([#1739](https://github.com/PrismJS/prism/issues/1739)) [`bfbea4d6`](https://github.com/PrismJS/prism/commit/bfbea4d6)
    - Improved JS constant pattern ([#1737](https://github.com/PrismJS/prism/issues/1737)) [`7bcec584`](https://github.com/PrismJS/prism/commit/7bcec584)
    - Improved JS function pattern ([#1736](https://github.com/PrismJS/prism/issues/1736)) [`8378ac83`](https://github.com/PrismJS/prism/commit/8378ac83)
    - JS: Fixed variables named "async" ([#1738](https://github.com/PrismJS/prism/issues/1738)) [`3560c643`](https://github.com/PrismJS/prism/commit/3560c643)
    - JS: Keyword fix ([#1808](https://github.com/PrismJS/prism/issues/1808)) [`f2d8e1c7`](https://github.com/PrismJS/prism/commit/f2d8e1c7)
- **JSON** / **JSONP**
    - Fix bugs in JSON language ([#1479](https://github.com/PrismJS/prism/issues/1479)) [`74fe81c6`](https://github.com/PrismJS/prism/commit/74fe81c6)
    - Adds support for comments in JSON ([#1595](https://github.com/PrismJS/prism/issues/1595)) [`8720b3e6`](https://github.com/PrismJS/prism/commit/8720b3e6)
    - Cleaned up JSON ([#1596](https://github.com/PrismJS/prism/issues/1596)) [`da474c77`](https://github.com/PrismJS/prism/commit/da474c77)
    - Added `keyword` alias to JSON's `null` ([#1733](https://github.com/PrismJS/prism/issues/1733)) [`eee06649`](https://github.com/PrismJS/prism/commit/eee06649)
    - Fix JSONP support ([#1745](https://github.com/PrismJS/prism/issues/1745)) [`b5041cf9`](https://github.com/PrismJS/prism/commit/b5041cf9)
    - Fixed JSON/JSONP examples ([#1765](https://github.com/PrismJS/prism/issues/1765)) [`ae4842db`](https://github.com/PrismJS/prism/commit/ae4842db)
- **JSX**
    - React component tags are styled as classes in JSX ([#1519](https://github.com/PrismJS/prism/issues/1519)) [`3e1a9a3d`](https://github.com/PrismJS/prism/commit/3e1a9a3d)
    - Support JSX/TSX class-name with dot ([#1725](https://github.com/PrismJS/prism/issues/1725)) [`4362e42c`](https://github.com/PrismJS/prism/commit/4362e42c)
- **Less**
    - Remove useless insertBefore in LESS ([#1629](https://github.com/PrismJS/prism/issues/1629)) [`86d31793`](https://github.com/PrismJS/prism/commit/86d31793)
- **Lisp**
    - Fix Lisp exponential string pattern ([#1763](https://github.com/PrismJS/prism/issues/1763)) [`5bd182c0`](https://github.com/PrismJS/prism/commit/5bd182c0))
- **Markdown**
    - Added strike support to markdown ([#1563](https://github.com/PrismJS/prism/issues/1563)) [`9d2fddc2`](https://github.com/PrismJS/prism/commit/9d2fddc2)
    - Fixed Markdown headers ([#1557](https://github.com/PrismJS/prism/issues/1557)) [`c6584290`](https://github.com/PrismJS/prism/commit/c6584290)
    - Add support for code blocks in Markdown ([#1562](https://github.com/PrismJS/prism/issues/1562)) [`b0717e70`](https://github.com/PrismJS/prism/commit/b0717e70)
    - Markdown: The 'md' alias is now recognized by hooks ([#1771](https://github.com/PrismJS/prism/issues/1771)) [`8ca3d65b`](https://github.com/PrismJS/prism/commit/8ca3d65b)
- **Markup**
    - Decouple XML from Markup ([#1603](https://github.com/PrismJS/prism/issues/1603)) [`0030a4ef`](https://github.com/PrismJS/prism/commit/0030a4ef)
    - Fix for markup attributes ([#1752](https://github.com/PrismJS/prism/issues/1752)) [`c3862a24`](https://github.com/PrismJS/prism/commit/c3862a24)
    - Markup: Added support for CSS and JS inside of CDATAs ([#1660](https://github.com/PrismJS/prism/issues/1660)) [`57127701`](https://github.com/PrismJS/prism/commit/57127701)
    - Markup `addInline` improvements ([#1798](https://github.com/PrismJS/prism/issues/1798)) [`af67c32e`](https://github.com/PrismJS/prism/commit/af67c32e)
- **Markup Templating**
    - Markup-templating improvements ([#1653](https://github.com/PrismJS/prism/issues/1653)) [`b62e282b`](https://github.com/PrismJS/prism/commit/b62e282b)
- **nginx**
    - Add new keywords to nginx ([#1587](https://github.com/PrismJS/prism/issues/1587)) [`0d73f7f5`](https://github.com/PrismJS/prism/commit/0d73f7f5)
- **PHP**
    - Update PHP keywords ([#1690](https://github.com/PrismJS/prism/issues/1690)) [`55fb0f8e`](https://github.com/PrismJS/prism/commit/55fb0f8e)
    - Improve recognition of constants in PHP ([#1688](https://github.com/PrismJS/prism/issues/1688)) [`f1026b4b`](https://github.com/PrismJS/prism/commit/f1026b4b)
    - Made false, true, and null constants in PHP ([#1694](https://github.com/PrismJS/prism/issues/1694)) [`439e3bd7`](https://github.com/PrismJS/prism/commit/439e3bd7)
    - PHP: Fixed closing tag issue ([#1652](https://github.com/PrismJS/prism/issues/1652)) [`289ddd9b`](https://github.com/PrismJS/prism/commit/289ddd9b)
- **Python**
    - Operator keywords are now keywords ([#1617](https://github.com/PrismJS/prism/issues/1617)) [`1d1fb800`](https://github.com/PrismJS/prism/commit/1d1fb800)
    - Add decorator support to Python ([#1639](https://github.com/PrismJS/prism/issues/1639)) [`2577b6e6`](https://github.com/PrismJS/prism/commit/2577b6e6)
    - Improvements to Python F-strings and string prefixes ([#1642](https://github.com/PrismJS/prism/issues/1642)) [`a69c2b62`](https://github.com/PrismJS/prism/commit/a69c2b62)
- **Reason**
    - Added additional operators to Reason ([#1648](https://github.com/PrismJS/prism/issues/1648)) [`8b1bb469`](https://github.com/PrismJS/prism/commit/8b1bb469)
- **Ruby**
    - Consistent Ruby method highlighting ([#1523](https://github.com/PrismJS/prism/issues/1523)) [`72775919`](https://github.com/PrismJS/prism/commit/72775919)
    - Ruby/ERB: Fixed block comments ([#1768](https://github.com/PrismJS/prism/issues/1768)) [`c805f859`](https://github.com/PrismJS/prism/commit/c805f859)
- **Rust**
    - Add missing keywords ([#1634](https://github.com/PrismJS/prism/issues/1634)) [`3590edde`](https://github.com/PrismJS/prism/commit/3590edde)
- **SAS**
    - Added new SAS keywords ([#1784](https://github.com/PrismJS/prism/issues/1784)) [`3b396ef5`](https://github.com/PrismJS/prism/commit/3b396ef5)
- **Scheme**
    - Fix function without arguments in scheme language ([#1463](https://github.com/PrismJS/prism/issues/1463)) [`12a827e7`](https://github.com/PrismJS/prism/commit/12a827e7)
    - Scheme improvements ([#1556](https://github.com/PrismJS/prism/issues/1556)) [`225dd3f7`](https://github.com/PrismJS/prism/commit/225dd3f7)
    - Fixed operator-like functions in Scheme ([#1467](https://github.com/PrismJS/prism/issues/1467)) [`f8c8add2`](https://github.com/PrismJS/prism/commit/f8c8add2)
    - Scheme: Minor improvements ([#1814](https://github.com/PrismJS/prism/issues/1814)) [`191830f2`](https://github.com/PrismJS/prism/commit/191830f2)
- **SCSS**
    - Fixed that selector pattern can take exponential time ([#1499](https://github.com/PrismJS/prism/issues/1499)) [`0f75d9d4`](https://github.com/PrismJS/prism/commit/0f75d9d4)
    - Move SCSS `property` definition ([#1633](https://github.com/PrismJS/prism/issues/1633)) [`0536fb14`](https://github.com/PrismJS/prism/commit/0536fb14)
    - Add `keyword` alias for SCSS' `null` ([#1735](https://github.com/PrismJS/prism/issues/1735)) [`bd0378f0`](https://github.com/PrismJS/prism/commit/bd0378f0)
- **Smalltalk**
    - Allowed empty strings and comments ([#1747](https://github.com/PrismJS/prism/issues/1747)) [`5fd7577a`](https://github.com/PrismJS/prism/commit/5fd7577a)
- **Smarty**
    - Removed useless `insertBefore` call in Smarty ([#1677](https://github.com/PrismJS/prism/issues/1677)) [`bc49c361`](https://github.com/PrismJS/prism/commit/bc49c361)
- **SQL**
    - Added support for quote escapes to SQL strings ([#1500](https://github.com/PrismJS/prism/issues/1500)) [`a59a7926`](https://github.com/PrismJS/prism/commit/a59a7926)
    - SQL Quoted variables are now greedy ([#1510](https://github.com/PrismJS/prism/issues/1510)) [`42d119a2`](https://github.com/PrismJS/prism/commit/42d119a2)
- **TypeScript**
    - Enhance definitions in TypeScript component ([#1522](https://github.com/PrismJS/prism/issues/1522)) [`11695629`](https://github.com/PrismJS/prism/commit/11695629)
- **YAML**
    - Allow YAML strings to have trailing comments ([#1602](https://github.com/PrismJS/prism/issues/1602)) [`1c5f28a9`](https://github.com/PrismJS/prism/commit/1c5f28a9)

### Updated plugins

- Better class name detection for plugins ([#1772](https://github.com/PrismJS/prism/issues/1772)) [`c9762c6f`](https://github.com/PrismJS/prism/commit/c9762c6f)
- **Autolinker**
    - Fix Autolinker url-decoding all tokens ([#1723](https://github.com/PrismJS/prism/issues/1723)) [`8cf20d49`](https://github.com/PrismJS/prism/commit/8cf20d49)
- **Autoloader**
    - Resolved variable name clash ([#1568](https://github.com/PrismJS/prism/issues/1568)) [`bfa5a8d9`](https://github.com/PrismJS/prism/commit/bfa5a8d9)
    - Autoloader: Fixed the directory of scripts ([#1828](https://github.com/PrismJS/prism/issues/1828)) [`fd4c764f`](https://github.com/PrismJS/prism/commit/fd4c764f)
    - Autoloader: Added support for aliases ([#1829](https://github.com/PrismJS/prism/issues/1829)) [`52889b5b`](https://github.com/PrismJS/prism/commit/52889b5b)
- **Command Line**
    - Fixed class regex for Command Line plugin ([#1566](https://github.com/PrismJS/prism/issues/1566)) [`9f6e5026`](https://github.com/PrismJS/prism/commit/9f6e5026)
- **File Highlight**
    - Prevent double-loading & add scope to File Highlight ([#1586](https://github.com/PrismJS/prism/issues/1586)) [`10239c14`](https://github.com/PrismJS/prism/commit/10239c14)
- **JSONP Highlight**
    - Cleanup JSONP highlight code ([#1674](https://github.com/PrismJS/prism/issues/1674)) [`28489698`](https://github.com/PrismJS/prism/commit/28489698)
    - Fix typos & other issues in JSONP docs ([#1672](https://github.com/PrismJS/prism/issues/1672)) [`cd058a91`](https://github.com/PrismJS/prism/commit/cd058a91)
    - JSONP highlight: Fixed minified adapter names ([#1793](https://github.com/PrismJS/prism/issues/1793)) [`5dd8f916`](https://github.com/PrismJS/prism/commit/5dd8f916)
- **Keep Markup**
    - Add unit tests to the Keep Markup plugin ([#1646](https://github.com/PrismJS/prism/issues/1646)) [`a944c418`](https://github.com/PrismJS/prism/commit/a944c418)
- **Line Numbers**
    - Added inheritance for the `line-numbers` class ([#1799](https://github.com/PrismJS/prism/issues/1799)) [`14be7489`](https://github.com/PrismJS/prism/commit/14be7489)
- **Previewers**
    - Fixed Previewers bug [#1496](https://github.com/PrismJS/prism/issues/1496) ([#1497](https://github.com/PrismJS/prism/issues/1497)) [`4b56f3c1`](https://github.com/PrismJS/prism/commit/4b56f3c1)
- **Show Invisibles**
    - Updated styles of show invisibles ([#1607](https://github.com/PrismJS/prism/issues/1607)) [`2ba62268`](https://github.com/PrismJS/prism/commit/2ba62268)
    - Corrected load order of Show Invisibles ([#1612](https://github.com/PrismJS/prism/issues/1612)) [`6e0c6e86`](https://github.com/PrismJS/prism/commit/6e0c6e86)
    - Show invisibles inside tokens ([#1610](https://github.com/PrismJS/prism/issues/1610)) [`1090b253`](https://github.com/PrismJS/prism/commit/1090b253)
- **Show Language**
    - Show Language plugin alias support and improvements ([#1683](https://github.com/PrismJS/prism/issues/1683)) [`4c66d72c`](https://github.com/PrismJS/prism/commit/4c66d72c)
- **Toolbar**
    - Toolbar: Minor improvements ([#1818](https://github.com/PrismJS/prism/issues/1818)) [`3ad47047`](https://github.com/PrismJS/prism/commit/3ad47047)

### Updated themes

- Normalized the font-size of pre and code ([#1791](https://github.com/PrismJS/prism/issues/1791)) [`878ef295`](https://github.com/PrismJS/prism/commit/878ef295)
- **Coy**
    - Correct typo ([#1508](https://github.com/PrismJS/prism/issues/1508)) [`c322fc80`](https://github.com/PrismJS/prism/commit/c322fc80)

### Other changes

- **Core**
    - `insertBefore` now correctly updates references ([#1531](https://github.com/PrismJS/prism/issues/1531)) [`9dfec340`](https://github.com/PrismJS/prism/commit/9dfec340)
    - Invoke `callback` after `after-highlight` hook ([#1588](https://github.com/PrismJS/prism/issues/1588)) [`bfbe4464`](https://github.com/PrismJS/prism/commit/bfbe4464)
    - Improve `Prism.util.type` performance ([#1545](https://github.com/PrismJS/prism/issues/1545)) [`2864fe24`](https://github.com/PrismJS/prism/commit/2864fe24)
    - Remove unused `insertBefore` overload ([#1631](https://github.com/PrismJS/prism/issues/1631)) [`39686e12`](https://github.com/PrismJS/prism/commit/39686e12)
    - Ignore duplicates in insertBefore ([#1628](https://github.com/PrismJS/prism/issues/1628)) [`d33d259c`](https://github.com/PrismJS/prism/commit/d33d259c)
    - Remove the Prism.tokenize language parameter ([#1654](https://github.com/PrismJS/prism/issues/1654)) [`fbf0b094`](https://github.com/PrismJS/prism/commit/fbf0b094)
    - Call `insert-before` hook properly ([#1709](https://github.com/PrismJS/prism/issues/1709)) [`393ab164`](https://github.com/PrismJS/prism/commit/393ab164)
    - Improved languages.DFS and util.clone ([#1506](https://github.com/PrismJS/prism/issues/1506)) [`152a68ef`](https://github.com/PrismJS/prism/commit/152a68ef)
    - Core: Avoid redeclaring variables in util.clone ([#1778](https://github.com/PrismJS/prism/issues/1778)) [`b06f532f`](https://github.com/PrismJS/prism/commit/b06f532f)
    - Made prism-core a little more editor friendly ([#1776](https://github.com/PrismJS/prism/issues/1776)) [`bac09f0a`](https://github.com/PrismJS/prism/commit/bac09f0a)
    - Applied Array.isArray ([#1804](https://github.com/PrismJS/prism/issues/1804)) [`11d0f75e`](https://github.com/PrismJS/prism/commit/11d0f75e)
- **Infrastructure**
    - Linkify changelog more + add missing PR references [`2a100db7`](https://github.com/PrismJS/prism/commit/2a100db7)
    - Set default indentation size ([#1516](https://github.com/PrismJS/prism/issues/1516)) [`e63d1597`](https://github.com/PrismJS/prism/commit/e63d1597)
    - Add travis repo badge to readme ([#1561](https://github.com/PrismJS/prism/issues/1561)) [`716923f4`](https://github.com/PrismJS/prism/commit/716923f4)
    - Update README.md ([#1553](https://github.com/PrismJS/prism/issues/1553)) [`6d1a2c61`](https://github.com/PrismJS/prism/commit/6d1a2c61)
    - Mention Prism Themes in README ([#1625](https://github.com/PrismJS/prism/issues/1625)) [`5db04656`](https://github.com/PrismJS/prism/commit/5db04656)
    - Fixed CHANGELOG.md ([#1707](https://github.com/PrismJS/prism/issues/1707)) [`b1f8a65d`](https://github.com/PrismJS/prism/commit/b1f8a65d) ([#1704](https://github.com/PrismJS/prism/issues/1704)) [`66d2104a`](https://github.com/PrismJS/prism/commit/66d2104a)
    - Change tested NodeJS versions ([#1651](https://github.com/PrismJS/prism/issues/1651)) [`6ec71e0b`](https://github.com/PrismJS/prism/commit/6ec71e0b)
    - Inline regex source with gulp ([#1537](https://github.com/PrismJS/prism/issues/1537)) [`e894fc89`](https://github.com/PrismJS/prism/commit/e894fc89) ([#1716](https://github.com/PrismJS/prism/issues/1716)) [`217a6ea4`](https://github.com/PrismJS/prism/commit/217a6ea4)
    - Improve gulp error messages with pump ([#1741](https://github.com/PrismJS/prism/issues/1741)) [`671f4ca0`](https://github.com/PrismJS/prism/commit/671f4ca0)
    - Update gulp to version 4.0.0 ([#1779](https://github.com/PrismJS/prism/issues/1779)) [`06627f6a`](https://github.com/PrismJS/prism/commit/06627f6a)
    - gulp: Refactoring ([#1780](https://github.com/PrismJS/prism/issues/1780)) [`6c9fe257`](https://github.com/PrismJS/prism/commit/6c9fe257)
    - npm: Updated all dependencies ([#1742](https://github.com/PrismJS/prism/issues/1742)) [`9d908d5a`](https://github.com/PrismJS/prism/commit/9d908d5a)
    - Tests: Pretty-printed token stream ([#1801](https://github.com/PrismJS/prism/issues/1801)) [`9ea6d600`](https://github.com/PrismJS/prism/commit/9ea6d600)
    - Refactored tests ([#1795](https://github.com/PrismJS/prism/issues/1795)) [`832a9643`](https://github.com/PrismJS/prism/commit/832a9643)
    - Added issue templates ([#1805](https://github.com/PrismJS/prism/issues/1805)) [`dedb475f`](https://github.com/PrismJS/prism/commit/dedb475f)
    - npm: Fixed `test` script ([#1809](https://github.com/PrismJS/prism/issues/1809)) [`bc649dfa`](https://github.com/PrismJS/prism/commit/bc649dfa)
    - Add command to generate CHANGELOG [`212666d3`](https://github.com/PrismJS/prism/commit/212666d3)
    - Name in composer.json set to lowercase ([#1824](https://github.com/PrismJS/prism/issues/1824)) [`4f78f1d6`](https://github.com/PrismJS/prism/commit/4f78f1d6)
    - Added alias tests ([#1832](https://github.com/PrismJS/prism/issues/1832)) [`5c1a6fb2`](https://github.com/PrismJS/prism/commit/5c1a6fb2)
    - Travis: Fail when changed files are detected ([#1819](https://github.com/PrismJS/prism/issues/1819)) [`66b44e3b`](https://github.com/PrismJS/prism/commit/66b44e3b)
    - Tests: Additional checks for Prism functions ([#1803](https://github.com/PrismJS/prism/issues/1803)) [`c3e74ea3`](https://github.com/PrismJS/prism/commit/c3e74ea3)
    - Adjusted .npmignore ([#1834](https://github.com/PrismJS/prism/issues/1834)) [`29a30c62`](https://github.com/PrismJS/prism/commit/29a30c62)
- **Website**
    - Add Python triple-quoted strings "known failure" ([#1449](https://github.com/PrismJS/prism/issues/1449)) [`334c7bca`](https://github.com/PrismJS/prism/commit/334c7bca)
    - Updated index.html to fix broken instructions ([#1462](https://github.com/PrismJS/prism/issues/1462)) [`7418dfdd`](https://github.com/PrismJS/prism/commit/7418dfdd)
    - Improve download page typography ([#1484](https://github.com/PrismJS/prism/issues/1484)) [`b1c2f4df`](https://github.com/PrismJS/prism/commit/b1c2f4df)
    - Fixed peer dependencies in download page ([#1491](https://github.com/PrismJS/prism/issues/1491)) [`9d15ff6e`](https://github.com/PrismJS/prism/commit/9d15ff6e)
    - Fixed empty link in extending ([#1507](https://github.com/PrismJS/prism/issues/1507)) [`74916d48`](https://github.com/PrismJS/prism/commit/74916d48)
    - Display language aliases ([#1626](https://github.com/PrismJS/prism/issues/1626)) [`654b527b`](https://github.com/PrismJS/prism/commit/654b527b)
    - Clean up Previewers' page ([#1630](https://github.com/PrismJS/prism/issues/1630)) [`b0d1823c`](https://github.com/PrismJS/prism/commit/b0d1823c)
    - Updated website table of contents styles ([#1681](https://github.com/PrismJS/prism/issues/1681)) [`efdd96c3`](https://github.com/PrismJS/prism/commit/efdd96c3)
    - Added new third-party tutorial for using Prism in Gutenberg ([#1701](https://github.com/PrismJS/prism/issues/1701)) [`ff9ccbe5`](https://github.com/PrismJS/prism/commit/ff9ccbe5)
    - Remove dead tutorial ([#1702](https://github.com/PrismJS/prism/issues/1702)) [`e2d3bc7e`](https://github.com/PrismJS/prism/commit/e2d3bc7e)
    - Fix downloads page fetching from GitHub([#1684](https://github.com/PrismJS/prism/issues/1684)) [`dbd3555e`](https://github.com/PrismJS/prism/commit/dbd3555e)
    - Remove parentheses from download page ([#1627](https://github.com/PrismJS/prism/issues/1627)) [`2ce0666d`](https://github.com/PrismJS/prism/commit/2ce0666d)
    - Line Numbers plugin instructions clarifications ([#1719](https://github.com/PrismJS/prism/issues/1719)) [`00f4f04f`](https://github.com/PrismJS/prism/commit/00f4f04f)
    - Fixed Toolbar plugin example ([#1726](https://github.com/PrismJS/prism/issues/1726)) [`5311ca32`](https://github.com/PrismJS/prism/commit/5311ca32)
    - Test page: Show tokens option ([#1757](https://github.com/PrismJS/prism/issues/1757)) [`729cb28b`](https://github.com/PrismJS/prism/commit/729cb28b)
    - Some encouragement for visitors of PrismJS.com to request new languages ([#1760](https://github.com/PrismJS/prism/issues/1760)) [`ea769e0b`](https://github.com/PrismJS/prism/commit/ea769e0b)
    - Docs: Added missing parameter ([#1774](https://github.com/PrismJS/prism/issues/1774)) [`18f2921d`](https://github.com/PrismJS/prism/commit/18f2921d)
    - More persistent test page ([#1529](https://github.com/PrismJS/prism/issues/1529)) [`3100fa31`](https://github.com/PrismJS/prism/commit/3100fa31)
    - Added scripts directory ([#1781](https://github.com/PrismJS/prism/issues/1781)) [`439ea1ee`](https://github.com/PrismJS/prism/commit/439ea1ee)
    - Fixed download page ([#1811](https://github.com/PrismJS/prism/issues/1811)) [`77c57446`](https://github.com/PrismJS/prism/commit/77c57446)

## 1.15.0 (2018-06-16)

### New components

- **Template Tookit 2** ([#1418](https://github.com/PrismJS/prism/issues/1418)) [[`e063992`](https://github.com/PrismJS/prism/commit/e063992)]
- **XQuery** ([#1411](https://github.com/PrismJS/prism/issues/1411)) [[`e326cb0`](https://github.com/PrismJS/prism/commit/e326cb0)]
- **TAP** ([#1430](https://github.com/PrismJS/prism/issues/1430)) [[`8c2b71f`](https://github.com/PrismJS/prism/commit/8c2b71f)]

### Updated components

- **HTTP**
    - Absolute path is a valid request uri ([#1388](https://github.com/PrismJS/prism/issues/1388)) [[`f6e81cb`](https://github.com/PrismJS/prism/commit/f6e81cb)]
- **Kotlin**
    - Add keywords of Kotlin and modify it's number pattern. ([#1389](https://github.com/PrismJS/prism/issues/1389)) [[`1bf73b0`](https://github.com/PrismJS/prism/commit/1bf73b0)]
    - Add `typealias` keyword ([#1437](https://github.com/PrismJS/prism/issues/1437)) [[`a21fdee`](https://github.com/PrismJS/prism/commit/a21fdee)]
- **JavaScript**
    - Improve Regexp pattern [[`5b043cf`](https://github.com/PrismJS/prism/commit/5b043cf)]
    - Add support for one level of nesting inside template strings. Fix [#1397](https://github.com/PrismJS/prism/issues/1397) [[`db2d0eb`](https://github.com/PrismJS/prism/commit/db2d0eb)]
- **Elixir**
    - Elixir: Fix attributes consuming punctuation. Fix [#1392](https://github.com/PrismJS/prism/issues/1392) [[`dac0485`](https://github.com/PrismJS/prism/commit/dac0485)]
- **Bash**
    - Change reserved keyword reference ([#1396](https://github.com/PrismJS/prism/issues/1396)) [[`b94f01f`](https://github.com/PrismJS/prism/commit/b94f01f)]
- **PowerShell**
    - Allow for one level of nesting in expressions inside strings. Fix [#1407](https://github.com/PrismJS/prism/issues/1407) [[`9272d6f`](https://github.com/PrismJS/prism/commit/9272d6f)]
- **JSX**
    - Allow for two levels of nesting inside JSX tags. Fix [#1408](https://github.com/PrismJS/prism/issues/1408) [[`f1cd7c5`](https://github.com/PrismJS/prism/commit/f1cd7c5)]
    - Add support for fragments short syntax. Fix [#1421](https://github.com/PrismJS/prism/issues/1421) [[`38ce121`](https://github.com/PrismJS/prism/commit/38ce121)]
- **Pascal**
    - Add `objectpascal` as an alias to `pascal` ([#1426](https://github.com/PrismJS/prism/issues/1426)) [[`a0bfc84`](https://github.com/PrismJS/prism/commit/a0bfc84)]
- **Swift**
    - Fix Swift 'protocol' keyword ([#1440](https://github.com/PrismJS/prism/issues/1440)) [[`081e318`](https://github.com/PrismJS/prism/commit/081e318)]

### Updated plugins

- **File Highlight**
    - Fix issue causing the Download button to show up on every code blocks. [[`cd22499`](https://github.com/PrismJS/prism/commit/cd22499)]
    - Simplify lang regex on File Highlight plugin ([#1399](https://github.com/PrismJS/prism/issues/1399)) [[`7bc9a4a`](https://github.com/PrismJS/prism/commit/7bc9a4a)]
- **Show Language**
    - Don't process language if block language not set ([#1410](https://github.com/PrismJS/prism/issues/1410)) [[`c111869`](https://github.com/PrismJS/prism/commit/c111869)]
- **Autoloader**
    - ASP.NET should require C# [[`fa328bb`](https://github.com/PrismJS/prism/commit/fa328bb)]
- **Line Numbers**
    - Make line-numbers styles more specific ([#1434](https://github.com/PrismJS/prism/issues/1434), [#1435](https://github.com/PrismJS/prism/issues/1435)) [[`9ee4f54`](https://github.com/PrismJS/prism/commit/9ee4f54)]

### Updated themes

- Add .token.class-name to rest of themes ([#1360](https://github.com/PrismJS/prism/issues/1360)) [[`f356dfe`](https://github.com/PrismJS/prism/commit/f356dfe)]

### Other changes

- **Website**
    - Site now loads over HTTPS!
    - Use HTTPS / canonical URLs ([#1390](https://github.com/PrismJS/prism/issues/1390)) [[`95146c8`](https://github.com/PrismJS/prism/commit/95146c8)]
    - Added Angular tutorial link [[`c436a7c`](https://github.com/PrismJS/prism/commit/c436a7c)]
    - Use rel="icon" instead of rel="shortcut icon" ([#1398](https://github.com/PrismJS/prism/issues/1398)) [[`d95f8fb`](https://github.com/PrismJS/prism/commit/d95f8fb)]
    - Fix Download page not handling multiple dependencies when from Redownload URL [[`c2ff248`](https://github.com/PrismJS/prism/commit/c2ff248)]
    - Update documentation for node & webpack usage [[`1e99e96`](https://github.com/PrismJS/prism/commit/1e99e96)]
- Handle optional dependencies in `loadLanguages()` ([#1417](https://github.com/PrismJS/prism/issues/1417)) [[`84935ac`](https://github.com/PrismJS/prism/commit/84935ac)]
- Add Chinese translation [[`f2b1964`](https://github.com/PrismJS/prism/commit/f2b1964)]

## 1.14.0 (2018-04-11)

### New components

- **GEDCOM** ([#1385](https://github.com/PrismJS/prism/issues/1385)) [[`6e0b20a`](https://github.com/PrismJS/prism/commit/6e0b20a)]
- **Lisp** ([#1297](https://github.com/PrismJS/prism/issues/1297)) [[`46468f8`](https://github.com/PrismJS/prism/commit/46468f8)]
- **Markup Templating** ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
- **Soy** ([#1387](https://github.com/PrismJS/prism/issues/1387)) [[`b4509bf`](https://github.com/PrismJS/prism/commit/b4509bf)]
- **Velocity** ([#1378](https://github.com/PrismJS/prism/issues/1378)) [[`5a524f7`](https://github.com/PrismJS/prism/commit/5a524f7)]
- **Visual Basic** ([#1382](https://github.com/PrismJS/prism/issues/1382)) [[`c673ec2`](https://github.com/PrismJS/prism/commit/c673ec2)]
- **WebAssembly** ([#1386](https://github.com/PrismJS/prism/issues/1386)) [[`c28d8c5`](https://github.com/PrismJS/prism/commit/c28d8c5)]

### Updated components

- **Bash**:
    - Add curl to the list of common functions. Close [#1160](https://github.com/PrismJS/prism/issues/1160) [[`1bfc084`](https://github.com/PrismJS/prism/commit/1bfc084)]
- **C-like**:
    - Make single-line comments greedy. Fix [#1337](https://github.com/PrismJS/prism/issues/1337). Make sure [#1340](https://github.com/PrismJS/prism/issues/1340) stays fixed. [[`571f2c5`](https://github.com/PrismJS/prism/commit/571f2c5)]
- **C#**:
    - More generic class-name highlighting. Fix [#1365](https://github.com/PrismJS/prism/issues/1365) [[`a6837d2`](https://github.com/PrismJS/prism/commit/a6837d2)]
    - More specific class-name highlighting. Fix [#1371](https://github.com/PrismJS/prism/issues/1371) [[`0a95f69`](https://github.com/PrismJS/prism/commit/0a95f69)]
- **Eiffel**:
    - Fix verbatim strings. Fix [#1379](https://github.com/PrismJS/prism/issues/1379) [[`04df41b`](https://github.com/PrismJS/prism/commit/04df41b)]
- **Elixir**
    - Make regexps greedy, remove comment hacks. Update known failures and tests. [[`e93d61f`](https://github.com/PrismJS/prism/commit/e93d61f)]
- **ERB**:
    - Make highlighting work properly in NodeJS ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
- **Fortran**:
    - Make single-line comments greedy. Update known failures and tests. [[`c083b78`](https://github.com/PrismJS/prism/commit/c083b78)]
- **Handlebars**:
    - Make highlighting work properly in NodeJS ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
- **Java**:
    - Add support for generics. Fix [#1351](https://github.com/PrismJS/prism/issues/1351) [[`a5cf302`](https://github.com/PrismJS/prism/commit/a5cf302)]
- **JavaScript**:
    - Add support for constants. Fix [#1348](https://github.com/PrismJS/prism/issues/1348) [[`9084481`](https://github.com/PrismJS/prism/commit/9084481)]
    - Improve Regex matching [[`172d351`](https://github.com/PrismJS/prism/commit/172d351)]
- **JSX**:
    - Fix highlighting of empty objects. Fix [#1364](https://github.com/PrismJS/prism/issues/1364) [[`b26bbb8`](https://github.com/PrismJS/prism/commit/b26bbb8)]
- **Monkey**:
    - Make comments greedy. Update known failures and tests. [[`d7b2b43`](https://github.com/PrismJS/prism/commit/d7b2b43)]
- **PHP**:
    - Make highlighting work properly in NodeJS ([#1367](https://github.com/PrismJS/prism/issues/1367)) [[`5f9c078`](https://github.com/PrismJS/prism/commit/5f9c078)]
- **Puppet**:
    - Make heredoc, comments, regexps and strings greedy. Update known failures and tests. [[`0c139d1`](https://github.com/PrismJS/prism/commit/0c139d1)]
- **Q**:
    - Make comments greedy. Update known failures and tests. [[`a0f5081`](https://github.com/PrismJS/prism/commit/a0f5081)]
- **Ruby**:
    - Make multi-line comments greedy, remove single-line comment hack. Update known failures and tests. [[`b0e34fb`](https://github.com/PrismJS/prism/commit/b0e34fb)]
- **SQL**:
    - Add missing keywords. Fix [#1374](https://github.com/PrismJS/prism/issues/1374) [[`238b195`](https://github.com/PrismJS/prism/commit/238b195)]

### Updated plugins

- **Command Line**:
    - Command Line: Allow specifying output prefix using data-filter-output attribute. ([#856](https://github.com/PrismJS/prism/issues/856)) [[`094d546`](https://github.com/PrismJS/prism/commit/094d546)]
- **File Highlight**:
    - Add option to provide a download button, when used with the Toolbar plugin. Fix [#1030](https://github.com/PrismJS/prism/issues/1030) [[`9f22952`](https://github.com/PrismJS/prism/commit/9f22952)]

### Updated themes

- **Default**:
    - Reach AA contrast ratio level ([#1296](https://github.com/PrismJS/prism/issues/1296)) [[`8aea939`](https://github.com/PrismJS/prism/commit/8aea939)]

### Other changes

- Website: Remove broken third-party tutorials from homepage [[`0efd6e1`](https://github.com/PrismJS/prism/commit/0efd6e1)]
- Docs: Mention `loadLanguages()` function on homepage in the nodeJS section. Close [#972](https://github.com/PrismJS/prism/issues/972), close [#593](https://github.com/PrismJS/prism/issues/593) [[`4a14d20`](https://github.com/PrismJS/prism/commit/4a14d20)]
- Core: Greedy patterns should always be matched against the full string. Fix [#1355](https://github.com/PrismJS/prism/issues/1355) [[`294efaa`](https://github.com/PrismJS/prism/commit/294efaa)]
- Crystal: Update known failures. [[`e1d2d42`](https://github.com/PrismJS/prism/commit/e1d2d42)]
- D: Update known failures and tests. [[`13d9991`](https://github.com/PrismJS/prism/commit/13d9991)]
- Markdown: Update known failures. [[`5b6c76d`](https://github.com/PrismJS/prism/commit/5b6c76d)]
- Matlab: Update known failures. [[`259b6fc`](https://github.com/PrismJS/prism/commit/259b6fc)]
- Website: Remove non-existent anchor to failures. Reword on homepage to make is less misleading. [[`8c0911a`](https://github.com/PrismJS/prism/commit/8c0911a)]
- Website: Add link to Keep Markup plugin in FAQ [[`e8cb6d4`](https://github.com/PrismJS/prism/commit/e8cb6d4)]
- Test suite: Memory leak in vm.runInNewContext() seems fixed. Revert [[`9a4b6fa`](https://github.com/PrismJS/prism/commit/9a4b6fa)] to drastically improve tests execution time. [[`9bceece`](https://github.com/PrismJS/prism/commit/9bceece), [`7c7602b`](https://github.com/PrismJS/prism/commit/7c7602b)]
- Gulp: Don't minify `components/index.js` [[`689227b`](https://github.com/PrismJS/prism/commit/689227b)]
- Website: Fix theme selection on Download page, when theme is in query string or hash. [[`b4d3063`](https://github.com/PrismJS/prism/commit/b4d3063)]
- Update JSPM config to also include unminified components. Close [#995](https://github.com/PrismJS/prism/issues/995) [[`218f160`](https://github.com/PrismJS/prism/commit/218f160)]
- Core: Fix support for language alias containing dash `-` [[`659ea31`](https://github.com/PrismJS/prism/commit/659ea31)]

## 1.13.0 (2018-03-21)

### New components

- **ERB** [[`e6213ac`](https://github.com/PrismJS/prism/commit/e6213ac)]
- **PL/SQL** ([#1338](https://github.com/PrismJS/prism/issues/1338)) [[`3599e6a`](https://github.com/PrismJS/prism/commit/3599e6a)]

### Updated components

- **JSX**:
    - Add support for plain text inside tags ([#1357](https://github.com/PrismJS/prism/issues/1357)) [[`2b8321d`](https://github.com/PrismJS/prism/commit/2b8321d)]
- **Markup**:
    - Make tags greedy. Fix [#1356](https://github.com/PrismJS/prism/issues/1356) [[`af834be`](https://github.com/PrismJS/prism/commit/af834be)]
- **Powershell**:
    - Add lookbehind to fix function interpolation inside strings. Fix [#1361](https://github.com/PrismJS/prism/issues/1361) [[`d2c026e`](https://github.com/PrismJS/prism/commit/d2c026e)]
- **Rust**:
    - Improve char pattern so that lifetime annotations are matched better. Fix [#1353](https://github.com/PrismJS/prism/issues/1353) [[`efdccbf`](https://github.com/PrismJS/prism/commit/efdccbf)]

### Updated themes

- **Default**:
    - Add color for class names [[`8572474`](https://github.com/PrismJS/prism/commit/8572474)]
- **Coy**:
    - Inherit pre's height on code, so it does not break on Download page. [[`c6c7fd1`](https://github.com/PrismJS/prism/commit/c6c7fd1)]

### Other changes

- Website: Auto-generate example headers [[`c3ed5b5`](https://github.com/PrismJS/prism/commit/c3ed5b5)]
- Core: Allow cloning of circular structures. ([#1345](https://github.com/PrismJS/prism/issues/1345)) [[`f90d555`](https://github.com/PrismJS/prism/commit/f90d555)]
- Core: Generate components.js from components.json and make it exportable to nodeJS. ([#1354](https://github.com/PrismJS/prism/issues/1354)) [[`ba60df0`](https://github.com/PrismJS/prism/commit/ba60df0)]
- Website: Improve appearance of theme selector [[`0460cad`](https://github.com/PrismJS/prism/commit/0460cad)]
- Website: Check stored theme by default + link both theme selectors together. Close [#1038](https://github.com/PrismJS/prism/issues/1038) [[`212dd4e`](https://github.com/PrismJS/prism/commit/212dd4e)]
- Tests: Use the new components.js file directly [[`0e1a8b7`](https://github.com/PrismJS/prism/commit/0e1a8b7)]
- Update .npmignore Close [#1274](https://github.com/PrismJS/prism/issues/1274) [[`a52319a`](https://github.com/PrismJS/prism/commit/a52319a)]
- Add a loadLanguages() function for easy component loading on NodeJS ([#1359](https://github.com/PrismJS/prism/issues/1359)) [[`a5331a6`](https://github.com/PrismJS/prism/commit/a5331a6)]

## 1.12.2 (2018-03-08)

### Other changes

- Test against NodeJS 4, 6, 8 and 9 ([#1329](https://github.com/PrismJS/prism/issues/1329)) [[`97b7d0a`](https://github.com/PrismJS/prism/commit/97b7d0a)]
- Stop testing against NodeJS 0.10 and 0.12 [[`df01b1b`](https://github.com/PrismJS/prism/commit/df01b1b)]

## 1.12.1 (2018-03-08)

### Updated components

- **C-like**:
    - Revert [[`b98e5b9`](https://github.com/PrismJS/prism/commit/b98e5b9)] to fix [#1340](https://github.com/PrismJS/prism/issues/1340). Reopened [#1337](https://github.com/PrismJS/prism/issues/1337). [[`cebacdf`](https://github.com/PrismJS/prism/commit/cebacdf)]
- **JSX**:
    - Allow for one level of nested curly braces inside tag attribute value. Fix [#1335](https://github.com/PrismJS/prism/issues/1335) [[`05bf67d`](https://github.com/PrismJS/prism/commit/05bf67d)]
- **Ruby**:
    - Ensure module syntax is not confused with symbols. Fix [#1336](https://github.com/PrismJS/prism/issues/1336) [[`31a2a69`](https://github.com/PrismJS/prism/commit/31a2a69)]

## 1.12.0 (2018-03-07)

### New components

- **ARFF** ([#1327](https://github.com/PrismJS/prism/issues/1327)) [[`0bc98ac`](https://github.com/PrismJS/prism/commit/0bc98ac)]
- **Clojure** ([#1311](https://github.com/PrismJS/prism/issues/1311)) [[`8b4d3bd`](https://github.com/PrismJS/prism/commit/8b4d3bd)]
- **Liquid** ([#1326](https://github.com/PrismJS/prism/issues/1326)) [[`f0b2c9e`](https://github.com/PrismJS/prism/commit/f0b2c9e)]

### Updated components

- **Bash**:
    - Add shell as an alias ([#1321](https://github.com/PrismJS/prism/issues/1321)) [[`67e16a2`](https://github.com/PrismJS/prism/commit/67e16a2)]
    - Add support for quoted command substitution. Fix [#1287](https://github.com/PrismJS/prism/issues/1287) [[`63fc215`](https://github.com/PrismJS/prism/commit/63fc215)]
- **C#**:
    - Add "dotnet" alias. [[`405867c`](https://github.com/PrismJS/prism/commit/405867c)]
- **C-like**:
    - Change order of comment patterns and make multi-line one greedy. Fix [#1337](https://github.com/PrismJS/prism/issues/1337) [[`b98e5b9`](https://github.com/PrismJS/prism/commit/b98e5b9)]
- **NSIS**:
    - Add support for NSIS 3.03 ([#1288](https://github.com/PrismJS/prism/issues/1288)) [[`bd1e98b`](https://github.com/PrismJS/prism/commit/bd1e98b)]
    - Add missing NSIS commands ([#1289](https://github.com/PrismJS/prism/issues/1289)) [[`ad2948f`](https://github.com/PrismJS/prism/commit/ad2948f)]
- **PHP**:
    - Add support for string interpolation inside double-quoted strings. Fix [#1146](https://github.com/PrismJS/prism/issues/1146) [[`9f1f8d6`](https://github.com/PrismJS/prism/commit/9f1f8d6)]
    - Add support for Heredoc and Nowdoc strings [[`5d7223c`](https://github.com/PrismJS/prism/commit/5d7223c)]
    - Fix shell-comment failure now that strings are greedy [[`ad25d22`](https://github.com/PrismJS/prism/commit/ad25d22)]
- **PowerShell**:
    - Add support for two levels of nested brackets inside namespace pattern. Fixes [#1317](https://github.com/PrismJS/prism/issues/1317) [[`3bc3e9c`](https://github.com/PrismJS/prism/commit/3bc3e9c)]
- **Ruby**:
    - Add keywords "protected", "private" and "public" [[`4593837`](https://github.com/PrismJS/prism/commit/4593837)]
- **Rust**:
    - Add support for lifetime-annotation and => operator. Fix [#1339](https://github.com/PrismJS/prism/issues/1339) [[`926f6f8`](https://github.com/PrismJS/prism/commit/926f6f8)]
- **Scheme**:
    - Don't highlight first number of a list as a function. Fix [#1331](https://github.com/PrismJS/prism/issues/1331) [[`51bff80`](https://github.com/PrismJS/prism/commit/51bff80)]
- **SQL**:
    - Add missing keywords and functions, fix numbers [[`de29d4a`](https://github.com/PrismJS/prism/commit/de29d4a)]

### Updated plugins

- **Autolinker**:
    - Allow more chars in query string and hash to match more URLs. Fix [#1142](https://github.com/PrismJS/prism/issues/1142) [[`109bd6f`](https://github.com/PrismJS/prism/commit/109bd6f)]
- **Copy to Clipboard**:
    - Bump ClipboardJS to 2.0.0 and remove hack ([#1314](https://github.com/PrismJS/prism/issues/1314)) [[`e9f410e`](https://github.com/PrismJS/prism/commit/e9f410e)]
- **Toolbar**:
    - Prevent scrolling toolbar with content ([#1305](https://github.com/PrismJS/prism/issues/1305), [#1314](https://github.com/PrismJS/prism/issues/1314)) [[`84eeb89`](https://github.com/PrismJS/prism/commit/84eeb89)]
- **Unescaped Markup**:
    - Use msMatchesSelector for IE11 and below. Fix [#1302](https://github.com/PrismJS/prism/issues/1302) [[`c246c1a`](https://github.com/PrismJS/prism/commit/c246c1a)]
- **WebPlatform Docs**:
    - WebPlatform Docs plugin: Fix links. Fixes [#1290](https://github.com/PrismJS/prism/issues/1290) [[`7a9dbe0`](https://github.com/PrismJS/prism/commit/7a9dbe0)]

### Other changes

- Fix Autoloader's demo page [[`3dddac9`](https://github.com/PrismJS/prism/commit/3dddac9)]
- Download page: Use hash instead of query-string for redownload URL. Fix [#1263](https://github.com/PrismJS/prism/issues/1263) [[`b03c02a`](https://github.com/PrismJS/prism/commit/b03c02a)]
- Core: Don't thow an error if lookbehing is used without anything matching. [[`e0cd47f`](https://github.com/PrismJS/prism/commit/e0cd47f)]
- Docs: Fix link to the `<code>` element specification in HTML5 [[`a84263f`](https://github.com/PrismJS/prism/commit/a84263f)]
- Docs: Mention support for `lang-xxxx` class. Close [#1312](https://github.com/PrismJS/prism/issues/1312) [[`a9e76db`](https://github.com/PrismJS/prism/commit/a9e76db)]
- Docs: Add note on `async` parameter to clarify the requirement of using a single bundled file. Closes [#1249](https://github.com/PrismJS/prism/issues/1249) [[`eba0235`](https://github.com/PrismJS/prism/commit/eba0235)]

## 1.11.0 (2018-02-05)

### New components

- **Content-Security-Policy (CSP)** ([#1275](https://github.com/PrismJS/prism/issues/1275)) [[`b08cae5`](https://github.com/PrismJS/prism/commit/b08cae5)]
- **HTTP Public-Key-Pins (HPKP)** ([#1275](https://github.com/PrismJS/prism/issues/1275)) [[`b08cae5`](https://github.com/PrismJS/prism/commit/b08cae5)]
- **HTTP String-Transport-Security (HSTS)** ([#1275](https://github.com/PrismJS/prism/issues/1275)) [[`b08cae5`](https://github.com/PrismJS/prism/commit/b08cae5)]
- **React TSX** ([#1280](https://github.com/PrismJS/prism/issues/1280)) [[`fbe82b8`](https://github.com/PrismJS/prism/commit/fbe82b8)]

### Updated components

- **C++**:
    - Add C++ platform-independent types ([#1271](https://github.com/PrismJS/prism/issues/1271)) [[`3da238f`](https://github.com/PrismJS/prism/commit/3da238f)]
- **TypeScript**:
    - Improve typescript with builtins ([#1277](https://github.com/PrismJS/prism/issues/1277)) [[`5de1b1f`](https://github.com/PrismJS/prism/commit/5de1b1f)]

### Other changes

- Fix passing of non-enumerable Error properties from the child test runner ([#1276](https://github.com/PrismJS/prism/issues/1276)) [[`38df653`](https://github.com/PrismJS/prism/commit/38df653)]

## 1.10.0 (2018-01-17)

### New components

- **6502 Assembly** ([#1245](https://github.com/PrismJS/prism/issues/1245)) [[`2ece18b`](https://github.com/PrismJS/prism/commit/2ece18b)]
- **Elm** ([#1174](https://github.com/PrismJS/prism/issues/1174)) [[`d6da70e`](https://github.com/PrismJS/prism/commit/d6da70e)]
- **IchigoJam BASIC** ([#1246](https://github.com/PrismJS/prism/issues/1246)) [[`cf840be`](https://github.com/PrismJS/prism/commit/cf840be)]
- **Io** ([#1251](https://github.com/PrismJS/prism/issues/1251)) [[`84ed3ed`](https://github.com/PrismJS/prism/commit/84ed3ed)]

### Updated components

- **BASIC**:
    - Make strings greedy [[`60114d0`](https://github.com/PrismJS/prism/commit/60114d0)]
- **C++**:
    - Add C++11 raw string feature ([#1254](https://github.com/PrismJS/prism/issues/1254)) [[`71595be`](https://github.com/PrismJS/prism/commit/71595be)]

### Updated plugins

- **Autoloader**:
    - Add support for `data-autoloader-path` ([#1242](https://github.com/PrismJS/prism/issues/1242)) [[`39360d6`](https://github.com/PrismJS/prism/commit/39360d6)]
- **Previewers**:
    - New plugin combining previous plugins Previewer: Base, Previewer: Angle, Previewer: Color, Previewer: Easing, Previewer: Gradient and Previewer: Time. ([#1244](https://github.com/PrismJS/prism/issues/1244)) [[`28e4b4c`](https://github.com/PrismJS/prism/commit/28e4b4c)]
- **Unescaped Markup**:
    - Make it work with any language ([#1265](https://github.com/PrismJS/prism/issues/1265)) [[`7bcdae7`](https://github.com/PrismJS/prism/commit/7bcdae7)]

### Other changes

- Add attribute `style` in `package.json` ([#1256](https://github.com/PrismJS/prism/issues/1256)) [[`a9b6785`](https://github.com/PrismJS/prism/commit/a9b6785)]

## 1.9.0 (2017-12-06)

### New components

- **Flow** [[`d27b70d`](https://github.com/PrismJS/prism/commit/d27b70d)]

### Updated components

- **CSS**:
    - Unicode characters in CSS properties ([#1227](https://github.com/PrismJS/prism/issues/1227)) [[`f234ea4`](https://github.com/PrismJS/prism/commit/f234ea4)]
- **JSX**:
    - JSX: Improve highlighting support. Fix [#1235](https://github.com/PrismJS/prism/issues/1235) and [#1236](https://github.com/PrismJS/prism/issues/1236) [[`f41c5cd`](https://github.com/PrismJS/prism/commit/f41c5cd)]
- **Markup**:
    - Make CSS and JS inclusions in Markup greedy. Fix [#1240](https://github.com/PrismJS/prism/issues/1240) [[`7dc1e45`](https://github.com/PrismJS/prism/commit/7dc1e45)]
- **PHP**:
    - Add support for multi-line strings. Fix [#1233](https://github.com/PrismJS/prism/issues/1233) [[`9a542a0`](https://github.com/PrismJS/prism/commit/9a542a0)]

### Updated plugins

- **Copy to clipboard**:
    - Fix test for native Clipboard. Fix [#1241](https://github.com/PrismJS/prism/issues/1241) [[`e7b5e82`](https://github.com/PrismJS/prism/commit/e7b5e82)]
    - Copy to clipboard: Update to v1.7.1. Fix [#1220](https://github.com/PrismJS/prism/issues/1220) [[`a1b85e3`](https://github.com/PrismJS/prism/commit/a1b85e3), [`af50e44`](https://github.com/PrismJS/prism/commit/af50e44)]
- **Line highlight**:
    - Fixes to compatibility of line number and line higlight plugins ([#1194](https://github.com/PrismJS/prism/issues/1194)) [[`e63058f`](https://github.com/PrismJS/prism/commit/e63058f), [`3842a91`](https://github.com/PrismJS/prism/commit/3842a91)]
- **Unescaped Markup**:
    - Fix ambiguity in documentation by improving examples. Fix [#1197](https://github.com/PrismJS/prism/issues/1197) [[`924784a`](https://github.com/PrismJS/prism/commit/924784a)]

### Other changes

- Allow any element being root instead of document. ([#1230](https://github.com/PrismJS/prism/issues/1230)) [[`69f2e2c`](https://github.com/PrismJS/prism/commit/69f2e2c), [`6e50d44`](https://github.com/PrismJS/prism/commit/6e50d44)]
- Coy Theme: The 'height' element makes code blocks the height of the browser canvas. ([#1224](https://github.com/PrismJS/prism/issues/1224)) [[`ac219d7`](https://github.com/PrismJS/prism/commit/ac219d7)]
- Download page: Fix implicitly declared variable [[`f986551`](https://github.com/PrismJS/prism/commit/f986551)]
- Download page: Add version number at the beginning of the generated files. Fix [#788](https://github.com/PrismJS/prism/issues/788) [[`928790d`](https://github.com/PrismJS/prism/commit/928790d)]

## 1.8.4 (2017-11-05)

### Updated components

- **ABAP**:
    - Regexp optimisation [[`e7b411e`](https://github.com/PrismJS/prism/commit/e7b411e)]
- **ActionScript**:
    - Fix XML regex + optimise [[`75d00d7`](https://github.com/PrismJS/prism/commit/75d00d7)]
- **Ada**:
    - Regexp simplification [[`e881fe3`](https://github.com/PrismJS/prism/commit/e881fe3)]
- **Apacheconf**:
    - Regexp optimisation [[`a065e61`](https://github.com/PrismJS/prism/commit/a065e61)]
- **APL**:
    - Regexp simplification [[`33297c4`](https://github.com/PrismJS/prism/commit/33297c4)]
- **AppleScript**:
    - Regexp optimisation [[`d879f36`](https://github.com/PrismJS/prism/commit/d879f36)]
- **Arduino**:
    - Don't use captures if not needed [[`16b338f`](https://github.com/PrismJS/prism/commit/16b338f)]
- **ASP.NET**:
    - Regexp optimisation [[`438926c`](https://github.com/PrismJS/prism/commit/438926c)]
- **AutoHotkey**:
    - Regexp simplification + don't use captures if not needed [[`5edfd2f`](https://github.com/PrismJS/prism/commit/5edfd2f)]
- **Bash**:
    - Regexp optimisation and simplification [[`75b9b29`](https://github.com/PrismJS/prism/commit/75b9b29)]
- **Bro**:
    - Regexp simplification + don't use captures if not needed [[`d4b9003`](https://github.com/PrismJS/prism/commit/d4b9003)]
- **C**:
    - Regexp optimisation + don't use captures if not needed [[`f61d487`](https://github.com/PrismJS/prism/commit/f61d487)]
- **C++**:
    - Fix operator regexp + regexp simplification + don't use captures if not needed [[`ffeb26e`](https://github.com/PrismJS/prism/commit/ffeb26e)]
- **C#**:
    - Remove duplicates in keywords + regexp optimisation + don't use captures if not needed [[`d28d178`](https://github.com/PrismJS/prism/commit/d28d178)]
- **C-like**:
    - Regexp simplification + don't use captures if not needed [[`918e0ff`](https://github.com/PrismJS/prism/commit/918e0ff)]
- **CoffeeScript**:
    - Regexp optimisation + don't use captures if not needed [[`5895978`](https://github.com/PrismJS/prism/commit/5895978)]
- **Crystal**:
    - Remove trailing comma [[`16979a3`](https://github.com/PrismJS/prism/commit/16979a3)]
- **CSS**:
    - Regexp simplification + don't use captures if not needed + handle multi-line style attributes [[`43d9f36`](https://github.com/PrismJS/prism/commit/43d9f36)]
- **CSS Extras**:
    - Regexp simplification [[`134ed70`](https://github.com/PrismJS/prism/commit/134ed70)]
- **D**:
    - Regexp optimisation [[`fbe39c9`](https://github.com/PrismJS/prism/commit/fbe39c9)]
- **Dart**:
    - Regexp optimisation [[`f24e919`](https://github.com/PrismJS/prism/commit/f24e919)]
- **Django**:
    - Regexp optimisation [[`a95c51d`](https://github.com/PrismJS/prism/commit/a95c51d)]
- **Docker**:
    - Regexp optimisation [[`27f99ff`](https://github.com/PrismJS/prism/commit/27f99ff)]
- **Eiffel**:
    - Regexp optimisation [[`b7cdea2`](https://github.com/PrismJS/prism/commit/b7cdea2)]
- **Elixir**:
    - Regexp optimisation + uniform behavior between ~r and ~s [[`5d12e80`](https://github.com/PrismJS/prism/commit/5d12e80)]
- **Erlang**:
    - Regexp optimisation [[`7547f83`](https://github.com/PrismJS/prism/commit/7547f83)]
- **F#**:
    - Regexp optimisation + don't use captures if not needed [[`7753fc4`](https://github.com/PrismJS/prism/commit/7753fc4)]
- **Gherkin**:
    - Regexp optimisation + don't use captures if not needed + added explanation comment on table-body regexp [[`f26197a`](https://github.com/PrismJS/prism/commit/f26197a)]
- **Git**:
    - Regexp optimisation [[`b9483b9`](https://github.com/PrismJS/prism/commit/b9483b9)]
- **GLSL**:
    - Regexp optimisation [[`e66d21b`](https://github.com/PrismJS/prism/commit/e66d21b)]
- **Go**:
    - Regexp optimisation + don't use captures if not needed [[`88caabb`](https://github.com/PrismJS/prism/commit/88caabb)]
- **GraphQL**:
    - Regexp optimisation and simplification [[`2474f06`](https://github.com/PrismJS/prism/commit/2474f06)]
- **Groovy**:
    - Regexp optimisation + don't use captures if not needed [[`e74e00c`](https://github.com/PrismJS/prism/commit/e74e00c)]
- **Haml**:
    - Regexp optimisation + don't use captures if not needed + fix typo in comment [[`23e3b43`](https://github.com/PrismJS/prism/commit/23e3b43)]
- **Handlebars**:
    - Regexp optimisation + don't use captures if not needed [[`09dbfce`](https://github.com/PrismJS/prism/commit/09dbfce)]
- **Haskell**:
    - Regexp simplification + don't use captures if not needed [[`f11390a`](https://github.com/PrismJS/prism/commit/f11390a)]
- **HTTP**:
    - Regexp simplification + don't use captures if not needed [[`37ef24e`](https://github.com/PrismJS/prism/commit/37ef24e)]
- **Icon**:
    - Regexp optimisation [[`9cf64a0`](https://github.com/PrismJS/prism/commit/9cf64a0)]
- **J**:
    - Regexp simplification [[`de15150`](https://github.com/PrismJS/prism/commit/de15150)]
- **Java**:
    - Don't use captures if not needed [[`96b35c8`](https://github.com/PrismJS/prism/commit/96b35c8)]
- **JavaScript**:
    - Regexp optimisation + don't use captures if not needed [[`93d4002`](https://github.com/PrismJS/prism/commit/93d4002)]
- **Jolie**:
    - Regexp optimisation + don't use captures if not needed + remove duplicates in keywords [[`a491f9e`](https://github.com/PrismJS/prism/commit/a491f9e)]
- **JSON**:
    - Make strings greedy, remove negative look-ahead for ":". Fix [#1204](https://github.com/PrismJS/prism/issues/1204) [[`98acd2d`](https://github.com/PrismJS/prism/commit/98acd2d)]
    - Regexp optimisation + don't use captures if not needed [[`8fc1b03`](https://github.com/PrismJS/prism/commit/8fc1b03)]
- **JSX**:
    - Regexp optimisation + handle spread operator as a whole [[`28de4e2`](https://github.com/PrismJS/prism/commit/28de4e2)]
- **Julia**:
    - Regexp optimisation and simplification [[`12684c0`](https://github.com/PrismJS/prism/commit/12684c0)]
- **Keyman**:
    - Regexp optimisation + don't use captures if not needed [[`9726087`](https://github.com/PrismJS/prism/commit/9726087)]
- **Kotlin**:
    - Regexp simplification [[`12ff8dc`](https://github.com/PrismJS/prism/commit/12ff8dc)]
- **LaTeX**:
    - Regexp optimisation and simplification [[`aa426b0`](https://github.com/PrismJS/prism/commit/aa426b0)]
- **LiveScript**:
    - Make interpolated strings greedy + fix variable and identifier regexps [[`c581049`](https://github.com/PrismJS/prism/commit/c581049)]
- **LOLCODE**:
    - Don't use captures if not needed [[`52903af`](https://github.com/PrismJS/prism/commit/52903af)]
- **Makefile**:
    - Regexp optimisation [[`20ae2e5`](https://github.com/PrismJS/prism/commit/20ae2e5)]
- **Markdown**:
    - Don't use captures if not needed [[`f489a1e`](https://github.com/PrismJS/prism/commit/f489a1e)]
- **Markup**:
    - Regexp optimisation + fix punctuation inside attr-value [[`ea380c6`](https://github.com/PrismJS/prism/commit/ea380c6)]
- **MATLAB**:
    - Make strings greedy + handle line feeds better [[`4cd4f01`](https://github.com/PrismJS/prism/commit/4cd4f01)]
- **Monkey**:
    - Don't use captures if not needed [[`7f47140`](https://github.com/PrismJS/prism/commit/7f47140)]
- **N4JS**:
    - Don't use captures if not needed [[`2d3f9df`](https://github.com/PrismJS/prism/commit/2d3f9df)]
- **NASM**:
    - Regexp optimisation and simplification + don't use captures if not needed [[`9937428`](https://github.com/PrismJS/prism/commit/9937428)]
- **nginx**:
    - Remove trailing comma + remove duplicates in keywords [[`c6e7195`](https://github.com/PrismJS/prism/commit/c6e7195)]
- **NSIS**:
    - Regexp optimisation + don't use captures if not needed [[`beeb107`](https://github.com/PrismJS/prism/commit/beeb107)]
- **Objective-C**:
    - Don't use captures if not needed [[`9be0f88`](https://github.com/PrismJS/prism/commit/9be0f88)]
- **OCaml**:
    - Regexp simplification [[`5f5f38c`](https://github.com/PrismJS/prism/commit/5f5f38c)]
- **OpenCL**:
    - Don't use captures if not needed [[`5e70f1d`](https://github.com/PrismJS/prism/commit/5e70f1d)]
- **Oz**:
    - Fix atom regexp [[`9320e92`](https://github.com/PrismJS/prism/commit/9320e92)]
- **PARI/GP**:
    - Regexp optimisation [[`2c7b59b`](https://github.com/PrismJS/prism/commit/2c7b59b)]
- **Parser**:
    - Regexp simplification [[`569d511`](https://github.com/PrismJS/prism/commit/569d511)]
- **Perl**:
    - Regexp optimisation and simplification + don't use captures if not needed [[`0fe4cf6`](https://github.com/PrismJS/prism/commit/0fe4cf6)]
- **PHP**:
    - Don't use captures if not needed Golmote [[`5235f18`](https://github.com/PrismJS/prism/commit/5235f18)]
- **PHP Extras**:
    - Add word boundary after global keywords + don't use captures if not needed [[`9049a2a`](https://github.com/PrismJS/prism/commit/9049a2a)]
- **PowerShell**:
    - Regexp optimisation + don't use captures if not needed [[`0d05957`](https://github.com/PrismJS/prism/commit/0d05957)]
- **Processing**:
    - Regexp simplification [[`8110d38`](https://github.com/PrismJS/prism/commit/8110d38)]
- **.properties**:
    - Regexp optimisation [[`678b621`](https://github.com/PrismJS/prism/commit/678b621)]
- **Protocol Buffers**:
    - Don't use captures if not needed [[`3e256d8`](https://github.com/PrismJS/prism/commit/3e256d8)]
- **Pug**:
    - Don't use captures if not needed [[`76dc925`](https://github.com/PrismJS/prism/commit/76dc925)]
- **Pure**:
    - Make inline-lang greedy [[`92318b0`](https://github.com/PrismJS/prism/commit/92318b0)]
- **Python**:
    - Add Python builtin function highlighting ([#1205](https://github.com/PrismJS/prism/issues/1205)) [[`2169c99`](https://github.com/PrismJS/prism/commit/2169c99)]
    - Python: Add highlighting to functions with space between name and parentheses ([#1207](https://github.com/PrismJS/prism/issues/1207)) [[`3badd8a`](https://github.com/PrismJS/prism/commit/3badd8a)]
    - Make triple-quoted strings greedy + regexp optimisation and simplification [[`f09f9f5`](https://github.com/PrismJS/prism/commit/f09f9f5)]
- **Qore**:
    - Regexp simplification [[`69459f0`](https://github.com/PrismJS/prism/commit/69459f0)]
- **R**:
    - Regexp optimisation [[`06a9da4`](https://github.com/PrismJS/prism/commit/06a9da4)]
- **Reason**:
    - Regexp optimisation + don't use capture if not needed [[`19d79b4`](https://github.com/PrismJS/prism/commit/19d79b4)]
- **Ren'py**:
    - Make strings greedy + don't use captures if not needed [[`91d84d9`](https://github.com/PrismJS/prism/commit/91d84d9)]
- **reST**:
    - Regexp simplification + don't use captures if not needed [[`1a8b3e9`](https://github.com/PrismJS/prism/commit/1a8b3e9)]
- **Rip**:
    - Regexp optimisation [[`d7f0ee8`](https://github.com/PrismJS/prism/commit/d7f0ee8)]
- **Ruby**:
    - Regexp optimisation and simplification + don't use captures if not needed [[`4902ed4`](https://github.com/PrismJS/prism/commit/4902ed4)]
- **Rust**:
    - Regexp optimisation and simplification + don't use captures if not needed [[`cc9d874`](https://github.com/PrismJS/prism/commit/cc9d874)]
- **Sass**:
    - Regexp simplification Golmote [[`165d957`](https://github.com/PrismJS/prism/commit/165d957)]
- **Scala**:
    - Regexp optimisation Golmote [[`5f50c12`](https://github.com/PrismJS/prism/commit/5f50c12)]
- **Scheme**:
    - Regexp optimisation [[`bd19b04`](https://github.com/PrismJS/prism/commit/bd19b04)]
- **SCSS**:
    - Regexp simplification [[`c60b7d4`](https://github.com/PrismJS/prism/commit/c60b7d4)]
- **Smalltalk**:
    - Regexp simplification [[`41a2c76`](https://github.com/PrismJS/prism/commit/41a2c76)]
- **Smarty**:
    - Regexp optimisation and simplification [[`e169be9`](https://github.com/PrismJS/prism/commit/e169be9)]
- **SQL**:
    - Regexp optimisation [[`a6244a4`](https://github.com/PrismJS/prism/commit/a6244a4)]
- **Stylus**:
    - Regexp optimisation [[`df9506c`](https://github.com/PrismJS/prism/commit/df9506c)]
- **Swift**:
    - Don't use captures if not needed [[`a2d737a`](https://github.com/PrismJS/prism/commit/a2d737a)]
- **Tcl**:
    - Regexp simplification + don't use captures if not needed [[`f0b8a33`](https://github.com/PrismJS/prism/commit/f0b8a33)]
- **Textile**:
    - Regexp optimisation + don't use captures if not needed [[`08139ad`](https://github.com/PrismJS/prism/commit/08139ad)]
- **Twig**:
    - Regexp optimisation and simplification + don't use captures if not needed [[`0b10fd0`](https://github.com/PrismJS/prism/commit/0b10fd0)]
- **TypeScript**:
    - Don't use captures if not needed [[`e296caf`](https://github.com/PrismJS/prism/commit/e296caf)]
- **Verilog**:
    - Regexp simplification [[`1b24b34`](https://github.com/PrismJS/prism/commit/1b24b34)]
- **VHDL**:
    - Regexp optimisation and simplification [[`7af36df`](https://github.com/PrismJS/prism/commit/7af36df)]
- **vim**:
    - Remove duplicates in keywords [[`700505e`](https://github.com/PrismJS/prism/commit/700505e)]
- **Wiki markup**:
    - Fix escaping consistency [[`1fd690d`](https://github.com/PrismJS/prism/commit/1fd690d)]
- **YAML**:
    - Regexp optimisation + don't use captures if not needed [[`1fd690d`](https://github.com/PrismJS/prism/commit/1fd690d)]

### Other changes

- Remove comments spellcheck for AMP validation ([#1106](https://github.com/PrismJS/prism/issues/1106)) [[`de996d7`](https://github.com/PrismJS/prism/commit/de996d7)]
- Prevent error from throwing when element does not have a parentNode in highlightElement. [[`c33be19`](https://github.com/PrismJS/prism/commit/c33be19)]
- Provide a way to load Prism from inside a Worker without listening to messages. ([#1188](https://github.com/PrismJS/prism/issues/1188)) [[`d09982d`](https://github.com/PrismJS/prism/commit/d09982d)]

## 1.8.3 (2017-10-19)

### Other changes

- Fix inclusion tests for Pug [[`955c2ab`](https://github.com/PrismJS/prism/commit/955c2ab)]

## 1.8.2 (2017-10-19)

### Updated components

- **Jade**:
    - Jade has been renamed to **Pug** ([#1201](https://github.com/PrismJS/prism/issues/1201)) [[`bcfef7c`](https://github.com/PrismJS/prism/commit/bcfef7c)]
- **JavaScript**:
    - Better highlighting of functions ([#1190](https://github.com/PrismJS/prism/issues/1190)) [[`8ee2cd3`](https://github.com/PrismJS/prism/commit/8ee2cd3)]

### Update plugins

- **Copy to clipboard**:
    - Fix error occurring when using in Chrome 61+ ([#1206](https://github.com/PrismJS/prism/issues/1206)) [[`b41d571`](https://github.com/PrismJS/prism/commit/b41d571)]
- **Show invisibles**:
    - Prevent error when using with Autoloader plugin ([#1195](https://github.com/PrismJS/prism/issues/1195)) [[`ed8bdb5`](https://github.com/PrismJS/prism/commit/ed8bdb5)]

## 1.8.1 (2017-09-16)

### Other changes

- Add Arduino to components.js [[`290a3c6`](https://github.com/PrismJS/prism/commit/290a3c6)]

## 1.8.0 (2017-09-16)

### New components

- **Arduino** ([#1184](https://github.com/PrismJS/prism/issues/1184)) [[`edf2454`](https://github.com/PrismJS/prism/commit/edf2454)]
- **OpenCL** ([#1175](https://github.com/PrismJS/prism/issues/1175)) [[`131e8fa`](https://github.com/PrismJS/prism/commit/131e8fa)]

### Updated plugins

- **Autolinker**:
    - Silently catch any error thrown by decodeURIComponent. Fixes [#1186](https://github.com/PrismJS/prism/issues/1186) [[`2e43fcf`](https://github.com/PrismJS/prism/commit/2e43fcf)]

## 1.7.0 (2017-09-09)

### New components

- **Django/Jinja2** ([#1085](https://github.com/PrismJS/prism/issues/1085)) [[`345b1b2`](https://github.com/PrismJS/prism/commit/345b1b2)]
- **N4JS** ([#1141](https://github.com/PrismJS/prism/issues/1141)) [[`eaa8ebb`](https://github.com/PrismJS/prism/commit/eaa8ebb)]
- **Ren'py** ([#658](https://github.com/PrismJS/prism/issues/658)) [[`7ab4013`](https://github.com/PrismJS/prism/commit/7ab4013)]
- **VB.Net** ([#1122](https://github.com/PrismJS/prism/issues/1122)) [[`5400651`](https://github.com/PrismJS/prism/commit/5400651)]

### Updated components

- **APL**:
    - Add left shoe underbar and right shoe underbar ([#1072](https://github.com/PrismJS/prism/issues/1072)) [[`12238c5`](https://github.com/PrismJS/prism/commit/12238c5)]
    - Update prism-apl.js ([#1126](https://github.com/PrismJS/prism/issues/1126)) [[`a5f3cdb`](https://github.com/PrismJS/prism/commit/a5f3cdb)]
- **C**:
    - Add more keywords and constants for C. ([#1029](https://github.com/PrismJS/prism/issues/1029)) [[`43a388e`](https://github.com/PrismJS/prism/commit/43a388e)]
- **C#**:
    - Fix wrong highlighting when three slashes appear inside string. Fix [#1091](https://github.com/PrismJS/prism/issues/1091) [[`dfb6f17`](https://github.com/PrismJS/prism/commit/dfb6f17)]
- **C-like**:
    - Add support for unclosed block comments. Close [#828](https://github.com/PrismJS/prism/issues/828) [[`3426ed1`](https://github.com/PrismJS/prism/commit/3426ed1)]
- **Crystal**:
    - Update Crystal keywords ([#1092](https://github.com/PrismJS/prism/issues/1092)) [[`125bff1`](https://github.com/PrismJS/prism/commit/125bff1)]
- **CSS Extras**:
    - Support CSS #RRGGBBAA ([#1139](https://github.com/PrismJS/prism/issues/1139)) [[`07a6806`](https://github.com/PrismJS/prism/commit/07a6806)]
- **Docker**:
    - Add dockerfile alias for docker language ([#1164](https://github.com/PrismJS/prism/issues/1164)) [[`601c47f`](https://github.com/PrismJS/prism/commit/601c47f)]
    - Update the list of keywords for dockerfiles ([#1180](https://github.com/PrismJS/prism/issues/1180)) [[`f0d73e0`](https://github.com/PrismJS/prism/commit/f0d73e0)]
- **Eiffel**:
    - Add class-name highlighting for Eiffel ([#471](https://github.com/PrismJS/prism/issues/471)) [[`cd03587`](https://github.com/PrismJS/prism/commit/cd03587)]
- **Handlebars**:
    - Check for possible pre-existing marker strings in Handlebars [[`7a1a404`](https://github.com/PrismJS/prism/commit/7a1a404)]
- **JavaScript**:
    - Properly match every operator as a whole token. Fix [#1133](https://github.com/PrismJS/prism/issues/1133) [[`9f649fb`](https://github.com/PrismJS/prism/commit/9f649fb)]
    - Allows uppercase prefixes in JS number literals ([#1151](https://github.com/PrismJS/prism/issues/1151)) [[`d4ee904`](https://github.com/PrismJS/prism/commit/d4ee904)]
    - Reduced backtracking in regex pattern. Fix [#1159](https://github.com/PrismJS/prism/issues/1159) [[`ac09e97`](https://github.com/PrismJS/prism/commit/ac09e97)]
- **JSON**:
    - Fix property and string patterns performance. Fix [#1080](https://github.com/PrismJS/prism/issues/1080) [[`0ca1353`](https://github.com/PrismJS/prism/commit/0ca1353)]
- **JSX**:
    - JSX spread operator break. Fixes [#1061](https://github.com/PrismJS/prism/issues/1061) ([#1094](https://github.com/PrismJS/prism/issues/1094)) [[`561bceb`](https://github.com/PrismJS/prism/commit/561bceb)]
    - Fix highlighting of attributes containing spaces [[`867ea42`](https://github.com/PrismJS/prism/commit/867ea42)]
    - Improved performance for tags (when not matching) Fix [#1152](https://github.com/PrismJS/prism/issues/1152) [[`b0fe103`](https://github.com/PrismJS/prism/commit/b0fe103)]
- **LOLCODE**:
    - Make strings greedy Golmote [[`1a5e7a4`](https://github.com/PrismJS/prism/commit/1a5e7a4)]
- **Markup**:
    - Support HTML entities in attribute values ([#1143](https://github.com/PrismJS/prism/issues/1143)) [[`1d5047d`](https://github.com/PrismJS/prism/commit/1d5047d)]
- **NSIS**:
    - Update patterns ([#1033](https://github.com/PrismJS/prism/issues/1033)) [[`01a59d8`](https://github.com/PrismJS/prism/commit/01a59d8)]
    - Add support for NSIS 3.02 ([#1169](https://github.com/PrismJS/prism/issues/1169)) [[`393b5f7`](https://github.com/PrismJS/prism/commit/393b5f7)]
- **PHP**:
    - Fix the PHP language ([#1100](https://github.com/PrismJS/prism/issues/1100)) [[`1453fa7`](https://github.com/PrismJS/prism/commit/1453fa7)]
    - Check for possible pre-existing marker strings in PHP [[`36bc560`](https://github.com/PrismJS/prism/commit/36bc560)]
- **Ruby**:
    - Fix slash regex performance. Fix [#1083](https://github.com/PrismJS/prism/issues/1083) [[`a708730`](https://github.com/PrismJS/prism/commit/a708730)]
    - Add support for =begin =end comments. Manual merge of [#1121](https://github.com/PrismJS/prism/issues/1121). [[`62cdaf8`](https://github.com/PrismJS/prism/commit/62cdaf8)]
- **Smarty**:
    - Check for possible pre-existing marker strings in Smarty [[`5df26e2`](https://github.com/PrismJS/prism/commit/5df26e2)]
- **TypeScript**:
    - Update typescript keywords ([#1064](https://github.com/PrismJS/prism/issues/1064)) [[`52020a0`](https://github.com/PrismJS/prism/commit/52020a0)]
    - Chmod -x prism-typescript component ([#1145](https://github.com/PrismJS/prism/issues/1145)) [[`afe0542`](https://github.com/PrismJS/prism/commit/afe0542)]
- **YAML**:
    - Make strings greedy (partial fix for [#1075](https://github.com/PrismJS/prism/issues/1075)) [[`565a2cc`](https://github.com/PrismJS/prism/commit/565a2cc)]

### Updated plugins

- **Autolinker**:
    - Fixed an rendering issue for encoded urls ([#1173](https://github.com/PrismJS/prism/issues/1173)) [[`abc007f`](https://github.com/PrismJS/prism/commit/abc007f)]
- **Custom Class**:
    - Add missing noCSS property for the Custom Class plugin [[`ba64f8d`](https://github.com/PrismJS/prism/commit/ba64f8d)]
    - Added a default for classMap. Fixes [#1137](https://github.com/PrismJS/prism/issues/1137). ([#1157](https://github.com/PrismJS/prism/issues/1157)) [[`5400af9`](https://github.com/PrismJS/prism/commit/5400af9)]
- **Keep Markup**:
    - Store highlightedCode after reinserting markup. Fix [#1127](https://github.com/PrismJS/prism/issues/1127) [[`6df2ceb`](https://github.com/PrismJS/prism/commit/6df2ceb)]
- **Line Highlight**:
    - Cleanup left-over line-highlight tags before other plugins run [[`79b723d`](https://github.com/PrismJS/prism/commit/79b723d)]
    - Avoid conflict between line-highlight and other plugins [[`224fdb8`](https://github.com/PrismJS/prism/commit/224fdb8)]
- **Line Numbers**:
    - Support soft wrap for line numbers plugin ([#584](https://github.com/PrismJS/prism/issues/584)) [[`849f1d6`](https://github.com/PrismJS/prism/commit/849f1d6)]
    - Plugins fixes (unescaped-markup, line-numbers) ([#1012](https://github.com/PrismJS/prism/issues/1012)) [[`3fb7cf8`](https://github.com/PrismJS/prism/commit/3fb7cf8)]
- **Normalize Whitespace**:
    - Add Node.js support for the normalize-whitespace plugin [[`6c7dae2`](https://github.com/PrismJS/prism/commit/6c7dae2)]
- **Unescaped Markup**:
    - Plugins fixes (unescaped-markup, line-numbers) ([#1012](https://github.com/PrismJS/prism/issues/1012)) [[`3fb7cf8`](https://github.com/PrismJS/prism/commit/3fb7cf8)]

### Updated themes

- **Coy**:
    - Scroll 'Coy' background with contents ([#1163](https://github.com/PrismJS/prism/issues/1163)) [[`310990b`](https://github.com/PrismJS/prism/commit/310990b)]

### Other changes

- Initial implementation of manual highlighting ([#1087](https://github.com/PrismJS/prism/issues/1087)) [[`bafc4cb`](https://github.com/PrismJS/prism/commit/bafc4cb)]
- Remove dead link in Third-party tutorials section. Fixes [#1028](https://github.com/PrismJS/prism/issues/1028) [[`dffadc6`](https://github.com/PrismJS/prism/commit/dffadc6)]
- Most languages now use the greedy flag for better highlighting [[`7549ecc`](https://github.com/PrismJS/prism/commit/7549ecc)]
- .npmignore: Unignore components.js ([#1108](https://github.com/PrismJS/prism/issues/1108)) [[`1f699e7`](https://github.com/PrismJS/prism/commit/1f699e7)]
- Run before-highlight and after-highlight hooks even when no grammar is found. Fix [#1134](https://github.com/PrismJS/prism/issues/1134) [[`70cb472`](https://github.com/PrismJS/prism/commit/70cb472)]
- Replace [\w\W] with [\s\S] and [0-9] with \d in regexes ([#1107](https://github.com/PrismJS/prism/issues/1107)) [[`8aa2cc4`](https://github.com/PrismJS/prism/commit/8aa2cc4)]
- Fix corner cases for the greedy flag ([#1095](https://github.com/PrismJS/prism/issues/1095)) [[`6530709`](https://github.com/PrismJS/prism/commit/6530709)]
- Add Third Party Tutorial ([#1156](https://github.com/PrismJS/prism/issues/1156)) [[`c34e57b`](https://github.com/PrismJS/prism/commit/c34e57b)]
- Add Composer support ([#648](https://github.com/PrismJS/prism/issues/648)) [[`2989633`](https://github.com/PrismJS/prism/commit/2989633)]
- Remove IE8 plugin ([#992](https://github.com/PrismJS/prism/issues/992)) [[`25788eb`](https://github.com/PrismJS/prism/commit/25788eb)]
- Website: remove width and height on logo.svg, so it becomes scalable. Close [#1005](https://github.com/PrismJS/prism/issues/1005) [[`0621ff7`](https://github.com/PrismJS/prism/commit/0621ff7)]
- Remove yarn.lock ([#1098](https://github.com/PrismJS/prism/issues/1098)) [[`11eed25`](https://github.com/PrismJS/prism/commit/11eed25)]

## 1.6.0 (2016-12-03)

### New components

- **.properties** ([#980](https://github.com/PrismJS/prism/issues/980)) [[`be6219a`](https://github.com/PrismJS/prism/commit/be6219a)]
- **Ada** ([#949](https://github.com/PrismJS/prism/issues/949)) [[`65619f7`](https://github.com/PrismJS/prism/commit/65619f7)]
- **GraphQL** ([#971](https://github.com/PrismJS/prism/issues/971)) [[`e018087`](https://github.com/PrismJS/prism/commit/e018087)]
- **Jolie** ([#1014](https://github.com/PrismJS/prism/issues/1014)) [[`dfc1941`](https://github.com/PrismJS/prism/commit/dfc1941)]
- **LiveScript** ([#982](https://github.com/PrismJS/prism/issues/982)) [[`62e258c`](https://github.com/PrismJS/prism/commit/62e258c)]
- **Reason** (Fixes [#1046](https://github.com/PrismJS/prism/issues/1046)) [[`3cae6ce`](https://github.com/PrismJS/prism/commit/3cae6ce)]
- **Xojo** ([#994](https://github.com/PrismJS/prism/issues/994)) [[`0224b7c`](https://github.com/PrismJS/prism/commit/0224b7c)]

### Updated components

- **APL**:
    - Add iota underbar ([#1024](https://github.com/PrismJS/prism/issues/1024)) [[`3c5c89a`](https://github.com/PrismJS/prism/commit/3c5c89a), [`ac21d33`](https://github.com/PrismJS/prism/commit/ac21d33)]
- **AsciiDoc**:
    - Optimized block regexps to prevent struggling on large files. Fixes [#1001](https://github.com/PrismJS/prism/issues/1001). [[`1a86d34`](https://github.com/PrismJS/prism/commit/1a86d34)]
- **Bash**:
    - Add `npm` to function list ([#969](https://github.com/PrismJS/prism/issues/969)) [[`912bdfe`](https://github.com/PrismJS/prism/commit/912bdfe)]
- **CSS**:
    - Make CSS strings greedy. Fix [#1013](https://github.com/PrismJS/prism/issues/1013). [[`e57e26d`](https://github.com/PrismJS/prism/commit/e57e26d)]
- **CSS Extras**:
    - Match attribute inside selectors [[`13fed76`](https://github.com/PrismJS/prism/commit/13fed76)]
- **Groovy**:
    - Fix order of decoding entities in groovy. Fixes [#1049](https://github.com/PrismJS/prism/issues/1049) ([#1050](https://github.com/PrismJS/prism/issues/1050)) [[`d75da8e`](https://github.com/PrismJS/prism/commit/d75da8e)]
- **Ini**:
    - Remove important token in ini definition ([#1047](https://github.com/PrismJS/prism/issues/1047)) [[`fe8ad8b`](https://github.com/PrismJS/prism/commit/fe8ad8b)]
- **JavaScript**:
    - Add exponentiation & spread/rest operator ([#991](https://github.com/PrismJS/prism/issues/991)) [[`b2de65a`](https://github.com/PrismJS/prism/commit/b2de65a), [`268d01e`](https://github.com/PrismJS/prism/commit/268d01e)]
- **JSON**:
    - JSON: Fixed issues with properties and strings + added tests. Fix [#1025](https://github.com/PrismJS/prism/issues/1025) [[`25a541d`](https://github.com/PrismJS/prism/commit/25a541d)]
- **Markup**:
    - Allow for dots in Markup tag names, but not in HTML tags included in Textile. Fixes [#888](https://github.com/PrismJS/prism/issues/888). [[`31ea66b`](https://github.com/PrismJS/prism/commit/31ea66b)]
    - Make doctype case-insensitive ([#1009](https://github.com/PrismJS/prism/issues/1009)) [[`3dd7219`](https://github.com/PrismJS/prism/commit/3dd7219)]
- **NSIS**:
    - Updated patterns ([#1032](https://github.com/PrismJS/prism/issues/1032)) [[`76ba1b8`](https://github.com/PrismJS/prism/commit/76ba1b8)]
- **PHP**:
    - Make comments greedy. Fix [#197](https://github.com/PrismJS/prism/issues/197) [[`318aab3`](https://github.com/PrismJS/prism/commit/318aab3)]
- **PowerShell**:
    - Fix highlighting of empty comments ([#977](https://github.com/PrismJS/prism/issues/977)) [[`4fda477`](https://github.com/PrismJS/prism/commit/4fda477)]
- **Puppet**:
    - Fix over-greedy regexp detection ([#978](https://github.com/PrismJS/prism/issues/978)) [[`105be25`](https://github.com/PrismJS/prism/commit/105be25)]
- **Ruby**:
    - Fix typo `Fload` to `Float` in prism-ruby.js ([#1023](https://github.com/PrismJS/prism/issues/1023)) [[`22cb018`](https://github.com/PrismJS/prism/commit/22cb018)]
    - Make strings greedy. Fixes [#1048](https://github.com/PrismJS/prism/issues/1048) [[`8b0520a`](https://github.com/PrismJS/prism/commit/8b0520a)]
- **SCSS**:
    - Alias statement as keyword. Fix [#246](https://github.com/PrismJS/prism/issues/246) [[`fd09391`](https://github.com/PrismJS/prism/commit/fd09391)]
    - Highlight variables inside selectors and properties. [[`d6b5c2f`](https://github.com/PrismJS/prism/commit/d6b5c2f)]
    - Highlight parent selector [[`8f5f1fa`](https://github.com/PrismJS/prism/commit/8f5f1fa)]
- **TypeScript**:
    - Add missing `from` keyword to typescript & set `ts` as alias. ([#1042](https://github.com/PrismJS/prism/issues/1042)) [[`cba78f3`](https://github.com/PrismJS/prism/commit/cba78f3)]

### New plugins

- **Copy to Clipboard** ([#891](https://github.com/PrismJS/prism/issues/891)) [[`07b81ac`](https://github.com/PrismJS/prism/commit/07b81ac)]
- **Custom Class** ([#950](https://github.com/PrismJS/prism/issues/950)) [[`a0bd686`](https://github.com/PrismJS/prism/commit/a0bd686)]
- **Data-URI Highlight** ([#996](https://github.com/PrismJS/prism/issues/996)) [[`bdca61b`](https://github.com/PrismJS/prism/commit/bdca61b)]
- **Toolbar** ([#891](https://github.com/PrismJS/prism/issues/891)) [[`07b81ac`](https://github.com/PrismJS/prism/commit/07b81ac)]

### Updated plugins

- **Autoloader**:
    - Updated documentation for Autoloader plugin [[`b4f3423`](https://github.com/PrismJS/prism/commit/b4f3423)]
        - Download all grammars as a zip from Autoloader plugin page ([#981](https://github.com/PrismJS/prism/issues/981)) [[`0d0a007`](https://github.com/PrismJS/prism/commit/0d0a007), [`5c815d3`](https://github.com/PrismJS/prism/commit/5c815d3)]
        - Removed duplicated script on Autoloader plugin page [[`9671996`](https://github.com/PrismJS/prism/commit/9671996)]
        - Don't try to load "none" component. Fix [#1000](https://github.com/PrismJS/prism/issues/1000) [[`f89b0b9`](https://github.com/PrismJS/prism/commit/f89b0b9)]
- **WPD**:
    - Fix at-rule detection + don't process if language is not handled [[`2626728`](https://github.com/PrismJS/prism/commit/2626728)]

### Other changes

- Improvement to greedy-flag ([#967](https://github.com/PrismJS/prism/issues/967)) [[`500121b`](https://github.com/PrismJS/prism/commit/500121b), [`9893489`](https://github.com/PrismJS/prism/commit/9893489)]
- Add setTimeout fallback for requestAnimationFrame. Fixes [#987](https://github.com/PrismJS/prism/issues/987). ([#988](https://github.com/PrismJS/prism/issues/988)) [[`c9bdcd3`](https://github.com/PrismJS/prism/commit/c9bdcd3)]
- Added aria-hidden attributes on elements created by the Line Highlight and Line Numbers plugins. Fixes [#574](https://github.com/PrismJS/prism/issues/574). [[`e5587a7`](https://github.com/PrismJS/prism/commit/e5587a7)]
- Don't insert space before ">" when there is no attributes [[`3dc8c9e`](https://github.com/PrismJS/prism/commit/3dc8c9e)]
- Added missing hooks-related tests for AsciiDoc, Groovy, Handlebars, Markup, PHP and Smarty [[`c1a0c1b`](https://github.com/PrismJS/prism/commit/c1a0c1b)]
- Fix issue when using Line numbers plugin and Normalise whitespace plugin together with Handlebars, PHP or Smarty. Fix [#1018](https://github.com/PrismJS/prism/issues/1018), [#997](https://github.com/PrismJS/prism/issues/997), [#935](https://github.com/PrismJS/prism/issues/935). Revert [#998](https://github.com/PrismJS/prism/issues/998). [[`86aa3d2`](https://github.com/PrismJS/prism/commit/86aa3d2)]
- Optimized logo ([#990](https://github.com/PrismJS/prism/issues/990)) ([#1002](https://github.com/PrismJS/prism/issues/1002)) [[`f69e570`](https://github.com/PrismJS/prism/commit/f69e570), [`218fd25`](https://github.com/PrismJS/prism/commit/218fd25)]
- Remove unneeded prefixed CSS ([#989](https://github.com/PrismJS/prism/issues/989)) [[`5e56833`](https://github.com/PrismJS/prism/commit/5e56833)]
- Optimize images ([#1007](https://github.com/PrismJS/prism/issues/1007)) [[`b2fa6d5`](https://github.com/PrismJS/prism/commit/b2fa6d5)]
- Add yarn.lock to .gitignore ([#1035](https://github.com/PrismJS/prism/issues/1035)) [[`03ecf74`](https://github.com/PrismJS/prism/commit/03ecf74)]
- Fix greedy flag bug. Fixes [#1039](https://github.com/PrismJS/prism/issues/1039) [[`32cd99f`](https://github.com/PrismJS/prism/commit/32cd99f)]
- Ruby: Fix test after [#1023](https://github.com/PrismJS/prism/issues/1023) [[`b15d43b`](https://github.com/PrismJS/prism/commit/b15d43b)]
- Ini: Fix test after [#1047](https://github.com/PrismJS/prism/issues/1047) [[`25cdd3f`](https://github.com/PrismJS/prism/commit/25cdd3f)]
- Reduce risk of XSS ([#1051](https://github.com/PrismJS/prism/issues/1051)) [[`17e33bc`](https://github.com/PrismJS/prism/commit/17e33bc)]
- env.code can be modified by before-sanity-check hook even when using language-none. Fix [#1066](https://github.com/PrismJS/prism/issues/1066) [[`83bafbd`](https://github.com/PrismJS/prism/commit/83bafbd)]

## 1.5.1 (2016-06-05)

### Updated components

- **Normalize Whitespace**:
    - Add class that disables the normalize whitespace plugin [[`9385c54`](https://github.com/PrismJS/prism/commit/9385c54)]
- **JavaScript Language**:
    - Rearrange the `string` and `template-string` token in JavaScript [[`1158e46`](https://github.com/PrismJS/prism/commit/1158e46)]
- **SQL Language**:
    - add delimeter and delimeters keywords to sql ([#958](https://github.com/PrismJS/prism/pull/958)) [[`a9ef24e`](https://github.com/PrismJS/prism/commit/a9ef24e)]
    - add AUTO_INCREMENT and DATE keywords to sql ([#954](https://github.com/PrismJS/prism/pull/954)) [[`caea2af`](https://github.com/PrismJS/prism/commit/caea2af)]
- **Diff Language**:
    - Highlight diff lines with only + or - ([#952](https://github.com/PrismJS/prism/pull/952)) [[`4d0526f`](https://github.com/PrismJS/prism/commit/4d0526f)]

### Other changes

- Allow for asynchronous loading of prism.js ([#959](https://github.com/PrismJS/prism/pull/959))
- Use toLowerCase on language names ([#957](https://github.com/PrismJS/prism/pull/957)) [[`acd9508`](https://github.com/PrismJS/prism/commit/acd9508)]
- link to index for basic usage - fixes [#945](https://github.com/PrismJS/prism/issues/945) ([#946](https://github.com/PrismJS/prism/pull/946)) [[`6c772d8`](https://github.com/PrismJS/prism/commit/6c772d8)]
- Fixed monospace typo ([#953](https://github.com/PrismJS/prism/pull/953)) [[`e6c3498`](https://github.com/PrismJS/prism/commit/e6c3498)]

## 1.5.0 (2016-05-01)

### New components

- **Bro Language** ([#925](https://github.com/PrismJS/prism/pull/925))
- **Protocol Buffers Language** ([#938](https://github.com/PrismJS/prism/pull/938)) [[`ae4a4f2`](https://github.com/PrismJS/prism/commit/ae4a4f2)]

### Updated components

- **Keep Markup**:
    - Fix Keep Markup plugin incorrect highlighting ([#880](https://github.com/PrismJS/prism/pull/880)) [[`24841ef`](https://github.com/PrismJS/prism/commit/24841ef)]
- **Groovy Language**:
    - Fix double HTML-encoding bug in Groovy language [[`24a0936`](https://github.com/PrismJS/prism/commit/24a0936)]
- **Java Language**:
    - Adding annotation token for Java ([#905](https://github.com/PrismJS/prism/pull/905)) [[`367ace6`](https://github.com/PrismJS/prism/commit/367ace6)]
- **SAS Language**:
    - Add missing keywords for SAS ([#922](https://github.com/PrismJS/prism/pull/922))
- **YAML Language**:
    - fix hilighting of YAML keys on first line of code block ([#943](https://github.com/PrismJS/prism/pull/943)) [[`f19db81`](https://github.com/PrismJS/prism/commit/f19db81)]
- **C# Language**:
    - Support for generic methods in csharp [[`6f75735`](https://github.com/PrismJS/prism/commit/6f75735)]

### New plugins

- **Unescaped Markup** [[`07d77e5`](https://github.com/PrismJS/prism/commit/07d77e5)]
- **Normalize Whitespace** ([#847](https://github.com/PrismJS/prism/pull/847)) [[`e86ec01`](https://github.com/PrismJS/prism/commit/e86ec01)]

### Other changes

- Add JSPM support [[`ad048ab`](https://github.com/PrismJS/prism/commit/ad048ab)]
- update linear-gradient syntax from `left` to `to right` [[`cd234dc`](https://github.com/PrismJS/prism/commit/cd234dc)]
- Add after-property to allow ordering of plugins [[`224b7a1`](https://github.com/PrismJS/prism/commit/224b7a1)]
- Partial solution for the "Comment-like substrings"-problem [[`2705c50`](https://github.com/PrismJS/prism/commit/2705c50)]
- Add property 'aliasTitles' to components.js [[`54400fb`](https://github.com/PrismJS/prism/commit/54400fb)]
- Add before-highlightall hook [[`70a8602`](https://github.com/PrismJS/prism/commit/70a8602)]
- Fix catastrophic backtracking regex issues in JavaScript [[`ab65be2`](https://github.com/PrismJS/prism/commit/ab65be2)]

## 1.4.1 (2016-02-03)

### Other changes

- Fix DFS bug in Prism core [[`b86c727`](https://github.com/PrismJS/prism/commit/b86c727)]

## 1.4.0 (2016-02-03)

### New components

- **Solarized Light** ([#855](https://github.com/PrismJS/prism/pull/855)) [[`70846ba`](https://github.com/PrismJS/prism/commit/70846ba)]
- **JSON** ([#370](https://github.com/PrismJS/prism/pull/370)) [[`ad2fcd0`](https://github.com/PrismJS/prism/commit/ad2fcd0)]

### Updated components

- **Show Language**:
    - Remove data-language attribute ([#840](https://github.com/PrismJS/prism/pull/840)) [[`eb9a83c`](https://github.com/PrismJS/prism/commit/eb9a83c)]
    - Allow custom label without a language mapping ([#837](https://github.com/PrismJS/prism/pull/837)) [[`7e74aef`](https://github.com/PrismJS/prism/commit/7e74aef)]
- **JSX**:
    - Better Nesting in JSX attributes ([#842](https://github.com/PrismJS/prism/pull/842)) [[`971dda7`](https://github.com/PrismJS/prism/commit/971dda7)]
- **File Highlight**:
    - Defer File Highlight until the full DOM has loaded. ([#844](https://github.com/PrismJS/prism/pull/844)) [[`6f995ef`](https://github.com/PrismJS/prism/commit/6f995ef)]
- **Coy Theme**:
    - Fix coy theme shadows ([#865](https://github.com/PrismJS/prism/pull/865)) [[`58d2337`](https://github.com/PrismJS/prism/commit/58d2337)]
- **Show Invisibles**:
    - Ensure show-invisibles compat with autoloader ([#874](https://github.com/PrismJS/prism/pull/874)) [[`c3cfb1f`](https://github.com/PrismJS/prism/commit/c3cfb1f)]
    - Add support for the space character for the show-invisibles plugin ([#876](https://github.com/PrismJS/prism/pull/876)) [[`05442d3`](https://github.com/PrismJS/prism/commit/05442d3)]

### New plugins

- **Command Line** ([#831](https://github.com/PrismJS/prism/pull/831)) [[`8378906`](https://github.com/PrismJS/prism/commit/8378906)]

### Other changes

- Use document.currentScript instead of document.getElementsByTagName() [[`fa98743`](https://github.com/PrismJS/prism/commit/fa98743)]
- Add prefix for Firefox selection and move prefixed rule first [[`6d54717`](https://github.com/PrismJS/prism/commit/6d54717)]
- No background for `<code>` in `<pre>` [[`8c310bc`](https://github.com/PrismJS/prism/commit/8c310bc)]
- Fixing to initial copyright year [[`69cbf7a`](https://github.com/PrismJS/prism/commit/69cbf7a)]
- Simplify the “lang” regex [[`417f54a`](https://github.com/PrismJS/prism/commit/417f54a)]
- Fix broken heading links [[`a7f9e62`](https://github.com/PrismJS/prism/commit/a7f9e62)]
- Prevent infinite recursion in DFS [[`02894e1`](https://github.com/PrismJS/prism/commit/02894e1)]
- Fix incorrect page title [[`544b56f`](https://github.com/PrismJS/prism/commit/544b56f)]
- Link scss to webplatform wiki [[`08d979a`](https://github.com/PrismJS/prism/commit/08d979a)]
- Revert white-space to normal when code is inline instead of in a pre [[`1a971b5`](https://github.com/PrismJS/prism/commit/1a971b5)]

## 1.3.0 (2015-10-26)

### New components

- **AsciiDoc** ([#800](https://github.com/PrismJS/prism/issues/800)) [[`6803ca0`](https://github.com/PrismJS/prism/commit/6803ca0)]
- **Haxe** ([#811](https://github.com/PrismJS/prism/issues/811)) [[`bd44341`](https://github.com/PrismJS/prism/commit/bd44341)]
- **Icon** ([#803](https://github.com/PrismJS/prism/issues/803)) [[`b43c5f3`](https://github.com/PrismJS/prism/commit/b43c5f3)]
- **Kotlin** ([#814](https://github.com/PrismJS/prism/issues/814)) [[`e8a31a5`](https://github.com/PrismJS/prism/commit/e8a31a5)]
- **Lua** ([#804](https://github.com/PrismJS/prism/issues/804)) [[`a36bc4a`](https://github.com/PrismJS/prism/commit/a36bc4a)]
- **Nix** ([#795](https://github.com/PrismJS/prism/issues/795)) [[`9b275c8`](https://github.com/PrismJS/prism/commit/9b275c8)]
- **Oz** ([#805](https://github.com/PrismJS/prism/issues/805)) [[`388c53f`](https://github.com/PrismJS/prism/commit/388c53f)]
- **PARI/GP** ([#802](https://github.com/PrismJS/prism/issues/802)) [[`253c035`](https://github.com/PrismJS/prism/commit/253c035)]
- **Parser** ([#808](https://github.com/PrismJS/prism/issues/808)) [[`a953b3a`](https://github.com/PrismJS/prism/commit/a953b3a)]
- **Puppet** ([#813](https://github.com/PrismJS/prism/issues/813)) [[`81933ee`](https://github.com/PrismJS/prism/commit/81933ee)]
- **Roboconf** ([#812](https://github.com/PrismJS/prism/issues/812)) [[`f5db346`](https://github.com/PrismJS/prism/commit/f5db346)]

### Updated components

- **C**:
    - Highlight directives in preprocessor lines ([#801](https://github.com/PrismJS/prism/issues/801)) [[`ad316a3`](https://github.com/PrismJS/prism/commit/ad316a3)]
- **C#**:
    - Highlight directives in preprocessor lines ([#801](https://github.com/PrismJS/prism/issues/801)) [[`ad316a3`](https://github.com/PrismJS/prism/commit/ad316a3)]
    - Fix detection of float numbers ([#806](https://github.com/PrismJS/prism/issues/806)) [[`1dae72b`](https://github.com/PrismJS/prism/commit/1dae72b)]
- **F#**:
    - Highlight directives in preprocessor lines ([#801](https://github.com/PrismJS/prism/issues/801)) [[`ad316a3`](https://github.com/PrismJS/prism/commit/ad316a3)]
- **JavaScript**:
    - Highlight true and false as booleans ([#801](https://github.com/PrismJS/prism/issues/801)) [[`ad316a3`](https://github.com/PrismJS/prism/commit/ad316a3)]
- **Python**:
    - Highlight triple-quoted strings before comments. Fix [#815](https://github.com/PrismJS/prism/issues/815) [[`90fbf0b`](https://github.com/PrismJS/prism/commit/90fbf0b)]

### New plugins

- **Previewer: Time** ([#790](https://github.com/PrismJS/prism/issues/790)) [[`88173de`](https://github.com/PrismJS/prism/commit/88173de)]
- **Previewer: Angle** ([#791](https://github.com/PrismJS/prism/issues/791)) [[`a434c86`](https://github.com/PrismJS/prism/commit/a434c86)]

### Other changes

- Increase mocha's timeout [[`f1c41db`](https://github.com/PrismJS/prism/commit/f1c41db)]
- Prevent most errors in IE8. Fix [#9](https://github.com/PrismJS/prism/issues/9) [[`9652d75`](https://github.com/PrismJS/prism/commit/9652d75)]
- Add U.S. Web Design Standards on homepage. Fix [#785](https://github.com/PrismJS/prism/issues/785) [[`e10d48b`](https://github.com/PrismJS/prism/commit/e10d48b), [`79ebbf8`](https://github.com/PrismJS/prism/commit/79ebbf8), [`2f7088d`](https://github.com/PrismJS/prism/commit/2f7088d)]
- Added gulp task to autolink PRs and commits in changelog [[`5ec4e4d`](https://github.com/PrismJS/prism/commit/5ec4e4d)]
- Use child processes to run each set of tests, in order to deal with the memory leak in vm.runInNewContext() [[`9a4b6fa`](https://github.com/PrismJS/prism/commit/9a4b6fa)]

## 1.2.0 (2015-10-07)

### New components

- **Batch** ([#781](https://github.com/PrismJS/prism/issues/781)) [[`eab5b06`](https://github.com/PrismJS/prism/commit/eab5b06)]

### Updated components

- **ASP.NET**:
    - Simplified pattern for `<script>` [[`29643f4`](https://github.com/PrismJS/prism/issues/29643f4)]
- **Bash**:
    - Fix regression in strings ([#792](https://github.com/PrismJS/prism/issues/792)) [[`bd275c2`](https://github.com/PrismJS/prism/commit/bd275c2)]
    - Substantially reduce wrongly highlighted stuff ([#793](https://github.com/PrismJS/prism/issues/793)) [[`ac6fe2e`](https://github.com/PrismJS/prism/commit/ac6fe2e)]
- **CSS**:
    - Simplified pattern for `<style>` [[`29643f4`](https://github.com/PrismJS/prism/issues/29643f4)]
- **JavaScript**:
    - Simplified pattern for `<script>` [[`29643f4`](https://github.com/PrismJS/prism/issues/29643f4)]

### New plugins

- **Previewer: Gradient** ([#783](https://github.com/PrismJS/prism/issues/783)) [[`9a63483`](https://github.com/PrismJS/prism/commit/9a63483)]

### Updated plugins

- **Previewer: Color**

    - Add support for Sass variables [[`3a1fb04`](https://github.com/PrismJS/prism/commit/3a1fb04)]

- **Previewer: Easing**
    - Add support for Sass variables [[`7c7ab4e`](https://github.com/PrismJS/prism/commit/7c7ab4e)]

### Other changes

- Test runner: Allow to run tests for only some languages [[`5ade8a5`](https://github.com/PrismJS/prism/issues/5ade8a5)]
- Download page: Fixed wrong components order raising error in generated file ([#797](https://github.com/PrismJS/prism/issues/787)) [[`7a6aed8`](https://github.com/PrismJS/prism/commit/7a6aed8)]

## 1.1.0 (2015-10-04)

### New components

- **ABAP** ([#636](https://github.com/PrismJS/prism/issues/636)) [[`75b0328`](https://github.com/PrismJS/prism/commit/75b0328), [`0749129`](https://github.com/PrismJS/prism/commit/0749129)]
- **APL** ([#308](https://github.com/PrismJS/prism/issues/308)) [[`1f45942`](https://github.com/PrismJS/prism/commit/1f45942), [`33a295f`](https://github.com/PrismJS/prism/commit/33a295f)]
- **AutoIt** ([#771](https://github.com/PrismJS/prism/issues/771)) [[`211a41c`](https://github.com/PrismJS/prism/commit/211a41c)]
- **BASIC** ([#620](https://github.com/PrismJS/prism/issues/620)) [[`805a0ce`](https://github.com/PrismJS/prism/commit/805a0ce)]
- **Bison** ([#764](https://github.com/PrismJS/prism/issues/764)) [[`7feb135`](https://github.com/PrismJS/prism/commit/7feb135)]
- **Crystal** ([#780](https://github.com/PrismJS/prism/issues/780)) [[`5b473de`](https://github.com/PrismJS/prism/commit/5b473de), [`414848d`](https://github.com/PrismJS/prism/commit/414848d)]
- **D** ([#613](https://github.com/PrismJS/prism/issues/613)) [[`b5e741c`](https://github.com/PrismJS/prism/commit/b5e741c)]
- **Diff** ([#450](https://github.com/PrismJS/prism/issues/450)) [[`ef41c74`](https://github.com/PrismJS/prism/commit/ef41c74)]
- **Docker** ([#576](https://github.com/PrismJS/prism/issues/576)) [[`e808352`](https://github.com/PrismJS/prism/commit/e808352)]
- **Elixir** ([#614](https://github.com/PrismJS/prism/issues/614)) [[`a1c028c`](https://github.com/PrismJS/prism/commit/a1c028c), [`c451611`](https://github.com/PrismJS/prism/commit/c451611), [`2e637f0`](https://github.com/PrismJS/prism/commit/2e637f0), [`ccb6566`](https://github.com/PrismJS/prism/commit/ccb6566)]
- **GLSL** ([#615](https://github.com/PrismJS/prism/issues/615)) [[`247da05`](https://github.com/PrismJS/prism/commit/247da05)]
- **Inform 7** ([#616](https://github.com/PrismJS/prism/issues/616)) [[`d2595b4`](https://github.com/PrismJS/prism/commit/d2595b4)]
- **J** ([#623](https://github.com/PrismJS/prism/issues/623)) [[`0cc50b2`](https://github.com/PrismJS/prism/commit/0cc50b2)]
- **MEL** ([#618](https://github.com/PrismJS/prism/issues/618)) [[`8496c14`](https://github.com/PrismJS/prism/commit/8496c14)]
- **Mizar** ([#619](https://github.com/PrismJS/prism/issues/619)) [[`efde61d`](https://github.com/PrismJS/prism/commit/efde61d)]
- **Monkey** ([#621](https://github.com/PrismJS/prism/issues/621)) [[`fdd4a3c`](https://github.com/PrismJS/prism/commit/fdd4a3c)]
- **nginx** ([#776](https://github.com/PrismJS/prism/issues/776)) [[`dc4fc19`](https://github.com/PrismJS/prism/commit/dc4fc19), [`e62c88e`](https://github.com/PrismJS/prism/commit/e62c88e)]
- **Nim** ([#622](https://github.com/PrismJS/prism/issues/622)) [[`af9c49a`](https://github.com/PrismJS/prism/commit/af9c49a)]
- **OCaml** ([#628](https://github.com/PrismJS/prism/issues/628)) [[`556c04d`](https://github.com/PrismJS/prism/commit/556c04d)]
- **Processing** ([#629](https://github.com/PrismJS/prism/issues/629)) [[`e47087b`](https://github.com/PrismJS/prism/commit/e47087b)]
- **Prolog** ([#630](https://github.com/PrismJS/prism/issues/630)) [[`dd04c32`](https://github.com/PrismJS/prism/commit/dd04c32)]
- **Pure** ([#626](https://github.com/PrismJS/prism/issues/626)) [[`9c276ab`](https://github.com/PrismJS/prism/commit/9c276ab)]
- **Q** ([#624](https://github.com/PrismJS/prism/issues/624)) [[`c053c9e`](https://github.com/PrismJS/prism/commit/c053c9e)]
- **Qore** [[`125e91f`](https://github.com/PrismJS/prism/commit/125e91f)]
- **Tcl** [[`a3e751a`](https://github.com/PrismJS/prism/commit/a3e751a), [`11ff829`](https://github.com/PrismJS/prism/commit/11ff829)]
- **Textile** ([#544](https://github.com/PrismJS/prism/issues/544)) [[`d0c6764`](https://github.com/PrismJS/prism/commit/d0c6764)]
- **Verilog** ([#640](https://github.com/PrismJS/prism/issues/640)) [[`44a11c2`](https://github.com/PrismJS/prism/commit/44a11c2), [`795eb99`](https://github.com/PrismJS/prism/commit/795eb99)]
- **Vim** [[`69ea994`](https://github.com/PrismJS/prism/commit/69ea994)]

### Updated components

- **Bash**:
    - Add support for Here-Documents ([#787](https://github.com/PrismJS/prism/issues/787)) [[`b57a096`](https://github.com/PrismJS/prism/commit/b57a096)]
    - Remove C-like dependency ([#789](https://github.com/PrismJS/prism/issues/789)) [[`1ab4619`](https://github.com/PrismJS/prism/commit/1ab4619)]
- **C**:
    - Fixed numbers [[`4d64d07`](https://github.com/PrismJS/prism/commit/4d64d07), [`071c3dd`](https://github.com/PrismJS/prism/commit/071c3dd)]
- **C-like**:
    - Add word boundary before class-name prefixes [[`aa757f6`](https://github.com/PrismJS/prism/commit/aa757f6)]
    - Improved operator regex + add != and !== [[`135ee9d`](https://github.com/PrismJS/prism/commit/135ee9d)]
    - Optimized string regexp [[`792e35c`](https://github.com/PrismJS/prism/commit/792e35c)]
- **F#**:
    - Fixed keywords containing exclamation mark [[`09f2005`](https://github.com/PrismJS/prism/commit/09f2005)]
    - Improved string pattern [[`0101c89`](https://github.com/PrismJS/prism/commit/0101c89)]
    - Insert preprocessor before keyword + don't allow line feeds before # [[`fdc9477`](https://github.com/PrismJS/prism/commit/fdc9477)]
    - Fixed numbers [[`0aa0791`](https://github.com/PrismJS/prism/commit/0aa0791)]
- **Gherkin**:
    - Don't allow spaces in tags [[`48ff8b7`](https://github.com/PrismJS/prism/commit/48ff8b7)]
    - Handle \r\n and \r + allow feature alone + don't match blank td/th [[`ce1ec3b`](https://github.com/PrismJS/prism/commit/ce1ec3b)]
- **Git**:
    - Added more examples ([#652](https://github.com/PrismJS/prism/issues/652)) [[`95dc102`](https://github.com/PrismJS/prism/commit/95dc102)]
    - Add support for unified diff. Fixes [#769](https://github.com/PrismJS/prism/issues/769), fixes [#357](https://github.com/PrismJS/prism/issues/357), closes [#401](https://github.com/PrismJS/prism/issues/401) [[`3aadd5d`](https://github.com/PrismJS/prism/commit/3aadd5d)]
- **Go**:
    - Improved operator regexp + removed punctuation from it [[`776ab90`](https://github.com/PrismJS/prism/commit/776ab90)]
- **Haml**:
    - Combine both multiline-comment regexps + handle \r\n and \r [[`f77b40b`](https://github.com/PrismJS/prism/commit/f77b40b)]
    - Handle \r\n and \r in filter regex [[`bbe68ac`](https://github.com/PrismJS/prism/commit/bbe68ac)]
- **Handlebars**:
    - Fix empty strings, add plus sign in exponential notation, improve block pattern and variable pattern [[`c477f9a`](https://github.com/PrismJS/prism/commit/c477f9a)]
    - Properly escape special replacement patterns ($) in Handlebars, PHP and Smarty. Fix [#772](https://github.com/PrismJS/prism/issues/772) [[`895bf46`](https://github.com/PrismJS/prism/commit/895bf46)]
- **Haskell**:
    - Removed useless backslashes and parentheses + handle \r\n and \r + simplify number regexp + fix operator regexp [[`1cc8d8e`](https://github.com/PrismJS/prism/commit/1cc8d8e)]
- **HTTP**:
    - Fix indentation + Add multiline flag for more flexibility + Fix response status + Handle \r\n and \r [[`aaa90f1`](https://github.com/PrismJS/prism/commit/aaa90f1)]
- **Ini**:
    - Fix some regexps + remove unused flags [[`53d5839`](https://github.com/PrismJS/prism/commit/53d5839)]
- **Jade**:
    - Add todo list + remove single-line comment pattern + simplified most patterns with m flag + handle \r\n and \r [[`a79e838`](https://github.com/PrismJS/prism/commit/a79e838)]
- **Java**:
    - Fix number regexp + simplified number regexp and optimized operator regexp [[`21e20b9`](https://github.com/PrismJS/prism/commit/21e20b9)]
- **JavaScript**:
    - JavaScript: Allow for all non-ASCII characters in function names. Fix [#400](https://github.com/PrismJS/prism/issues/400) [[`29e26dc`](https://github.com/PrismJS/prism/commit/29e26dc)]
- **JSX**:
    - Allow for one level of nesting in scripts (Fix [#717](https://github.com/PrismJS/prism/issues/717)) [[`90c75d5`](https://github.com/PrismJS/prism/commit/90c75d5)]
- **Julia**:
    - Simplify comment regexp + improved number regexp + improved operator regexp [[`bcac7d4`](https://github.com/PrismJS/prism/commit/bcac7d4)]
- **Keyman**:
    - Move header statements above keywords [[`23a444c`](https://github.com/PrismJS/prism/commit/23a444c)]
- **LaTeX**:
    - Simplify comment regexp [[`132b41a`](https://github.com/PrismJS/prism/commit/132b41a)]
    - Extend support [[`942a6ec`](https://github.com/PrismJS/prism/commit/942a6ec)]
- **Less**:
    - Remove useless part in property regexp [[`80d8260`](https://github.com/PrismJS/prism/commit/80d8260)]
- **LOLCODE**:
    - Removed useless parentheses [[`8147c9b`](https://github.com/PrismJS/prism/commit/8147c9b)]
- **Makefile**:
    - Add known failures in example [[`e0f8984`](https://github.com/PrismJS/prism/commit/e0f8984)]
    - Handle \r\n in comments and strings + fix "-include" keyword
- **Markup**:
    - Simplify patterns + handle \r\n and \r [[`4c551e8`](https://github.com/PrismJS/prism/commit/4c551e8)]
    - Don't allow = to appear in tag name [[`85d8a55`](https://github.com/PrismJS/prism/commit/85d8a55)]
    - Don't allow dot inside tag name [[`283691e`](https://github.com/PrismJS/prism/commit/283691e)]
- **MATLAB**:
    - Simplify string pattern to remove lookbehind [[`a3cbecc`](https://github.com/PrismJS/prism/commit/a3cbecc)]
- **NASM**:
    - Converted indents to tabs, removed uneeded escapes, added lookbehinds [[`a92e4bd`](https://github.com/PrismJS/prism/commit/a92e4bd)]
- **NSIS**:
    - Simplified patterns [[`bbd83d4`](https://github.com/PrismJS/prism/commit/bbd83d4)]
    - Fix operator regexp [[`44ad8dc`](https://github.com/PrismJS/prism/commit/44ad8dc)]
- **Objective-C**:
    - Simplified regexps + fix strings + handle \r [[`1d33147`](https://github.com/PrismJS/prism/commit/1d33147)]
    - Fix operator regexp [[`e9d382e`](https://github.com/PrismJS/prism/commit/e9d382e)]
- **Pascal**:
    - Simplified regexps [[`c03c8a4`](https://github.com/PrismJS/prism/commit/c03c8a4)]
- **Perl**:
    - Simplified regexps + Made most string and regexp patterns multi-line + Added support for regexp's n flag + Added missing operators [[`71b00cc`](https://github.com/PrismJS/prism/commit/71b00cc)]
- **PHP**:
    - Simplified patterns [[`f9d9452`](https://github.com/PrismJS/prism/commit/f9d9452)]
    - Properly escape special replacement patterns ($) in Handlebars, PHP and Smarty. Fix [#772](https://github.com/PrismJS/prism/issues/772) [[`895bf46`](https://github.com/PrismJS/prism/commit/895bf46)]
- **PHP Extras**:
    - Fix $this regexp + improve global regexp [[`781fdad`](https://github.com/PrismJS/prism/commit/781fdad)]
- **PowerShell**:
    - Update definitions for command/alias/operators [[`14da55c`](https://github.com/PrismJS/prism/commit/14da55c)]
- **Python**:
    - Added async/await and @ operator ([#656](https://github.com/PrismJS/prism/issues/656)) [[`7f1ae75`](https://github.com/PrismJS/prism/commit/7f1ae75)]
    - Added 'self' keyword and support for class names ([#677](https://github.com/PrismJS/prism/issues/677)) [[`d9d4ab2`](https://github.com/PrismJS/prism/commit/d9d4ab2)]
    - Simplified regexps + don't capture where unneeded + fixed operators [[`530f5f0`](https://github.com/PrismJS/prism/commit/530f5f0)]
- **R**:
    - Fixed and simplified patterns [[`c20c3ec`](https://github.com/PrismJS/prism/commit/c20c3ec)]
- **reST**:
    - Simplified some patterns, fixed others, prevented blank comments to match, moved list-bullet down to prevent breaking quotes [[`e6c6b85`](https://github.com/PrismJS/prism/commit/e6c6b85)]
- **Rip**:
    - Fixed some regexp + moved down numbers [[`1093f7d`](https://github.com/PrismJS/prism/commit/1093f7d)]
- **Ruby**:
    - Code cleaning, handle \r\n and \r, fix some regexps [[`dd4989f`](https://github.com/PrismJS/prism/commit/dd4989f)]
    - Add % notations for strings and regexps. Fix [#590](https://github.com/PrismJS/prism/issues/590) [[`2d37800`](https://github.com/PrismJS/prism/commit/2d37800)]
- **Rust**:
    - Simplified patterns and fixed operators [[`6c8494f`](https://github.com/PrismJS/prism/commit/6c8494f)]
- **SAS**:
    - Simplified datalines and optimized operator patterns [[`6ebb96f`](https://github.com/PrismJS/prism/commit/6ebb96f)]
- **Sass**:
    - Add missing require in components [[`35b8c50`](https://github.com/PrismJS/prism/commit/35b8c50)]
    - Fix comments, operators and selectors and simplified patterns [[`28759d0`](https://github.com/PrismJS/prism/commit/28759d0)]
    - Highlight "-" as operator only if surrounded by spaces, in order to not break hyphenated values (e.g. "ease-in-out") [[`b2763e7`](https://github.com/PrismJS/prism/commit/b2763e7)]
- **Scala**:
    - Simplified patterns [[`daf2597`](https://github.com/PrismJS/prism/commit/daf2597)]
- **Scheme**:
    - Add missing lookbehind on number pattern. Fix [#702](https://github.com/PrismJS/prism/issues/702) [[`3120ff7`](https://github.com/PrismJS/prism/commit/3120ff7)]
    - Fixes and simplifications [[`068704a`](https://github.com/PrismJS/prism/commit/068704a)]
    - Don't match content of symbols starting with a parenthesis [[`fa7df08`](https://github.com/PrismJS/prism/commit/fa7df08)]
- **Scss**:
    - Simplified patterns + fixed operators + don't match empty selectors [[`672c167`](https://github.com/PrismJS/prism/commit/672c167)]
- **Smalltalk**:
    - Simplified patterns [[`d896622`](https://github.com/PrismJS/prism/commit/d896622)]
- **Smarty**:
    - Optimized regexps + fixed punctuation and operators [[`1446700`](https://github.com/PrismJS/prism/commit/1446700)]
    - Properly escape special replacement patterns ($) in Handlebars, PHP and Smarty. Fix [#772](https://github.com/PrismJS/prism/issues/772) [[`895bf46`](https://github.com/PrismJS/prism/commit/895bf46)]
- **SQL**:
    - Simplified regexp + fixed keywords and operators + add CHARSET keyword [[`d49fec0`](https://github.com/PrismJS/prism/commit/d49fec0)]
- **Stylus**:
    - Rewrote the component entirely [[`7729728`](https://github.com/PrismJS/prism/commit/7729728)]
- **Swift**:
    - Optimized keywords lists and removed duplicates [[`936e429`](https://github.com/PrismJS/prism/commit/936e429)]
    - Add support for string interpolation. Fix [#448](https://github.com/PrismJS/prism/issues/448) [[`89cd5d0`](https://github.com/PrismJS/prism/commit/89cd5d0)]
- **Twig**:
    - Prevent "other" pattern from matching blank strings [[`cae2cef`](https://github.com/PrismJS/prism/commit/cae2cef)]
    - Optimized regexps + fixed operators + added missing operators/keywords [[`2d8271f`](https://github.com/PrismJS/prism/commit/2d8271f)]
- **VHDL**:
    - Move operator overloading before strings, don't capture if not needed, handle \r\n and \r, fix numbers [[`4533f17`](https://github.com/PrismJS/prism/commit/4533f17)]
- **Wiki markup**:
    - Fixed emphasis + merged some url patterns + added TODOs [[`8cf9e6a`](https://github.com/PrismJS/prism/commit/8cf9e6a)]
- **YAML**:
    - Handled \r\n and \r, simplified some patterns, fixed "---" [[`9e33e0a`](https://github.com/PrismJS/prism/commit/9e33e0a)]

### New plugins

- **Autoloader** ([#766](https://github.com/PrismJS/prism/issues/766)) [[`ed4ccfe`](https://github.com/PrismJS/prism/commit/ed4ccfe)]
- **JSONP Highlight** [[`b2f14d9`](https://github.com/PrismJS/prism/commit/b2f14d9)]
- **Keep Markup** ([#770](https://github.com/PrismJS/prism/issues/770)) [[`bd3e9ea`](https://github.com/PrismJS/prism/commit/bd3e9ea)]
- **Previewer: Base** ([#767](https://github.com/PrismJS/prism/issues/767)) [[`cf764c0`](https://github.com/PrismJS/prism/commit/cf764c0)]
- **Previewer: Color** ([#767](https://github.com/PrismJS/prism/issues/767)) [[`cf764c0`](https://github.com/PrismJS/prism/commit/cf764c0)]
- **Previewer: Easing** ([#773](https://github.com/PrismJS/prism/issues/773)) [[`513137c`](https://github.com/PrismJS/prism/commit/513137c), [`9207258`](https://github.com/PrismJS/prism/commit/9207258), [`4303c94`](https://github.com/PrismJS/prism/commit/4303c94)]
- **Remove initial line feed** [[`ed9f2b2`](https://github.com/PrismJS/prism/commit/ed9f2b2), [`b8d098e`](https://github.com/PrismJS/prism/commit/b8d098e)]

### Updated plugins

- **Autolinker**:
    - Don't process all grammars on load, process each one in before-highlight. Should fix [#760](https://github.com/PrismJS/prism/issues/760) [[`a572495`](https://github.com/PrismJS/prism/commit/a572495)]
- **Line Highlight**:
    - Run in `complete` hook [[`f237e67`](https://github.com/PrismJS/prism/commit/f237e67)]
    - Fixed position when font-size is odd ([#668](https://github.com/PrismJS/prism/issues/668)) [[`86bbd4c`](https://github.com/PrismJS/prism/commit/86bbd4c), [`8ed7ce3`](https://github.com/PrismJS/prism/commit/8ed7ce3)]
- **Line Numbers**:
    - Run in `complete` hook [[`3f4d918`](https://github.com/PrismJS/prism/commit/3f4d918)]
    - Don't run if already exists [[`c89bbdb`](https://github.com/PrismJS/prism/commit/c89bbdb)]
    - Don't run if block is empty. Fix [#669](https://github.com/PrismJS/prism/issues/669) [[`ee463e8`](https://github.com/PrismJS/prism/commit/ee463e8)]
    - Correct calculation for number of lines (fix [#385](https://github.com/PrismJS/prism/issues/385)) [[`14f3f80`](https://github.com/PrismJS/prism/commit/14f3f80)]
    - Fix computation of line numbers for single-line code blocks. Fix [#721](https://github.com/PrismJS/prism/issues/721) [[`02b220e`](https://github.com/PrismJS/prism/commit/02b220e)]
    - Fixing word wrap on long code lines [[`56b3d29`](https://github.com/PrismJS/prism/commit/56b3d29)]
    - Fixing coy theme + line numbers plugin overflowing on long blocks of text ([#762](https://github.com/PrismJS/prism/issues/762)) [[`a0127eb`](https://github.com/PrismJS/prism/commit/a0127eb)]
- **Show Language**:
    - Add gulp task to build languages map in Show language plugin (Fix [#671](https://github.com/PrismJS/prism/issues/671)) [[`39bd827`](https://github.com/PrismJS/prism/commit/39bd827)]
    - Add reset styles to prevent bug in Coy theme ([#703](https://github.com/PrismJS/prism/issues/703)) [[`08dd500`](https://github.com/PrismJS/prism/commit/08dd500)]

### Other changes

- Fixed link to David Peach article ([#647](https://github.com/PrismJS/prism/issues/647)) [[`3f679f8`](https://github.com/PrismJS/prism/commit/3f679f8)]
- Added `complete` hook, which runs even when no grammar is found [[`e58b6c0`](https://github.com/PrismJS/prism/commit/e58b6c0), [`fd54995`](https://github.com/PrismJS/prism/commit/fd54995)]
- Added test suite runner ([#588](https://github.com/PrismJS/prism/issues/588)) [[`956cd85`](https://github.com/PrismJS/prism/commit/956cd85)]
- Added tests for every components
- Added `.gitattributes` to prevent line ending changes in test files [[`45ca8c8`](https://github.com/PrismJS/prism/commit/45ca8c8)]
- Split plugins into 3 columns on Download page [[`a88936a`](https://github.com/PrismJS/prism/commit/a88936a)]
- Removed comment in components.js to make it easier to parse as JSON ([#679](https://github.com/PrismJS/prism/issues/679)) [[`2cb1326`](https://github.com/PrismJS/prism/commit/2cb1326)]
- Updated README.md [[`1388256`](https://github.com/PrismJS/prism/commit/1388256)]
- Updated documentation since the example was not relevant any more [[`80aedb2`](https://github.com/PrismJS/prism/commit/80aedb2)]
- Fixed inline style for Coy theme [[`52829b3`](https://github.com/PrismJS/prism/commit/52829b3)]
- Prevent errors in nodeJS ([#754](https://github.com/PrismJS/prism/issues/754)) [[`9f5c93c`](https://github.com/PrismJS/prism/commit/9f5c93c), [`0356c58`](https://github.com/PrismJS/prism/commit/0356c58)]
- Explicitly make the Worker close itself after highlighting, so that users have control on this behaviour when directly using Prism inside a Worker. Fix [#492](https://github.com/PrismJS/prism/issues/492) [[`e42a228`](https://github.com/PrismJS/prism/commit/e42a228)]
- Added some language aliases: js for javascript, xml, html, mathml and svg for markup [[`2f9fe1e`](https://github.com/PrismJS/prism/commit/2f9fe1e)]
- Download page: Add a "Select all" checkbox ([#561](https://github.com/PrismJS/prism/issues/561)) [[`9a9020b`](https://github.com/PrismJS/prism/commit/9a9020b)]
- Download page: Don't add semicolon unless needed in generated code. Fix [#273](https://github.com/PrismJS/prism/issues/273) [[`5a5eec5`](https://github.com/PrismJS/prism/commit/5a5eec5)]
- Add language counter on homepage [[`889cda5`](https://github.com/PrismJS/prism/commit/889cda5)]
- Improve performance by doing more work in the worker [[`1316abc`](https://github.com/PrismJS/prism/commit/1316abc)]
- Replace Typeplate with SitePoint on homepage. Fix [#774](https://github.com/PrismJS/prism/issues/774) [[`0c54308`](https://github.com/PrismJS/prism/commit/0c54308)]
- Added basic `.editorconfig` [[`c48f55d`](https://github.com/PrismJS/prism/commit/c48f55d)]

---

## 1.0.1 (2015-07-26)

### New components

- **Brainfuck** ([#611](https://github.com/PrismJS/prism/issues/611)) [[`3ede718`](https://github.com/PrismJS/prism/commit/3ede718)]
- **Keyman** ([#609](https://github.com/PrismJS/prism/issues/609)) [[`2698f82`](https://github.com/PrismJS/prism/commit/2698f82), [`e9936c6`](https://github.com/PrismJS/prism/commit/e9936c6)]
- **Makefile** ([#610](https://github.com/PrismJS/prism/issues/610)) [[`3baa61c`](https://github.com/PrismJS/prism/commit/3baa61c)]
- **Sass (Sass)** (fix [#199](https://github.com/PrismJS/prism/issues/199)) [[`b081804`](https://github.com/PrismJS/prism/commit/b081804)]
- **VHDL** ([#595](https://github.com/PrismJS/prism/issues/595)) [[`43e6157`](https://github.com/PrismJS/prism/commit/43e6157)]

### Updated components

- **ActionScript**:
    - Fix ! operator and add ++ and -- as whole operators [[`6bf0794`](https://github.com/PrismJS/prism/commit/6bf0794)]
    - Fix XML highlighting [[`90257b0`](https://github.com/PrismJS/prism/commit/90257b0)]
    - Update examples to add inline XML [[`2c1626a`](https://github.com/PrismJS/prism/commit/2c1626a), [`3987711`](https://github.com/PrismJS/prism/commit/3987711)]
- **Apache Configuration**:
    - Don't include the spaces in directive-inline [[`e87efd8`](https://github.com/PrismJS/prism/commit/e87efd8)]
- **AppleScript**:
    - Allow one level of nesting in block comments [[`65894c5`](https://github.com/PrismJS/prism/commit/65894c5)]
    - Removed duplicates between operators and keywords [[`1ec5a81`](https://github.com/PrismJS/prism/commit/1ec5a81)]
    - Removed duplicates between keywords and classes [[`e8d09f6`](https://github.com/PrismJS/prism/commit/e8d09f6)]
    - Move numbers up so they are not broken by operator pattern [[`66dac31`](https://github.com/PrismJS/prism/commit/66dac31)]
- **ASP.NET**:
    - Prevent Markup tags from breaking ASP tags + fix MasterType directive [[`1f0a336`](https://github.com/PrismJS/prism/commit/1f0a336)]
- **AutoHotkey**:
    - Allow tags (labels) to be highlighted at the end of the code [[`0a1fc4b`](https://github.com/PrismJS/prism/commit/0a1fc4b)]
    - Match all operators + add comma to punctuation [[`f0ccb1b`](https://github.com/PrismJS/prism/commit/f0ccb1b)]
    - Removed duplicates in keywords lists [[`fe0a068`](https://github.com/PrismJS/prism/commit/fe0a068)]
- **Bash**:
    - Simplify comment regex [[`2700981`](https://github.com/PrismJS/prism/commit/2700981)]
    - Removed duplicates in keywords + removed unneeded parentheses [[`903b8a4`](https://github.com/PrismJS/prism/commit/903b8a4)]
- **C**:
    - Removed string pattern (inherited from C-like) [[`dcce1a7`](https://github.com/PrismJS/prism/commit/dcce1a7)]
    - Better support for macro statements [[`4868635`](https://github.com/PrismJS/prism/commit/4868635)]
- **C#**:
    - Fix preprocessor pattern [[`86311f5`](https://github.com/PrismJS/prism/commit/86311f5)]
- **C++**:
    - Removed delete[] and new[] broken keywords [[`42fbeef`](https://github.com/PrismJS/prism/commit/42fbeef)]
- **C-like**:
    - Removed unused 'ignore' pattern [[`b6535dd`](https://github.com/PrismJS/prism/commit/b6535dd)]
    - Use look-ahead instead of inside to match functions [[`d4194c9`](https://github.com/PrismJS/prism/commit/d4194c9)]
- **CoffeeScript**:
    - Prevent strings from ending with a backslash [[`cb6b824`](https://github.com/PrismJS/prism/commit/cb6b824)]
- **CSS**:
    - Highlight parentheses as punctuation [[`cd0273e`](https://github.com/PrismJS/prism/commit/cd0273e)]
    - Improved highlighting of at-rules [[`e254088`](https://github.com/PrismJS/prism/commit/e254088)]
    - Improved URL and strings [[`901812c`](https://github.com/PrismJS/prism/commit/901812c)]
    - Selector regexp should not include last spaces before brace [[`f2e2718`](https://github.com/PrismJS/prism/commit/f2e2718)]
    - Handle \r\n [[`15760e1`](https://github.com/PrismJS/prism/commit/15760e1)]
- **Eiffel**:
    - Fix string patterns order + fix /= operator [[`7d1b8d7`](https://github.com/PrismJS/prism/commit/7d1b8d7)]
- **Erlang**:
    - Fixed quoted functions, quoted atoms, variables and <= operator [[`fa286aa`](https://github.com/PrismJS/prism/commit/fa286aa)]
- **Fortran**:
    - Improved pattern for comments inside strings [[`40ae215`](https://github.com/PrismJS/prism/commit/40ae215)]
    - Fixed order in keyword pattern [[`8a6d32d`](https://github.com/PrismJS/prism/commit/8a6d32d)]
- **Handlebars**:
    - Support blocks with dashes ([#587](https://github.com/PrismJS/prism/issues/587)) [[`f409b13`](https://github.com/PrismJS/prism/commit/f409b13)]
- **JavaScript**:
    - Added support for 'y' and 'u' ES6 JavaScript regex flags ([#596](https://github.com/PrismJS/prism/issues/596)) [[`5d99957`](https://github.com/PrismJS/prism/commit/5d99957)]
    - Added support for missing ES6 keywords in JavaScript ([#596](https://github.com/PrismJS/prism/issues/596)) [[`ca68b87`](https://github.com/PrismJS/prism/commit/ca68b87)]
    - Added `async` and `await` keywords ([#575](https://github.com/PrismJS/prism/issues/575)) [[`5458cec`](https://github.com/PrismJS/prism/commit/5458cec)]
    - Added support for Template strings + interpolation [[`04f72b1`](https://github.com/PrismJS/prism/commit/04f72b1)]
    - Added support for octal and binary numbers ([#597](https://github.com/PrismJS/prism/issues/597)) [[`a8aa058`](https://github.com/PrismJS/prism/commit/a8aa058)]
    - Improve regex performance of C-like strings and JS regexps [[`476cbf4`](https://github.com/PrismJS/prism/commit/476cbf4)]
- **Markup**:
    - Allow non-ASCII chars in tag names and attributes (fix [#585](https://github.com/PrismJS/prism/issues/585)) [[`52fd55e`](https://github.com/PrismJS/prism/commit/52fd55e)]
    - Optimized tag's regexp so that it stops crashing on large unclosed tags [[`75452ba`](https://github.com/PrismJS/prism/commit/75452ba)]
    - Highlight single quotes in attr-value as punctuation [[`1ebcb8e`](https://github.com/PrismJS/prism/commit/1ebcb8e)]
    - Doctype and prolog can be multi-line [[`c19a238`](https://github.com/PrismJS/prism/commit/c19a238)]
- **Python**:
    - Added highlighting for function declaration ([#601](https://github.com/PrismJS/prism/issues/601)) [[`a88aae8`](https://github.com/PrismJS/prism/commit/a88aae8)]
    - Fixed wrong highlighting of variables named a, b, c... f ([#601](https://github.com/PrismJS/prism/issues/601)) [[`a88aae8`](https://github.com/PrismJS/prism/commit/a88aae8)]
- **Ruby**:
    - Added support for string interpolation [[`c36b123`](https://github.com/PrismJS/prism/commit/c36b123)]
- **Scss**:
    - Fixed media queries highlighting [[`bf8e032`](https://github.com/PrismJS/prism/commit/bf8e032)]
    - Improved highlighting inside at-rules [[`eef4248`](https://github.com/PrismJS/prism/commit/eef4248)]
    - Match placeholders inside selectors (fix [#238](https://github.com/PrismJS/prism/issues/238)) [[`4e42e26`](https://github.com/PrismJS/prism/commit/4e42e26)]
- **Swift**:
    - Update keywords list (fix [#625](https://github.com/PrismJS/prism/issues/625)) [[`88f44a7`](https://github.com/PrismJS/prism/commit/88f44a7)]

### Updated plugins

- **File Highlight**:
    - Allow to specify the highlighting language. Fix [#607](https://github.com/PrismJS/prism/issues/607) [[`8030db9`](https://github.com/PrismJS/prism/commit/8030db9)]
- **Line Highlight**:
    - Fixed incorrect height in IE9 ([#604](https://github.com/PrismJS/prism/issues/604)) [[`f1705eb`](https://github.com/PrismJS/prism/commit/f1705eb)]
    - Prevent errors in IE8 [[`5f133c8`](https://github.com/PrismJS/prism/commit/5f133c8)]

### Other changes

- Removed moot `version` property from `bower.json` ([#594](https://github.com/PrismJS/prism/issues/594)) [[`4693499`](https://github.com/PrismJS/prism/commit/4693499)]
- Added repository to `bower.json` ([#600](https://github.com/PrismJS/prism/issues/600)) [[`8e5ebcc`](https://github.com/PrismJS/prism/commit/8e5ebcc)]
- Added `.DS_Store` to `.gitignore` [[`1707e4e`](https://github.com/PrismJS/prism/commit/1707e4e)]
- Improve test drive page usability. Fix [#591](https://github.com/PrismJS/prism/issues/591) [[`fe60858`](https://github.com/PrismJS/prism/commit/fe60858)]
- Fixed prism-core and prism-file-highlight to prevent errors in IE8 [[`5f133c8`](https://github.com/PrismJS/prism/commit/5f133c8)]
- Add Ubuntu Mono font to font stack [[`ed9d7e3`](https://github.com/PrismJS/prism/commit/ed9d7e3)]

---

## 1.0.0 (2015-05-23)

- First release
- Supported languages:
    - ActionScript
    - Apache Configuration
    - AppleScript
    - ASP.NET (C#)
    - AutoHotkey
    - Bash
    - C
    - C#
    - C++
    - C-like
    - CoffeeScript
    - CSS
    - CSS Extras
    - Dart
    - Eiffel
    - Erlang
    - F#
    - Fortran
    - Gherkin
    - Git
    - Go
    - Groovy
    - Haml
    - Handlebars
    - Haskell
    - HTTP
    - Ini
    - Jade
    - Java
    - JavaScript
    - Julia
    - LaTeX
    - Less
    - LOLCODE
    - Markdown
    - Markup
    - MATLAB
    - NASM
    - NSIS
    - Objective-C
    - Pascal
    - Perl
    - PHP
    - PHP Extras
    - PowerShell
    - Python
    - R
    - React JSX
    - reST
    - Rip
    - Ruby
    - Rust
    - SAS
    - Sass (Scss)
    - Scala
    - Scheme
    - Smalltalk
    - Smarty
    - SQL
    - Stylus
    - Swift
    - Twig
    - TypeScript
    - Wiki markup
    - YAML
- Plugins:
    - Autolinker
    - File Highlight
    - Highlight Keywords
    - Line Highlight
    - Line Numbers
    - Show Invisibles
    - Show Language
    - WebPlatform Docs
