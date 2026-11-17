import { describe, expect, it } from 'vitest'
import { QueryClient } from '@tanstack/react-query'

import { updateFormRowInCaches } from './updateFormRowInCaches.ts'

const key = ['tpopfeldkontr', 'kontr-1'] as const

describe('updateFormRowInCaches', () => {
  it('patches the cached row of the matching query', () => {
    const tsQueryClient = new QueryClient()
    tsQueryClient.setQueryData(key, {
      tpopkontrById: { id: 'kontr-1', typ: 'Kontrolle', jahr: 2024 },
      allAdresses: { nodes: [] },
    })

    updateFormRowInCaches({
      tsQueryClient,
      queryKey: key,
      rowKey: 'tpopkontrById',
      row: { id: 'kontr-1', typ: 'Ausgangszustand', changedBy: 'gabriel' },
    })

    expect(tsQueryClient.getQueryData(key)).toEqual({
      tpopkontrById: {
        id: 'kontr-1',
        typ: 'Ausgangszustand',
        jahr: 2024,
        changedBy: 'gabriel',
      },
      allAdresses: { nodes: [] },
    })
  })

  it('patches via a prefix key when the exact id is not part of the key', () => {
    const tsQueryClient = new QueryClient()
    tsQueryClient.setQueryData(key, {
      tpopkontrById: { id: 'kontr-1', typ: 'Kontrolle' },
    })

    updateFormRowInCaches({
      tsQueryClient,
      queryKey: ['tpopfeldkontr'],
      rowKey: 'tpopkontrById',
      row: { id: 'kontr-1', typ: 'Ausgangszustand' },
    })

    expect(tsQueryClient.getQueryData(key)).toEqual({
      tpopkontrById: { id: 'kontr-1', typ: 'Ausgangszustand' },
    })
  })

  it('leaves caches of other rows alone', () => {
    const tsQueryClient = new QueryClient()
    tsQueryClient.setQueryData(['tpopfeldkontr', 'kontr-2'], {
      tpopkontrById: { id: 'kontr-2', typ: 'Kontrolle' },
    })

    updateFormRowInCaches({
      tsQueryClient,
      queryKey: ['tpopfeldkontr'],
      rowKey: 'tpopkontrById',
      row: { id: 'kontr-1', typ: 'Ausgangszustand' },
    })

    expect(tsQueryClient.getQueryData(['tpopfeldkontr', 'kontr-2'])).toEqual({
      tpopkontrById: { id: 'kontr-2', typ: 'Kontrolle' },
    })
  })

  it('patches queries that cache the row directly (no rowKey)', () => {
    const tsQueryClient = new QueryClient()
    tsQueryClient.setQueryData(['tpop', 'tpop-1'], {
      id: 'tpop-1',
      nr: 4,
      flurname: 'Alter Flurname',
    })

    updateFormRowInCaches({
      tsQueryClient,
      queryKey: ['tpop'],
      row: { id: 'tpop-1', flurname: 'Neuer Flurname' },
    })

    expect(tsQueryClient.getQueryData(['tpop', 'tpop-1'])).toEqual({
      id: 'tpop-1',
      nr: 4,
      flurname: 'Neuer Flurname',
    })
  })

  it('does nothing without a string id', () => {
    const tsQueryClient = new QueryClient()
    tsQueryClient.setQueryData(key, {
      tpopkontrById: { id: 'kontr-1', typ: 'Kontrolle' },
    })

    updateFormRowInCaches({
      tsQueryClient,
      queryKey: key,
      rowKey: 'tpopkontrById',
      row: { typ: 'Ausgangszustand' },
    })

    expect(tsQueryClient.getQueryData(key)).toEqual({
      tpopkontrById: { id: 'kontr-1', typ: 'Kontrolle' },
    })
  })
})
