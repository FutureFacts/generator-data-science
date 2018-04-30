const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs = require('fs')
const promisify = require('util').promisify

module.exports = class extends Generator {
    _cleanUpOnFail() {
        // TODO: Method to clean up 
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
                type: 'checkbox',
                name: 'additionalModules',
                message: 'What additional tools would you like installed?',
                choices: ['jupyter']
            }
        ]).then(this._storeAnswers.bind(this))
    }

    writing() {
        // Copy the environment file for construction of the
        // conda
        this.fs.copyTpl(
            this.templatePath('conda_envs/env.yml'),
            this.destinationPath('env.yml'),
            { 
                envName: this.answers.projectName,
                jupyter: this.answers.additionalModules.includes('jupyter')  
            }
        )

        // Copy readme file
        this.fs.copyTpl(
            this.templatePath('README.md'),
            this.destinationPath('README.md'),
            { 
                projectName: this.answers.projectName,
                creator: this.answers.creator  
            }
        )

        // Copy .gitignore
        this.fs.copyTpl(
            this.templatePath('.gitignore.template'),
            this.destinationPath('.gitignore'),
        )

        // Create project directory structure
        this.fs.copyTpl(
            this.templatePath('.gitkeep'),
            this.destinationPath('data/.gitkeep'),
        )

        this.fs.copyTpl(
            this.templatePath('.gitkeep'),
            this.destinationPath('notebooks/.gitkeep'),
        )

        this.fs.copyTpl(
            this.templatePath('__init__.py'),
            this.destinationPath('lib/load/__init__.py'),
        )

        this.fs.copyTpl(
            this.templatePath('__init__.py'),
            this.destinationPath('lib/transform/__init__.py'),
        )

        this.fs.copyTpl(
            this.templatePath('__init__.py'),
            this.destinationPath('lib/model/__init__.py'),
        )

        this.fs.copyTpl(
            this.templatePath('bootstrap.py'),
            this.destinationPath('lib/bootstrap.py'),
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

        // Set up git for this project
        this.composeWith(
            require.resolve('generator-git-init/generators/app'),
            { commit: "Initial commit" }
        )
    }
};
