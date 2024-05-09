/**
 * Validation functions for the NuGet Package Index Checker Action.
 *
 * Provides functions to validate package names, package versions, and retry attempt inputs.
 * These functions ensure that the inputs to the GitHub Action meet expected patterns and conditions.
 *
 * @file   This file contains validation logic for the GitHub Action inputs.
 * @author Nikita (BMTLab) Neverov (neverovnikita.bmt@gmail.com)
 * @license MIT
 */

/**
 * Validates if the provided input is a non-empty string and optionally matches a regex pattern.
 * @param {string} input - The input string to validate.
 * @param {RegExp} [pattern] - A regex pattern that the input must match.
 * @returns {boolean} True if the input is valid, otherwise false.
 */
export function isValidInput (input, pattern = undefined) {
  return typeof input === 'string' && input.trim() !== '' && (pattern ? pattern.test(input) : true)
}

/**
 * Validates the package name against a specific pattern.
 * Allows alphanumeric characters, underscores, hyphens, and dots.
 *
 * 1. (?!.*\.\.) -- negative forward check, ensuring that there are no two dots in a row in the string.
 * 2. (?!.*\.$) -- negative forward check to ensure that the string does not end with a dot.
 * 3. (?!.*-$) --- negative forward check to ensure that the string does not end with hyphens.
 * 4. (?!^\.)(?!^[^a-zA-Z0-9]+) -- negative forward check to ensure that the string does not start with a dot or any character that is not a letter or number.
 * 5. ([a-zA-Z0-9._-]+) -- sequence of letters, numbers, and dots that is the main part of a name.
 * @param {string} packageName - The package name to validate.
 * @returns {boolean} True if the package name is valid, according to the given pattern, false otherwise.
 */
export function isValidPackageName (packageName) {
  return isValidInput(packageName, /^(?!.*\.\.)(?!.*\.$)(?!^\.)(?!.*-$)(?!^[^a-zA-Z0-9]+)([a-zA-Z0-9._-]+)$/)
}

/**
 * Validates the package version format.
 * Accepts major, major.minor, major.minor.patch, major.minor.patch.revision formats,
 * and can include pre-release versions with a hyphen.
 * Examples of valid formats include '1', '1.2', '1.2.3', '1.2.3.4' or '1.2.3.4-beta'.
 *
 * @param {string} packageVersion - The version string to validate.
 * @returns {boolean} True if the version format is valid, otherwise false.
 */
export function isValidPackageVersion (packageVersion) {
  return isValidInput(packageVersion, /^[0-9]+(\.[0-9]+)?(\.[0-9]+)?(\.[0-9]+)?(-[0-9A-Za-z-.]+)?$/)
}

/**
 * Validates that the provided number of maximum attempts is a positive integer.
 * Ensures the number of attempts is not less than one and is not a non-numeric value.
 *
 * @param {number} maxAttempts - The maximum number of attempts to validate.
 * @returns {boolean} True if the number is a valid positive integer, false if it is less than one or not a number.
 */
export function isValidMaxAttempts (maxAttempts) {
  return !(isNaN(maxAttempts) || maxAttempts < 1)
}
