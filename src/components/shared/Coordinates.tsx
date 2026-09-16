import { useState, useEffect } from 'react'
import type { ChangeEvent, FocusEvent } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import { gql as dynamicGql } from '../../apolloGql.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { upperFirst } from 'es-toolkit'
import { useAtomValue } from 'jotai'

import { userNameAtom } from '../../store/index.ts'
import { ifIsNumericAsNumber } from '../../modules/ifIsNumericAsNumber.ts'
import { epsg2056to4326 } from '../../modules/epsg2056to4326.ts'
import {
  isValid as xIsValid,
  message as xMessage,
} from '../../modules/lv95XIsValid.ts'
import {
  isValid as yIsValid,
  message as yMessage,
} from '../../modules/lv95YIsValid.ts'
import {
  isValid as wgs84LatIsValid,
  message as wgs84LatMessage,
} from '../../modules/wgs84LatIsValid.ts'
import {
  isValid as wgs84LongIsValid,
  message as wgs84LongMessage,
} from '../../modules/wgs84LongIsValid.ts'

import styles from './Coordinates.module.css'

export interface CoordinatesRow {
  id?: string
  lv95X?: number | null
  lv95Y?: number | null
  geomPoint?: { x?: number | null; y?: number | null } | null
}

export interface CoordinatesProps {
  row?: CoordinatesRow | null
  refetchForm: () => void
  table: string
}

interface GeoJsonPoint {
  type: 'Point'
  coordinates: number[]
  crs: {
    type: 'name'
    properties: { name: string }
  }
}

