#!/usr/bin/env node

/**
 * reactsugar create <name> [options]
 *  options:
 *    1. -p, --pure
 *
 * 1. If path is not specified, current path folder is used.
 * 2. name will be used in following places:
 *   - package.json
 *   - [name].jsx
 *   - [name]Styles.css
 *
 * @TODOs
 *  - Extract file data to config file.
 *  - Refactor - done.
 *  - If directory already exists at the destinated folder / file. remove them first - done.
 */

'use strict'

const program = require('commander')
const { resolve, parse } = require('path')
const {
  exists,
  mkdirSync,
  writeFile,
  readFileSync,
} = require('fs')
const mkdirp = require('mkdirp')
const remove = require('remove')
const colors = require('colors')

const CURRENT_PATH = process.cwd()
const BOILERPLATE_PATH = process.env.NODE_PATH
  ? `${process.env.NODE_PATH}/react-sugar/boilerplates`
  : `${CURRENT_PATH}/boilerplates`

/**
 * @param {string} name
 * @param {string} targetPath
 * @param {bool} pure
 * @param {mode}
 */
const FILE_CONFIGS = (name, targetPath, pure) => ([
  {
    filename: 'package.json',
    componentName: name, // Name of the react component that will replace the placeholder.
    targetPath, // Destinated path the file will be created.
    boilerplate: 'package.json.txt', // name of the boilerplate that will be used. all boilerplates need to be placed under boilerplates folder.
  },
  {
    filename: `${name}.jsx`,
    componentName: name,
    targetPath,
    boilerplate: pure
      ? 'pureFunctionComponent.txt'
      : 'component.txt',
  },
  { // If boilerplate attribute does not exist, don't replace
    filename: `${name}.css`,
    targetPath,
  }
])

/**
 * @param {object} file
 */
const touchFile = file => {
  let replacedBoilerplateString = ''

  if (file.boilerplate && file.boilerplate !== '') {
    const boilerplateString = readFileSync(
      resolve(`${BOILERPLATE_PATH}`, file.boilerplate),
      'utf8'
    )

    replacedBoilerplateString = boilerplateString.replace(/\{name\}/g, file.componentName)
  }

  writeFile(`${file.targetPath}/${file.filename}`, replacedBoilerplateString, 'utf8', err => {
    if (!err) {
      console.log(`File ${file.targetPath}/${file.filename} has been created!`.green) // output green words!!

      return
    }

    console.error(err.red, 1)
    process.exit(1)
  })
}

program
  .version('1.1.2')
  .command('create <filename>')
  .option('-p, --pure', 'Should component be a pure function or extends react component, default to extend default component.')
  .action((filename, options) => { // @TODO should set a defualt argument for path
    // create 3 files based on name and path:
    //  1. package.json
    //  2. [name].jsx
    //  3. [name]Styles.css
    const { dir, name } = parse(filename)
    const capitalizedName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    const targetPath = resolve(CURRENT_PATH, dir, capitalizedName)

    if (dir !== '') {
      mkdirp.sync(dir)
    }

    // if name is in a pattern of "./a/b/c"
    exists(targetPath, exists => {
      if (exists) {
        remove.removeSync(targetPath)
      }

      mkdirSync(targetPath)

      FILE_CONFIGS(capitalizedName, targetPath, options.pure).forEach(file => {
        touchFile(file)
      })
    })
  })

  program.parse(process.argv)
