# generator-data-science
This project contains different Yeoman generators that can be used to create a standardized project structure for any Data Science project. It aims to provide a standardized workflow by providing a folder structure, enviroment with toolbox and some scripts to perform standard tasks (e.g. activating your conda environment and starting a Jupyter notebook).

__NB__: this project is Work In Progress and far from finished, yet.

## How to use?
First install `npm` and `Yeoman`. For instructions refer [here](http://yeoman.io/learning/). Next use the following command to obtain the generator:
```
npm install -g FutureFacts/generator-data-science
```
Then, navigate your terminal to an empty folder in which you would like to scafold your DS project. In this folder then run
```
yo data-science
```
You will now be asked a few questions on your project. Answer those. Once, you're done Yeoman will scafold a standard project structure for you.

## Dependencies
Yeoman uses `conda` to set-up a development environment for you in the background. Make sure `conda` is installed before you run this generator.