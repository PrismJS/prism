Prism = require('../../prism');
require('../../components/prism-git');

describe('Prism-Git tests', function() {
	it('parses git commands', function() {
		var input = '$ git config --global core.editor "~/Sublime\ Text\ 3/sublime_text -w"';

		var res = Prism.highlight(input, Prism.languages.git);

		expect(res).toBe('<span class="token command" >$ git config<span class="token parameter" > --global</span> core.editor <span class="token string" >"~/Sublime Text 3/sublime_text -w"</span></span>');
	});


	it('parses git comments', function() {
		var input =
			"$ git status\n" +
			"# On branch infinite-scroll\n" +
			"# Your branch and 'origin/sharedBranches/frontendTeam/infinite-scroll' have diverged,\n" +
			"# and have 1 and 2 different commits each, respectively.\n" +
			"nothing to commit (working directory clean)";

		var res = Prism.highlight(input, Prism.languages.git);

		expect(res).toBe(
			'<span class="token command" >$ git status</span>\n' +
			'<span class="token comment" spellcheck="true"># On branch infinite-scroll</span>\n' +
			'<span class="token comment" spellcheck="true"># Your branch and \'origin/sharedBranches/frontendTeam/infinite-scroll\' have diverged,</span>\n' +
			'<span class="token comment" spellcheck="true"># and have 1 and 2 different commits each, respectively.</span>\n' +
			'nothing to commit (working directory clean)');
	});

	it('parses diff', function() {
		var input =
			"$ git diff\n" +
			"diff --git file.txt file.txt\n" +
			"index 6214953..1d54a52 100644\n" +
			"--- file.txt\n" +
			"+++ file.txt\n" +
			"@@ -1 +1,2 @@\n" +
			"-Here's my tetx file\n" +
			"+Here's my text file\n" +
			"+And this is the second line";

		var res = Prism.highlight(input, Prism.languages.git);

		expect(res).toBe(
			'<span class="token command" >$ git diff</span>\n' +
			'diff --git file.txt file.txt\n' +
			'index 6214953..1d54a52 100644\n' +
			'--- file.txt\n' +
			'+++ file.txt\n' +
			'<span class="token coord" >@@ -1 +1,2 @@</span>\n' +
			'<span class="token deleted" >-Here\'s my tetx file</span>\n' +
			'<span class="token inserted" >+Here\'s my text file</span>\n' +
			'<span class="token inserted" >+And this is the second line</span>');
	});

	it('parses a commit SHA1 (40 char)', function() {
		var input =
			"$ git log\n" +
			"commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09\n" +
			"Author: lgiraudel\n" +
			"Date:   Mon Feb 17 11:18:34 2014 +0100\n" +
			"\n" +
			"    Add of a new line\n" +
			"\n" +
			"commit 87edc4ad8c71b95f6e46f736eb98b742859abd95\n" +
			"Author: lgiraudel\n" +
			"Date:   Mon Feb 17 11:18:15 2014 +0100\n" +
			"\n" +
			"    Typo fix\n" +
			"\n" +
			"commit 3102416a90c431400d2e2a14e707fb7fd6d9e06d\n" +
			"Author: lgiraudel\n" +
			"Date:   Mon Feb 17 10:58:11 2014 +0100\n" +
			"\n" +
			"    Initial commit";

		var res = Prism.highlight(input, Prism.languages.git);

		expect(res).toBe(
			'<span class="token command" >$ git log</span>\n' +
			'<span class="token commit_sha1" >commit a11a14ef7e26f2ca62d4b35eac455ce636d0dc09</span>\n' +
			'Author: lgiraudel\n' +
			'Date:   Mon Feb 17 11:18:34 2014 +0100\n' +
			'\n' +
			'    Add of a new line\n' +
			'\n' +
			'<span class="token commit_sha1" >commit 87edc4ad8c71b95f6e46f736eb98b742859abd95</span>\n' +
			'Author: lgiraudel\n' +
			'Date:   Mon Feb 17 11:18:15 2014 +0100\n' +
			'\n' +
			'    Typo fix\n' +
			'\n' +
			'<span class="token commit_sha1" >commit 3102416a90c431400d2e2a14e707fb7fd6d9e06d</span>\n' +
			'Author: lgiraudel\n' +
			'Date:   Mon Feb 17 10:58:11 2014 +0100\n' +
			'\n' +
			'    Initial commit');
	});
});