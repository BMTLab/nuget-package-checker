/**
 * Test suite for utility functions used in the NuGet Package Index Checker Action.
 *
 * This file contains tests for utility functions such as `sleep` and `isResourceExist`.
 * `sleep` tests ensure that the delay function accurately pauses execution for the specified duration.
 * `isResourceExist` tests verify HTTP requests handling by simulating responses for existing and non-existing resources,
 * as well as handling different types of network errors.
 *
 * @file   This file defines tests for the utility functions using Vitest, focusing on accurate timing and HTTP behavior simulation.
 * @author Nikita (Neverov) BMTLab
 * @license MIT
 */

import { isResourceExist, sleep } from '../src/utils'
import { describe, expect, it, vi } from 'vitest'
import axios from 'axios'

describe('Sleep Utility', () => {
  it('pauses execution for a specified duration', async () => {
    /// Assert
    const ms = 500
    const spy = vi.fn()

    /// Act
    const start = performance.now()
    await sleep(ms).then(spy)
    const end = performance.now()

    /// Assert
    expect(spy).toHaveBeenCalled()
    expect(end - start).toBeGreaterThanOrEqual(ms)
  })
})

vi.mock('axios')

describe('Resource Exist Utility', () => {
  it('returns true when the resource exists', async () => {
    /// Assert
    vi.mocked(axios.get).mockResolvedValue({ status: 200 })

    /// Act
    const url = 'https://api.nuget.org/v3/index.json'

    /// Assert
    expect(await isResourceExist(url)).toBe(true)
  })

  it('returns false when the resource does not exist', async () => {
    /// Assert
    vi.mocked(axios.get).mockRejectedValue({
      response: { status: 404 }
    })

    /// Act
    const url = 'https://api.nuget.org/v3/nonexistent.json'

    /// Assert
    expect(await isResourceExist(url)).toBe(false)
  })

  it('throws an error when a network error occurs', async () => {
    /// Assert
    vi.mocked(axios.get).mockRejectedValue({
      response: null
    })

    /// Act
    const url = 'https://api.nuget.org/v3/index.json'

    /// Assert
    await expect(isResourceExist(url)).rejects.toThrow('Network error or no response received')
  })

  it('throws an error for other HTTP errors', async () => {
    /// Assert
    const errorMessage = 'Service Unavailable'
    vi.mocked(axios.get).mockRejectedValue({
      message: errorMessage,
      response: { status: 503 }
    })

    /// Act
    const url = 'https://api.nuget.org/v3/index.json'

    /// Assert
    await expect(isResourceExist(url)).rejects.toThrow(`HTTP error: ${errorMessage}`)
  })
})
