# reactsuger
Creates the boilerplates for react component stacks

## Compatible

nodejs version >= 6.2.*

## Purpose

Rather than manually creating three files each time we want to write a react component. This tiny script helps to create following three files in one command!

1. package.json
2. [name].jsx
3. [name]Styles.css

> the first letter of name is capitalized 

## Install

`npm install -g react-suger`

and export your global node path as follow:

`echo 'export NODE_PATH="'$(npm root -g)'"' >> ~/.bash_profile && . ~/.bash_profile` 

if you don't export your `NODE_PATH` as global variable, reactsuger will try to find `boilerplates` folder in your local working directory.

## Usage

`reactsuger home` ---> creates boilerplates under your current working directory.

### Pure function component

`reactsuger -p home` ---> does the same as the above, just that the component is now in pure function.

