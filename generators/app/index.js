const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs')
const promisify = require('util').promisify

module.exports = class extends Generator {
    async initializing() {
        /*  Initialization actions for the generator. 
            Checks if the current directory is empty. */
        this.log(yosay(
            'Welcome to the ' + 
            chalk.red('Future Facts Data Science') + 
            ' generator!'
        ));

        // Check if working directory is empty, if not raise
        let files = await promisify(fs.readdir)(this.destinationRoot())
        if (files.length > 0) {
            this.env.error('Directory is not empty, cannot scafold here.')
        }
    }

    _cleanUpOnFail() {
        // TODO: Method to clean up 
    }

    _validateAnswers(answers) {
        // Post processing of answers

        // We do not support R for the moment
        if (answers.language === 'R') {
            this.env.error(yosay(
                `R? Really? Are you sure?
                    Currently I don't have any support for
                    scafolding R projects. Feel free to create a PR.`
            ))
            this._cleanUpOnFail()
        }
        else if (answers.language === 'Python') {
            this.log(yosay(
                'Great choice of language!'
            ))
        }
    }

    async prompting() {
        let answers = await this.prompt([
            {
                type: 'list',
                name: 'language',
                message: 'What language will you be working in?',
                choices: ['R', 'Python']
            }
        ])
        
        this._validateAnswers(answers)

        // Store answers for later use
        this.answers = answers
    }

    install() {
        // Setup conda environment
        if (this.answers.language === "Python") {
            this.composeWith('data-science:python')
        }
        else {
            // Branch for R support
        }
    }
};
