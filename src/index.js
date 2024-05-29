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
import checkNugetPackageIndexed from './core.js'
import { isValidMaxAttempts, isValidPackageName, isValidPackageVersion } from './validation.js'
import { fileURLToPath } from 'url'
import path from 'path'

const defaultAttemptsCount = 1

/**
 * The main execution function that reads inputs and initiates the checking process.
 * Validates inputs and handles configuration before invoking the package check function.
 */
export async function run () {
  core.info('Starting NuGet Package Index Checker...')

  const packageName = core.getInput('package', { required: true })
  const packageVersion = core.getInput('version', { required: true })
  const maxAttempts = parseInt(core.getInput('attempts'), 10) || defaultAttemptsCount

  // Logging input values for debugging
  core.info(`Package Name: ${packageName}`)
  core.info(`Package Version: ${packageVersion}`)
  core.debug(`Attempts: ${maxAttempts}`)

  // Validate input values.
  if (!isValidPackageName(packageName)) {
    core.error(`Validation Error: Invalid package name: ${packageName}`)
    core.setFailed('Invalid package name.')
    return
  }

  if (!isValidPackageVersion(packageVersion)) {
    core.error(`Validation Error: Invalid package version: ${packageVersion}`)
    core.setFailed('Invalid package version. Expected format: x.y.z or x.y.z-label.')
    return
  }

  if (!isValidMaxAttempts(maxAttempts)) {
    core.error(`Validation Error: Invalid number of attempts: ${maxAttempts}`)
    core.setFailed('Invalid number of attempts. Must be a positive integer.')
    return
  }

  try {
    const isIndexed = await checkNugetPackageIndexed(packageName, packageVersion, maxAttempts)

    core.info(`Package indexed status: ${isIndexed}`)
    core.setOutput('indexed', String(isIndexed))

    if (!isIndexed) {
      core.setFailed(`Package ${packageName} version ${packageVersion} is not indexed.`)
    }
  } catch (error) {
    core.error(`Error during package check: ${error.message}`)
    core.setOutput('indexed', 'false')
    core.setFailed(error)
  } finally {
    core.debug('NuGet Package Index Checker finished work...')
  }
}

const currentFile = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFile)

// Check if this script is being run directly (not imported as a module), and if so, execute it.
if (process.argv[1] === currentFile || process.argv[1] === `${currentDir}/index.js`) {
  await run()
}
