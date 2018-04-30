const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs')
const promisify = require('util').promisify

module.exports = class extends Generator {
    initializing() {
        /*  Initialization actions for the generator. 
            Checks if the current directory is empty. */
        this.log(yosay(
            'Welcome to the ' + 
            chalk.red('Future Facts Data Science') + 
            ' generator!'
        ));

        // Check if working directory is empty, if not raise
        return promisify(fs.readdir)(this.destinationRoot())
            .then((files) => {
                if (files.length > 0) {
                    this.env.error(
                        'Directory is not empty, cannot scafold project here.'
                    )
                }
            })
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

        return answers
    }

    _storeAnswers(answers) {
        this.answers = answers

        return answers
    }

    prompting() {
        return this.prompt([
            {
                type: 'list',
                name: 'language',
                message: 'What language will you be working in?',
                choices: ['R', 'Python']
            }
        ]).then(this._validateAnswers.bind(this))
        .then(this._storeAnswers.bind(this))
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
