/**
 * Test suite for the NuGet Package Index Checker Action.
 *
 * This file contains tests that verify the validation functions used in the NuGet Package Index Checker GitHub Action.
 * These tests ensure that the input validation for package names, package versions, and retry attempts
 * behave as expected under various conditions.
 *
 * @file   This file defines tests for validation functions using Vitest, focusing on input correctness and pattern matching.
 * @author Nikita (Neverov) BMTLab
 * @license MIT
 */

import { describe, expect, it } from 'vitest'
import { isValidInput, isValidMaxAttempts, isValidPackageName, isValidPackageVersion } from '../src/validation.js'

describe('Input Validation Tests', () => {
  it('validates non-empty strings without pattern', () => {
    expect(isValidInput('Valid Input')).toBe(true)
    expect(isValidInput('  Valid Input  ')).toBe(true)
    expect(isValidInput('')).toBe(false)
    expect(isValidInput('    ')).toBe(false)
  })

  it('validates non-empty strings with specific pattern', () => {
    const pattern = /^[a-z]+$/ // Только строчные латинские буквы
    expect(isValidInput('validinput', pattern)).toBe(true)
    expect(isValidInput('ValidInput', pattern)).toBe(false)
    expect(isValidInput('valid input', pattern)).toBe(false)
    expect(isValidInput('validinput123', pattern)).toBe(false)
    expect(isValidInput('valid-input', pattern)).toBe(false)
    expect(isValidInput('', pattern)).toBe(false)
  })

  it('validates package name correctly', () => {
    expect(isValidPackageName('NuGetPackage')).toBe(true)
    expect(isValidPackageName('10Package-F_dx64.dd.A')).toBe(true)
    expect(isValidPackageName('PackageName__')).toBe(true)
    expect(isValidPackageName('!InvalidPackageName')).toBe(false)
    expect(isValidPackageName('Invalid&PackageName')).toBe(false)
    expect(isValidPackageName('-InvalidPackageName')).toBe(false)
    expect(isValidPackageName('_InvalidPackageName')).toBe(false)
    expect(isValidPackageName('Invalid PackageName')).toBe(false)
    expect(isValidPackageName('..InvalidPackageName')).toBe(false)
    expect(isValidPackageName('Invalid..PackageName')).toBe(false)
    expect(isValidPackageName('InvalidPackageName.')).toBe(false)
    expect(isValidPackageName('InvalidPackageName-')).toBe(false)
    expect(isValidPackageName('')).toBe(false)
  })

  it('validates package version correctly', () => {
    expect(isValidPackageVersion('0.0.1')).toBe(true)
    expect(isValidPackageVersion('1.0.0')).toBe(true)
    expect(isValidPackageVersion('1.0')).toBe(true)
    expect(isValidPackageVersion('1')).toBe(true)
    expect(isValidPackageVersion('1.0.0-beta')).toBe(true)
    expect(isValidPackageVersion('1.0.0-BETA')).toBe(true)
    expect(isValidPackageVersion('1.0.0.1')).toBe(true)
    expect(isValidPackageVersion('1.0.0.1-preview')).toBe(true)
    expect(isValidPackageVersion('1.0.0.1.5')).toBe(false)
    expect(isValidPackageVersion('v1.0.0')).toBe(false)
    expect(isValidPackageVersion('v-1.0.0')).toBe(false)
  })

  it('validates attempts input correctly', () => {
    expect(isValidMaxAttempts('3')).toBe(true)
    expect(isValidMaxAttempts('999')).toBe(true)
    expect(isValidMaxAttempts('-1')).toBe(false)
    expect(isValidMaxAttempts('abc')).toBe(false)
  })
})
