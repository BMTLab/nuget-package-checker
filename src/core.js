/**
 * Core module for checking NuGet package indexing status
 *
 * This module implements the core functionality to check if a specific NuGet package is indexed on nuget.org.
 * It performs a series of HTTP requests to determine if a package is available and logs each attempt.
 * If a package is not indexed initially, the module retries the check according to the specified number of attempts
 * and delay interval between each attempt.
 *
 * @file   This module defines the function to repeatedly check the indexing status of a NuGet package using
 *         the provided package name, version, and the maximum number of attempts. The function utilizes utility
 *         functions from './utils.js' to perform delays and check resource availability via HTTP requests.
 * @author Nikita (Neverov) BMTLab
 * @license MIT
 */

import core from '@actions/core'
import { isResourceExist, sleep } from './utils.js'

const defaultSleepBetweenAttempts = 30_000

/**
 * Repeatedly checks if a NuGet package is indexed until the maximum number of attempts is reached.
 * @param {string} packageName - The name of the NuGet package to check.
 * @param {string} packageVersion - The version of the NuGet package to check.
 * @param {number} maxAttempts - The maximum number of times to check if the package is indexed.
 * @param {number} [timeout=30000] - The delay in milliseconds between check attempts. Defaults to 30000 milliseconds.
 * @returns {Promise<boolean>} True if the package is eventually found to be indexed, otherwise false.
 */
export default async function (
  packageName,
  packageVersion,
  maxAttempts,
  timeout = defaultSleepBetweenAttempts
) {
  const url = `https://www.nuget.org/api/v2/package/${packageName}/${packageVersion}`

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const isIndexed = await isResourceExist(url)

    if (isIndexed) {
      core.info(`Package ${packageName} version ${packageVersion} is indexed on nuget.org.`)
      return true
    }

    if (attempt < maxAttempts) {
      core.info(`Attempt ${attempt} of ${maxAttempts}: Package not indexed yet. Retrying in ${timeout / 1_000} seconds...`)
      await sleep(timeout)
    }
  }

  return false
}
