/**
 * Utility functions for the NuGet Package Index Checker Action.
 *
 * Contains helper functions such as a resource resolver, and a sleep function to pause execution,
 * which can be used across different parts of the GitHub Action.
 *
 * @file   This file contains utility functions for the GitHub Action.
 * @author Nikita (BMTLab) Neverov (neverovnikita.bmt@gmail.com)
 * @license MIT
 */

/**
 * Utility function to pause execution for a specified duration.
 * @param {number} ms - Duration in milliseconds to pause execution.
 * @returns {Promise<void>} A promise that resolves after the specified duration.
 */
import axios from 'axios'

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Checks if a given resource at a given URL currently exists and is available.
 * @param {string} url - The URL to the NuGet package version.
 * @returns {Promise<boolean>} A promise that resolves to true if the resource is found and false if not found.
 */
export async function isResourceExist (url) {
  try {
    const response = await axios.get(url)
    return response.status === 200
  } catch (error) {
    if (error.response?.status === 404) {
      return false
    } else if (!error.response) {
      throw new Error('Network error or no response received')
    }

    throw new Error(`HTTP error: ${error.message}`)
  }
}
