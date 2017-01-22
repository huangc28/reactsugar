#!/usr/bin/env node

/**
 * reactsuger --name "Home" --path "./migme/"
 *
 * 1. If path is not specified, current path folder is used.
 * 2. name will be used in following places:
 *   - package.json
 *   - [name].jsx
 *   - [name]Styles.css
 *
 *
 * @TODOs
 *  - Extract file data to config file.
 *  - Refactor - done.
 *  - If directory already exists at the destinated folder / file. remove them first - done.
 */

const program = require('commander')
const { resolve } = require('path')
const {
  exists,
  mkdirSync,
  writeFile,
  readFileSync,
} = require('fs')
const remove = require('remove')
const colors = require('colors')

const CURRENT_PATH = process.cwd()

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
    filename: `${name}Styles.css`,
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
      resolve(CURRENT_PATH, 'boilerplates', file.boilerplate),
      'utf8'
    )

    replacedBoilerplateString = boilerplateString.replace(/\{name\}/g, file.componentName)
  }

  writeFile(`${file.targetPath}/${file.filename}`, replacedBoilerplateString, 'utf8', err => {
    if (!err) {
      console.log(`File ${file.targetPath}/${file.filename} has been created!`.green) // output green words!!

      return
    }

    console.error(err, 1)
    process.exit(1)
  })
}

program
  .arguments('<name>')
  .version('1.0.0')
  .option('-n, --name <name>', 'Name of the react component.')
  .option('-p, --pure [pure]', 'Should component be a pure function or extends react component, default to extend default component.')
  .action((name, pure) => { // @TODO should set a defualt argument for path
    // create 3 files based on name and path:
    //  1. package.json
    //  2. [name].jsx
    //  3. [name]Styles.css
    const targetPath = resolve(CURRENT_PATH, name)

    exists(targetPath, exists => {
      // if path exists, create files straight ahead
      // if not, create directory first.

      if (exists) {
        remove.removeSync(targetPath)
      }
      mkdirSync(targetPath)

      const capitalizedName = `${name.charAt(0).toUpperCase()}${name.slice(1)}`

      FILE_CONFIGS(capitalizedName, targetPath, pure).forEach(file => {
        touchFile(file)
      })
    })
  })
  .parse(process.argv);
