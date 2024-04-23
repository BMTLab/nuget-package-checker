/**
 * Main entry point for the NuGet Package Index Checker Action.
 *
 * This module implements the core functionality of the GitHub Action,
 * orchestrating the checking of NuGet package availability on nuget.org.
 * It uses utility functions and validation checks to ensure proper execution
 * and provides detailed logging and error handling.
 *
 * @file   This is the main script for the NuGet Package Index Checker GitHub Action,
 *         including the action's primary logic and execution flow.
 * @author Nikita (BMTLab) Neverov (neverovnikita.bmt@gmail.com)
 * @license MIT
 */

// GitHub Actions toolkit for interaction with GitHub Actions.
import core from '@actions/core'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { isResourceExist, sleep } from './utils.js'
import { isValidPackageName, isValidPackageVersion, isValidMaxAttempts } from './validation.js'

const defaultAttemptsCount = 1
const defaultSleepBetweenAttempts = 30_000

/**
 * Repeatedly checks if a NuGet package is indexed until the maximum number of attempts is reached.
 * @param {string} packageName - The name of the NuGet package to check.
 * @param {string} packageVersion - The version of the NuGet package to check.
 * @param {number} maxAttempts - The maximum number of times to check if the package is indexed.
 * @param {number} [timeout=30000] - The delay in milliseconds between check attempts. Defaults to 30000 milliseconds.
 * @returns {Promise<boolean>} True if the package is eventually found to be indexed, otherwise false.
 */
export async function checkNugetPackageIndexed (
  packageName,
  packageVersion,
  maxAttempts,
  timeout = defaultSleepBetweenAttempts
) {
  const url = `https://www.nuget.org/api/v2/package/${packageName}/${packageVersion}`

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const isIndexed = await isResourceExist(url)

    if (isIndexed) {
      console.log(`Package ${packageName} version ${packageVersion} is indexed on nuget.org.`)
      return true
    }

    if (attempt < maxAttempts) {
      console.log(`Attempt ${attempt} of ${maxAttempts}: Package not indexed yet. Retrying in ${timeout / 1_000} seconds...`)
      await sleep(timeout)
    }
  }

  return false
}

/**
 * The main execution function that reads inputs and initiates the checking process.
 * Validates inputs and handles configuration before invoking the package check function.
 */
function run () {
  console.log('Starting NuGet Package Index Checker...')

  const packageName = core.getInput('package', { required: true })
  const packageVersion = core.getInput('version', { required: true })
  const maxAttempts = parseInt(core.getInput('attempts'), 10) || defaultAttemptsCount

  // Logging input values for debugging
  console.log(`Package Name: ${packageName}`)
  console.log(`Package Version: ${packageVersion}`)
  console.log(`Max Attempts: ${maxAttempts}`)

  // Validate input values.
  if (!isValidPackageName(packageName)) {
    console.error(`Validation Error: Invalid package name: ${packageName}`)
    core.setFailed('Invalid package name.')
    return
  }

  if (!isValidPackageVersion(packageVersion)) {
    console.error(`Validation Error: Invalid package version: ${packageVersion}`)
    core.setFailed('Invalid package version. Expected format: x.y.z or x.y.z-label.')
    return
  }

  if (!isValidMaxAttempts(maxAttempts)) {
    console.error(`Validation Error: Invalid number of attempts: ${maxAttempts}`)
    core.setFailed('Invalid number of attempts. Must be a positive integer.')
    return
  }

  checkNugetPackageIndexed(packageName, packageVersion, maxAttempts)
    .then(isIndexed => {
      console.log(`Package indexed status: ${isIndexed}`)
      core.setOutput('indexed', String(isIndexed))
      if (!isIndexed) {
        core.setFailed(`Package ${packageName} version ${packageVersion} is not indexed.`)
      }
    })
  // Execute the check and handle any errors.
    .catch(error => {
      console.error(`Error during package check: ${error.message}`)
      core.setOutput('indexed', 'false')
      core.setFailed(error.message)
    })
}

const currentFile = fileURLToPath(import.meta.url)
const currentDir = dirname(currentFile)

// Check if this script is being run directly (not imported as a module), and if so, execute it.
if (process.argv[1] === currentFile || process.argv[1] === `${currentDir}/index.js`) {
  run()
}
