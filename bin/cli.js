#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
	.scriptName('prismjs')
	.command(require('./bundle'))
	.exitProcess(true)
	.strict(true)
	.showHelpOnFail(false, 'Specify --help for available options')
	.recommendCommands()
	.help()
	.argv;

