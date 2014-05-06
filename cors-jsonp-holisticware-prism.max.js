var head = document.head || document.getElementsByTagName("head")[0];
var body = document.body || document.getElementsByTagName("body")[0];

var element_pre_code_current;

var dictionary_factory = new Dict();
var dictionary_urls_responses = dictionary_factory.New();

function DetermineAndParse(url_src, response, element_pre_code)
{
    var script = document.createElement('script');
    script.src = url_src;
    body.appendChild(script);

    element_pre_code_current = element_pre_code;
    /*
    if (url_src.indexOf("https://api.github.com") != -1) {
        parse_github_jsonp_response_for_element(response, element_pre_code);
    }
    else if (url_src.indexOf("https://bitbucket.org/!api/1.0/repositories") != -1) {
    return "BITBUCKET- TODO parse JSONP";
    }
    else {
        return response.responseText
    }
    */
}

function parse_bitbucket_jsonp_response(response)
{
}

function parse_github_jsonp_response_for_element(response, element_pre_code) {

	var content_textual =
				// decode64(response.data.content)
				//Base64.decode(response.data.content)
                "Content"
                ;
	element_pre_code.textContent = "AAAAAAAA"; //content_textual;

	return;
}



function parse_jsonp_response(response) {

    var meta = response.meta;
    var data = response.data;

    var content = data.content;
    var encoding = data.encoding;
    var url = data.url;
    var git_url = data.git_url;
    var html_url = data.html_url;
    var content_textual = Base64.decode(content);

    console.log(meta);
    console.log(data);
    console.log("url        = " + url);
    console.log("git_url    = " + git_url);
    console.log("html_url   = " + html_url);

    element_pre_code_current.textContent =
                        //"url      = " + url
                        //+ "\n" +
                        //"git_url  = " + git_url
                        //+ "\n" +
                        //"html_url = " + html_url
                        //+ "\n" +
                        //"content          = " + content
                        //+ "\n" +
                        "content_textual  = " + content_textual
                        ;

    dictionary_urls_responses.addOrUpdate("a", "b");

    return;
}


function foo(response) {
    var meta = response.meta;
    var data = response.data;
    console.log(meta);
    console.log(data);

    return;
}
