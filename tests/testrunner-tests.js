"use strict";

var assert = require("chai").assert;
var TokenStreamTransformer = require("./helper/token-stream-transformer");

describe("The token stream transformer",
	function ()
	{
		it("should handle all kinds of simple transformations",
			function ()
			{
				var tokens = [
					{type: "type", content: "content"},
					"string"
				];

				var expected = [
					["type", "content"],
					"string"
				];

				assert.deepEqual(TokenStreamTransformer.simplify(tokens), expected);
			}
		);


		it("should handle nested structures",
			function ()
			{
				var tokens = [
					{type: "type", content: [
						{type: "insideType", content: [
							{type: "insideInsideType", content: "content"}
						]}
					]}
				];

				var expected = [
					["type", [
						["insideType", [
							["insideInsideType", "content"]
						]]
					]]
				];

				assert.deepEqual(TokenStreamTransformer.simplify(tokens), expected);
			}
		);


		it("should strip empty tokens",
			function ()
			{
				var tokenStream = [
					"",
					"\r\n",
					"\t",
					" "
				];

				var expectedSimplified = [];

				assert.deepEqual(TokenStreamTransformer.simplify(tokenStream), expectedSimplified);
			}
		);


		it("should strip empty token tree branches",
			function ()
			{
				var tokenStream = [
					{type: "type", content: [
						["", ""],
						"",
						{type: "nested", content: [""]}
					]},
					[[[[[[[""]]]]]]]
				];

				var expectedSimplified = [
					["type", [
						["nested", []]
					]]
				];

				assert.deepEqual(TokenStreamTransformer.simplify(tokenStream), expectedSimplified);
			}
		);
	}
);

