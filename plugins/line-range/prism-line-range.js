(function () {
  if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
    return;
  }

  /**
   * Fetches the file from a local or remote URL string and returns text
   * @param  {string} url - The url or file path of the source code to fetch
   */
  function fetchText(url) {
    var response = fetch(url).then(function (response) {
      return response.text();
    });
    return response;
  }

  /**
   * Fetches the text of the provided URL/file and returns an Array with the name of the file and the source code as text 
   * ['sourcefileName.js', sourceCode]
   * @param  {string} sourceURL - The url or file path of the source code to send to fetchText()
   */
  function init(sourceURL) {
    return fetchText(sourceURL).then(function (x) {
      return [sourceURL, x.split('\n')];
    });
  }

  /**
   * Takes a PRE element, figures out what file it is associated with, gets the desired line range, splits the source text and injects it highlighted
   * @param  {DOM element} pre - A DOM element, in this case will be a pre
   * @param  {array} s - An array with the source code file name and the source code contents as text (from init())
   */
  function splitLines(pre, s) {
    var lineRange = pre.getAttribute('data-range');
    var rawLines = lineRange.split(',');
    var lines = rawLines.filter(function (x) {
      return isNaN(x) === false;
    });
    var startLine = parseInt(lines[0], 10);
    var endLine = lines[1] === undefined ? -1 : parseInt(lines[1], 10);
    var codeRange = s[1].slice(startLine - 1, endLine).join('\n');
    var codeRangeEl = '<code class="line-numbers">' + codeRange.trim() + '</code>';
    !pre.getAttribute('data-start') ? pre.setAttribute('data-start', startLine) : null
    pre.innerHTML = codeRangeEl;
    Prism.highlightAllUnder(pre);
  }

  /**
   * This is the only function that needs to be run by Prism. It gets the appropriate elements from the DOM,
   * figures out the unique list of files to be fetched, and sends them to be fetched and cached, each only once.
   */
  function lineRange() {
    var tutorialElements = Array.prototype.slice.apply(document.querySelectorAll('pre[data-fetch]'));
    var fileArray = tutorialElements.map(function (el) {
      return el.getAttribute('data-fetch');
    });
    var filteredFileArray = fileArray.filter(function (el, pos) {
      return fileArray.indexOf(el) == pos;
    });
    filteredFileArray.map(function (source) {
      return init(source).then(function (s) {
        tutorialElements.map(function (el) {
          el.getAttribute('data-fetch') === s[0] ? splitLines(el, s) : null;
        });
      });
    });
  }

  /**
   * Prism.js hooks for registering the plugin with their API
   */
  Prism.hooks.add('line-range', function (env) {
    env.plugins = env.plugins || {};
    env.plugins.linerange = true;
  });
  Prism.plugins.linerange = {
    lineRange: lineRange
  };

  /**
   * We need to wait until the DOM is loaded so we can get a list of files we want.
   * This is going to preform well, although there would be ways to listen to the DOM loading and 
   * IMMEDIATELY fetch the files as they became known rather than waiting for the whole document to load.
   * Performance improvements here would be negligible unless the DOM get really big
   */
  if (document.readyState === 'loading') { // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', lineRange);
  } else { // `DOMContentLoaded` has already fired
    lineRange();
  }
})();