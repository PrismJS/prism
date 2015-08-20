(function(){

if(!window.Prism) {
	return;
}

var renderableLanguages = {
	markup: true
};

function hasClass(element, className) {
  className = " " + className + " ";
  return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1
}

function addClass(element, className) {
	if (!hasClass(element, className))
	{
		element.className += " " + className;
	}
}

function nextElementSibling(element) {
	do
	{
		element = element.nextSibling;
	} while (element && element.nodeType != 1);
	return element;
}

var scripts = document.getElementsByTagName("script");
var renderByDefault = scripts[scripts.length - 1].getAttribute("data-render-markup") !== "off";

Prism.hooks.add("after-highlight", function(env){
	var pre = env.element.parentElement;
	if (!pre) return;

	var renderable = pre.tagName === "PRE" && renderableLanguages[env.language];
	var renderFlag = pre.getAttribute("data-render-markup") || "";
	var shouldRenderMarkup = (renderByDefault && renderFlag !== "off") || renderFlag === "on";
	var render = nextElementSibling(pre);

	if (renderable && shouldRenderMarkup) {
		if (!(render && hasClass(render, "prism-markup-render"))) {
			addClass(pre, "prism-markup-rendered");
			render = document.createElement("div");
			addClass(render, "prism-markup-render");
			pre.parentElement.insertBefore(render, pre.nextSibling);
		}
		render.innerHTML = env.code;
	}
	else if (render) {
		render.remove();
	}
})
})();