export const Coordinates = ({ row, refetchForm, table }: CoordinatesProps) => {
  const { lv95X, lv95Y, id } = row || {}
  const wgs84Lat = row?.geomPoint?.x
  const wgs84Long = row?.geomPoint?.y

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()
  const userName = useAtomValue(userNameAtom)

  const [lv95XState, setLv95XState] = useState<string | number | null>(lv95X || '')
  const [lv95YState, setLv95YState] = useState<string | number | null>(lv95Y || '')
  const [xError, setXError] = useState('')
  const [yError, setYError] = useState('')

  const [wgs84LatState, setWgs84LatState] = useState<string | number | null>(
    wgs84Lat || '',
  )
  const [wgs84LongState, setWgs84LongState] = useState<string | number | null>(
    wgs84Long || '',
  )
  const [wgs84LatError, setWgs84LatError] = useState('')
  const [wgs84LongError, setWgs84LongError] = useState('')

  // ensure state is updated when changed from outside
  useEffect(() => {
    setLv95XState(lv95X || '')
    setLv95YState(lv95Y || '')
  }, [lv95X, lv95Y])
  useEffect(() => {
    setWgs84LatState(wgs84Lat || '')
    setWgs84LongState(wgs84Long || '')
  }, [wgs84Lat, wgs84Long])

  const onChangeX = (event: ChangeEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setLv95XState(value)
  }

  const saveToDb = async (
    geomPoint: GeoJsonPoint | null,
    projection: 'lv95' | 'wgs84',
  ) => {
    // _somehow_ this managed to be called without id when deleting a tpop????
    if (!id) return
    try {
      const mutationTitle = `update${upperFirst(table)}ByIdForCoordinates`
      const mutationName = `update${upperFirst(table)}ById`
      const patchName = `${table}Patch`
      await apolloClient.mutate({
        mutation: dynamicGql`
            mutation ${mutationTitle}(
              $id: UUID!
              $geomPoint: GeoJSON
              $changedBy: String
            ) {
              ${mutationName}(
                input: {
                  id: $id
                  ${patchName}: { geomPoint: $geomPoint, changedBy: $changedBy }
                }
              ) {
                ${table} {
                  id
                  geomPoint {
                    geojson
                    #srid
                    x
                    y
                  }
                }
              }
            }
          `,
        // no optimistic response as geomPoint
        variables: {
          id,
          geomPoint,
          changedBy: userName,
        },
      })
    } catch (error) {
      return projection === 'lv95' ?
          setYError((error as Error).message)
        : setWgs84LatError((error as Error).message)
    }
    // update on map
    void tsQueryClient.invalidateQueries({
      queryKey: [`PopForMapQuery`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`TpopForMapQuery`],
    })
    // refetch form ONLY if id exists
    // if user has right clicked tpop without activating it, there is now row id
    refetchForm()
    setYError('')
    setXError('')
    setWgs84LatError('')
    setWgs84LongError('')
  }

  const saveToDbLv95 = (
    x: string | number | null,
    y: string | number | null,
  ) => {
    let geomPoint: GeoJsonPoint | null = null
    if (x && y) {
      const [lat = 0, long = 0] = epsg2056to4326(x, y)
      geomPoint = {
        type: 'Point',
        coordinates: [long, lat],
        // need to add crs otherwise PostGIS v2.5 (on server) errors
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326',
          },
        },
      }
    }
    void saveToDb(geomPoint, 'lv95')
  }

  const saveToDbWgs84 = (
    lat: string | number | null,
    long: string | number | null,
  ) => {
    let geomPoint: GeoJsonPoint | null = null
    if (lat && long) {
      geomPoint = {
        type: 'Point',
        coordinates: [Number(lat), Number(long)],
        // need to add crs otherwise PostGIS v2.5 (on server) errors
        crs: {
          type: 'name',
          properties: {
            name: 'urn:ogc:def:crs:EPSG::4326',
          },
        },
      }
    }
    void saveToDb(geomPoint, 'wgs84')
  }

  const onBlurX = (event: FocusEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    const isValid = xIsValid(value)
    if (!isValid) return setXError(xMessage)
    setXError('')
    // only save if changed
    if (value === lv95X) return
    if ((value && lv95YState) || (!value && !lv95YState)) {
      saveToDbLv95(value, lv95YState)
    }
  }

  const onChangeY = (event: ChangeEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setLv95YState(value)
  }

  const onBlurY = (event: FocusEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    const isValid = yIsValid(value)
    if (!isValid) return setYError(yMessage)
    setYError('')
    // only save if changed
    if (value === lv95Y) return
    if ((value && lv95XState) || (!value && !lv95XState)) {
      saveToDbLv95(lv95XState, value)
    }
  }

  const onChangeWgs84Lat = (event: ChangeEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setWgs84LatState(value)
  }

  const onBlurWgs84Lat = (event: FocusEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    const isValid = wgs84LatIsValid(value)
    if (!isValid) return setWgs84LatError(wgs84LatMessage)
    setWgs84LatError('')
    // only save if changed
    if (value === wgs84Lat) return
    if ((value && wgs84LongState) || (!value && !wgs84LongState)) {
      saveToDbWgs84(value, wgs84LongState)
    }
  }

  const onChangeWgs84Long = (event: ChangeEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setWgs84LongState(value)
  }

  const onBlurWgs84Long = (event: FocusEvent<HTMLInputElement>) => {
    const value = ifIsNumericAsNumber(event.target.value)
    const isValid = wgs84LongIsValid(value)
    if (!isValid) return setWgs84LongError(wgs84LongMessage)
    setWgs84LongError('')
    // only save if changed
    if (value === wgs84Long) return
    if ((value && wgs84LatState) || (!value && !wgs84LatState)) {
      saveToDbWgs84(wgs84LatState, value)
    }
  }

  if (!row) return null

  return (
    <>
      <div className={styles.rowClass}>
        <FormControl
          fullWidth
          error={!!wgs84LatError}
          aria-describedby={`${id}wgs84LatErrorText`}
          variant="standard"
          className={styles.leftFormControl}
        >
          <InputLabel
            htmlFor={`${id}wgs84Lat`}
            shrink
          >
            Längengrad
          </InputLabel>
          <Input
            id={`${id}wgs84Lat`}
            data-id="wgs84Lat"
            name="wgs84Lat"
            value={wgs84LatState ?? ''}
            type="number"
            onChange={onChangeWgs84Lat}
            onBlur={onBlurWgs84Lat}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {!!wgs84LatError && (
            <FormHelperText
              id={`${id}wgs84LatErrorText`}
              data-id="wgs84LatErrorText"
            >
              {wgs84LatError}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          fullWidth
          error={!!wgs84LongError}
          aria-describedby={`${id}wgs84LongErrorText`}
          variant="standard"
          className={styles.formControl}
        >
          <InputLabel
            htmlFor={`${id}wgs84Long`}
            shrink
          >
            Breitengrad
          </InputLabel>
          <Input
            id={`${id}wgs84Long`}
            data-id="wgs84Long"
            name="wgs84Long"
            value={wgs84LongState ?? ''}
            type="number"
            onChange={onChangeWgs84Long}
            onBlur={onBlurWgs84Long}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {!!wgs84LongError && (
            <FormHelperText
              id={`${id}wgs84LongErrorText`}
              data-id="wgs84LongErrorText"
            >
              {wgs84LongError}
            </FormHelperText>
          )}
        </FormControl>
      </div>
      <div className={styles.rowClass}>
        <FormControl
          fullWidth
          error={!!xError}
          aria-describedby={`${id}lv95XErrorText`}
          variant="standard"
          className={styles.leftFormControl}
        >
          <InputLabel
            htmlFor={`${id}lv95X`}
            shrink
          >
            X-Koordinate
          </InputLabel>
          <Input
            id={`${id}lv95X`}
            data-id="lv95X"
            name="lv95X"
            value={lv95XState ?? ''}
            type="number"
            onChange={onChangeX}
            onBlur={onBlurX}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {!!xError && (
            <FormHelperText
              id={`${id}lv95XErrorText`}
              data-id="lv95XErrorText"
            >
              {xError}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          fullWidth
          error={!!yError}
          aria-describedby={`${id}lv95YErrorText`}
          variant="standard"
          className={styles.formControl}
        >
          <InputLabel
            htmlFor={`${id}lv95Y`}
            shrink
          >
            Y-Koordinate
          </InputLabel>
          <Input
            id={`${id}lv95Y`}
            data-id="lv95Y"
            name="lv95Y"
            value={lv95YState ?? ''}
            type="number"
            onChange={onChangeY}
            onBlur={onBlurY}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {!!yError && (
            <FormHelperText
              id={`${id}lv95YErrorText`}
              data-id="lv95YErrorText"
            >
              {yError}
            </FormHelperText>
          )}
        </FormControl>
      </div>
    </>
  )
}
