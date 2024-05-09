/**
 * Test suite for the Main Execution Function of the NuGet Package Index Checker Action.
 *
 * This file contains tests for the `run` function, which is the main entry point of the GitHub Action.
 * These tests verify the integration of input validation, error handling, and the package checking process,
 * simulating various scenarios to ensure the functionality behaves as expected under different conditions.
 * The tests cover scenarios including valid and invalid input values, handling of HTTP request outcomes,
 * and proper logging of actions performed by the function.
 *
 * @file   This file defines tests for the `run` function using Vitest, focusing on the overall behavior
 *         and interaction with mocked dependencies.
 * @author Nikita (Neverov) BMTLab
 * @license MIT
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as core from '@actions/core'
import { run } from '../src/index.js'

vi.mock('@actions/core')
vi.mock('../src/core.js', async () => {
  return { default: vi.fn().mockResolvedValue(true) }
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Action Run', () => {
  it('should fail if package name is invalid', async () => {
    /// Arrange
    vi.mocked(core.getInput).mockImplementation((input) => {
      switch (input) {
        case 'package': return '%invalidName'
        case 'version': return '1.0.0'
        case 'attempts': return '3'
      }
    })

    /// Act
    await run()

    /// Assert
    expect(core.setFailed).toHaveBeenCalledWith('Invalid package name.')
  })

  it('should fail if package version is invalid', async () => {
    /// Arrange
    vi.mocked(core.getInput).mockImplementation((input) => {
      switch (input) {
        case 'package': return 'validName'
        case 'version': return 'A.B.Invalid'
        case 'attempts': return '3'
      }
    })

    /// Act
    await run()

    /// Assert
    expect(core.setFailed).toHaveBeenCalledWith('Invalid package version. Expected format: x.y.z or x.y.z-label.')
  })

  it('should fail if attempts count is invalid', async () => {
    /// Arrange
    vi.mocked(core.getInput).mockImplementation((input) => {
      switch (input) {
        case 'package': return 'validName'
        case 'version': return '1.0.0'
        case 'attempts': return '-10'
      }
    })

    /// Act
    await run()

    /// Assert
    expect(core.setFailed).toHaveBeenCalledWith('Invalid number of attempts. Must be a positive integer.')
  })

  it('should set attempts count as 1 if attempts is not set', async () => {
    /// Arrange
    vi.mocked(core.getInput).mockImplementation((input) => {
      switch (input) {
        case 'package': return 'validName'
        case 'version': return '1.0.0'
        case 'attempts': return undefined
      }
    })

    /// Act
    await run()

    /// Assert
    expect(core.debug).toHaveBeenCalledWith('Attempts: 1')
  })

  it('should handle success properly', async () => {
    /// Arrange
    vi.mocked(core.getInput).mockImplementation((input) => {
      switch (input) {
        case 'package': return 'SomePackage'
        case 'version': return '1.0.0'
        case 'attempts': return '1'
      }
    })

    /// Act
    await run()

    /// Assert
    expect(core.info).toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('indexed', String(true))
    expect(core.setFailed).toHaveBeenCalledTimes(0)
    expect(core.debug).toHaveBeenCalledWith('NuGet Package Index Checker finished work...')
  })

  it('should handle failure properly', async () => {
    /// Arrange
    const packageName = 'SomePackage'
    const packageVersion = '1.0.0'

    vi.mocked(core.getInput).mockImplementation((input) => {
      switch (input) {
        case 'package': return packageName
        case 'version': return packageVersion
        case 'attempts': return '1'
      }
    })

    const mockedCore = (await import('../src/core.js')).default
    vi.mocked(mockedCore).mockResolvedValue(false)

    /// Act
    await run()

    /// Assert
    expect(core.info).toHaveBeenCalled()
    expect(core.setOutput).toHaveBeenCalledWith('indexed', String(false))
    expect(core.setFailed).toHaveBeenCalledWith(`Package ${packageName} version ${packageVersion} is not indexed.`)
    expect(core.debug).toHaveBeenCalledWith('NuGet Package Index Checker finished work...')
  })

  it('should handle error properly', async () => {
    /// Arrange
    const packageName = 'SomePackage'
    const packageVersion = '1.0.0'

    vi.mocked(core.getInput).mockImplementation((input) => {
      switch (input) {
        case 'package': return packageName
        case 'version': return packageVersion
        case 'attempts': return '1'
      }
    })

    const error = new Error('Network error or no response received')
    const mockedCore = (await import('../src/core.js')).default
    vi.mocked(mockedCore).mockRejectedValue(error)

    /// Act
    await run()

    /// Assert
    expect(core.error).toHaveBeenCalledWith(`Error during package check: ${error.message}`)
    expect(core.setOutput).toHaveBeenCalledWith('indexed', String(false))
    expect(core.setFailed).toHaveBeenCalledWith(error)
    expect(core.debug).toHaveBeenCalledWith('NuGet Package Index Checker finished work...')
  })
})

describe('Script Execution Entry Check', () => {
  it('should not execute run function if script is not run directly', async () => {
    /// Arrange
    const originalArgv = process.argv
    vi.stubGlobal('process.argv', [process.execPath, 'someOtherFile.js'])
    const runSpy = vi.spyOn({ run }, 'run').mockResolvedValue()

    /// Act
    // Load the script, which should check argv and possibly not call run()
    await import('../src/index.js')

    /// Assert
    expect(runSpy).not.toHaveBeenCalled()

    /// Cleanup
    vi.stubGlobal('process.argv', originalArgv)
  })
})
