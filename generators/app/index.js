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
                `R? Really? Go get yourself a real language.
                    I won't scaffold this for you, bye.`
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
                type: 'input',
                name: 'creator',
                message: 'Who are you?',
                validate: answer => answer.length > 3,
                store: true
            },
            {
                type: 'input',
                name: 'projectName',
                message: 'What is the name of this project, no whitespaces allowed?',
                validate: answer => answer.length > 3 && ! /\s/.test(answer)
            },
            {
                type: 'list',
                name: 'language',
                message: 'What language will you be working in?',
                choices: ['R', 'Python']
            },
            {
                type: 'checkbox',
                name: 'additionalModules',
                message: 'What additional tools would you like installed?',
                choices: ['jupyter'],
                when: answers => answers.language === 'Python'
            }
        ]).then(this._validateAnswers.bind(this))
        .then(this._storeAnswers.bind(this))
    }

    writing() {
        // Copy the environment file for construction of the
        // conda
        this.fs.copyTpl(
            this.templatePath('python_project/conda_envs/env.yml'),
            this.destinationPath('env.yml'),
            { 
                envName: this.answers.projectName,
                jupyter: this.answers.additionalModules.includes('jupyter')
                
            }
        )
    }

    install() {
        // Setup conda environment
        let installConda = this.spawnCommand(
            'conda', 
            ['env', 'create', '--file', this.destinationPath('env.yml')]
        );

        // Add a listener for the conda installer, clean up if it fails
        installConda.on('close', (code) => {
            if (code != 0) {
                this.env.error('Could not create conda environment');
                this._cleanUpOnFail()
            }
        })

    }
};
