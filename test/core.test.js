/**
 * Test suite for the NuGet Package Index Checker Action.
 *
 * This file contains tests that verify whether the checkNugetPackageIndexed function
 * accurately determines the indexing status of NuGet packages on nuget.org. It uses
 * the MSW (Mock Service Worker) library to intercept and mock HTTP requests, simulating
 * different scenarios to ensure the functionality behaves as expected under various conditions.
 *
 * @file   This file defines tests for the checkNugetPackageIndexed function using Vitest.
 * @author Nikita (BMTLab) Neverov (neverovnikita.bmt@gmail.com)
 * @license MIT
 */

import { afterEach, describe, expect, it, vi } from 'vitest'
import { http } from 'msw'
import { setupServer } from 'msw/node'
import checkNugetPackageIndexed from '../src/core.js'

const server = setupServer()
const defaultTestTimeout = 10_000 // Default timeout for tests that may require retries.
const testSleepBetweenAttempts = 1 // For testing, we don't wait a long time between requests.
const urlTemplate = 'https://www.nuget.org/api/v2/package/:package/:version'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Fetching Package Status', () => {
  it('should detect indexed packages correctly', async () => {
    /// Arrange
    server.use(
      http.get(urlTemplate, (req, res, ctx) =>
        res(ctx.status(200)))
    )

    /// Act
    const result = await checkNugetPackageIndexed('SomePackage', '1.0.0', 1)

    /// Assert
    expect(result).toBe(true)
  })

  it('should return false when package is not indexed', async () => {
    /// Arrange
    server.use(
      http.get(urlTemplate, (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    /// Act
    const result = await checkNugetPackageIndexed('UnknownPackage', '1.0.0', 1)

    /// Assert
    expect(result).toBe(false)
  }, defaultTestTimeout)

  it('should retry the correct number of times before failing', async () => {
    /// Arrange
    server.use(
      http.get(urlTemplate, (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )

    /// Act
    const result = await checkNugetPackageIndexed('RetryPackage', '1.0.0', 3, testSleepBetweenAttempts) // Short delay for tests.

    /// Assert
    expect(result).toBe(false)
  }, defaultTestTimeout)

  it('should handle unexpected HTTP errors', async () => {
    /// Arrange
    server.use(
      http.get(urlTemplate, (req, res, ctx) => {
        return res(ctx.status(500))
      })
    )

    /// Act
    const result = await checkNugetPackageIndexed('ErrorPackage', '1.0.0', 1)

    /// Assert
    expect(result).toBe(false)
  }, defaultTestTimeout)
})
