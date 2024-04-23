/**
 * Test suite for the NuGet Package Index Checker
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

import { describe, it, expect } from 'vitest'
import { isValidMaxAttempts, isValidPackageName, isValidPackageVersion } from '../src/validation.js'

describe('Input Validation Tests', () => {
  it('validates package name correctly', () => {
    expect(isValidPackageName('NuGetPackage')).toBe(true)
    expect(isValidPackageName('!InvalidPackageName')).toBe(false)
    expect(isValidPackageName('Invalid PackageName')).toBe(false)
    expect(isValidPackageName('')).toBe(false)
  })

  it('validates package version correctly', () => {
    expect(isValidPackageVersion('0.0.1')).toBe(true)
    expect(isValidPackageVersion('1.0.0')).toBe(true)
    expect(isValidPackageVersion('1.0')).toBe(true)
    expect(isValidPackageVersion('1')).toBe(true)
    expect(isValidPackageVersion('1.0.0-beta')).toBe(true)
    expect(isValidPackageVersion('1.0.0.1')).toBe(true)
    expect(isValidPackageVersion('1.0.0.1-preview')).toBe(true)
    expect(isValidPackageVersion('1.0.0.1.5')).toBe(false)
  })

  it('validates attempts input correctly', () => {
    expect(isValidMaxAttempts('3')).toBe(true)
    expect(isValidMaxAttempts('-1')).toBe(false)
    expect(isValidMaxAttempts('abc')).toBe(false)
  })
})
