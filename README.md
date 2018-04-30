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
Yeoman uses `conda` to set-up a development environment for you in the background. Make sure `conda` is installed before you run this generator and make sure it is on your path.

## What does this scaffold for me?
This generator initializes a standardized structure that is generic enough to be used with almost any data science project.
The generated project structure consists of the following folders:
- `data`: In this folder you should store your raw data, this folder is excluded from  version control
- `notebooks`: A folder for your notebooks, or any unstructured scratch files
- `lib`: This folder is comprised of three subfolders, each relating to one of the stages in your modeling project. The goal of this folder is to structure you project into a reusable format that can be run simply by calling a single script (for the Python generator this is `lib/bootstrap.py`).

Futhermore the generator automatically creates a `conda` environment for you. At creation time you can indicate if you want some specific dependencies, e.g. for deep learning projects. 

Lastly, this generator configures version control (Git) for your project and makes an intial commit of the empty project structure.