import React, { useState, useCallback, useEffect, useContext } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import { useApolloClient, gql } from '@apollo/client'
import upperFirst from 'lodash/upperFirst'

import storeContext from '../../storeContext'
import ifIsNumericAsNumber from '../../modules/ifIsNumericAsNumber'
import epsg2056to4326 from '../../modules/epsg2056to4326'
import {
  isValid as xIsValid,
  message as xMessage,
} from '../../modules/lv95XIsValid'
import {
  isValid as yIsValid,
  message as yMessage,
} from '../../modules/lv95YIsValid'
import {
  isValid as wgs84LatIsValid,
  message as wgs84LatMessage,
} from '../../modules/wgs84LatIsValid'
import {
  isValid as wgs84LongIsValid,
  message as wgs84LongMessage,
} from '../../modules/wgs84LongIsValid'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const LeftFormControl = styled(StyledFormControl)`
  padding-right: 8px !important;
`
const Row = styled.div`
  display: flex;
`

const Coordinates = ({ row, refetchForm, table }) => {
  const { lv95X, lv95Y, id } = row || {}
  const wgs84Lat = row?.geomPoint?.x
  const wgs84Long = row?.geomPoint?.y

  const client = useApolloClient()
  const store = useContext(storeContext)

  const [lv95XState, setLv95XState] = useState(lv95X || '')
  const [lv95YState, setLv95YState] = useState(lv95Y || '')
  const [xError, setXError] = useState('')
  const [yError, setYError] = useState('')

  const [wgs84LatState, setWgs84LatState] = useState(wgs84Lat || '')
  const [wgs84LongState, setWgs84LongState] = useState(wgs84Long || '')
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

  const onChangeX = useCallback((event) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setLv95XState(value)
  }, [])

  const saveToDb = useCallback(
    async (geomPoint, projection) => {
      // _somehow_ this managed to be called without id when deleting a tpop????
      if (!id) return
      try {
        const mutationTitle = `update${upperFirst(table)}ByIdForCoordinates`
        const mutationName = `update${upperFirst(table)}ById`
        const patchName = `${table}Patch`
        await client.mutate({
          mutation: gql`
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
          // no optimistic responce as geomPoint
          variables: {
            id: row.id,
            geomPoint,
            changedBy: store.user.name,
          },
        })
      } catch (error) {
        return projection === 'lv95'
          ? setYError(error.message)
          : setWgs84LatError(error.message)
      }
      // update on map
      client.refetchQueries({
        include: ['TpopForMapQuery', 'PopForMapQuery'],
      })
      // refetch form ONLY if id exists
      // if user has right clicked tpop without activating it, there is now row id
      refetchForm()
      setYError('')
      setXError('')
      setWgs84LatError('')
      setWgs84LongError('')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, id, refetchForm, row, row.id, store.user.name, table],
  )
  const saveToDbLv95 = useCallback(
    (x, y) => {
      let geomPoint = null
      if (x && y) {
        const [lat, long] = epsg2056to4326(x, y)
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
      saveToDb(geomPoint, 'lv95')
    },
    [saveToDb],
  )
  const saveToDbWgs84 = useCallback(
    (lat, long) => {
      let geomPoint = null
      if (lat && long) {
        geomPoint = {
          type: 'Point',
          coordinates: [lat, long],
          // need to add crs otherwise PostGIS v2.5 (on server) errors
          crs: {
            type: 'name',
            properties: {
              name: 'urn:ogc:def:crs:EPSG::4326',
            },
          },
        }
      }
      saveToDb(geomPoint, 'wgs84')
    },
    [saveToDb],
  )
  const onBlurX = useCallback(
    (event) => {
      const value = ifIsNumericAsNumber(event.target.value)
      const isValid = xIsValid(value)
      if (!isValid) return setXError(xMessage)
      setXError('')
      // only save if changed
      if (value === lv95X) return
      if ((value && lv95YState) || (!value && !lv95YState)) {
        saveToDbLv95(value, lv95YState)
      }
    },
    [lv95X, lv95YState, saveToDbLv95],
  )
  const onChangeY = useCallback((event) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setLv95YState(value)
  }, [])
  const onBlurY = useCallback(
    (event) => {
      const value = ifIsNumericAsNumber(event.target.value)
      const isValid = yIsValid(value)
      if (!isValid) return setYError(yMessage)
      setYError('')
      // only save if changed
      if (value === lv95Y) return
      if ((value && lv95XState) || (!value && !lv95XState))
        saveToDbLv95(lv95XState, value)
    },
    [lv95XState, lv95Y, saveToDbLv95],
  )

  const onChangeWgs84Lat = useCallback((event) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setWgs84LatState(value)
  }, [])
  const onBlurWgs84Lat = useCallback(
    (event) => {
      const value = ifIsNumericAsNumber(event.target.value)
      const isValid = wgs84LatIsValid(value)
      if (!isValid) return setWgs84LatError(wgs84LatMessage)
      setWgs84LatError('')
      // only save if changed
      if (value === wgs84Lat) return
      if ((value && wgs84LongState) || (!value && !wgs84LongState)) {
        saveToDbWgs84(value, wgs84LongState)
      }
    },
    [saveToDbWgs84, wgs84Lat, wgs84LongState],
  )
  const onChangeWgs84Long = useCallback((event) => {
    const value = ifIsNumericAsNumber(event.target.value)
    setWgs84LongState(value)
  }, [])
  const onBlurWgs84Long = useCallback(
    (event) => {
      const value = ifIsNumericAsNumber(event.target.value)
      const isValid = wgs84LongIsValid(value)
      if (!isValid) return setWgs84LongError(wgs84LongMessage)
      setWgs84LongError('')
      // only save if changed
      if (value === wgs84Long) return
      if ((value && wgs84LatState) || (!value && !wgs84LatState)) {
        saveToDbWgs84(wgs84LatState, value)
      }
    },
    [saveToDbWgs84, wgs84LatState, wgs84Long],
  )

  if (!row) return null

  return (
    <>
      <Row>
        <LeftFormControl
          fullWidth
          error={!!wgs84LatError}
          aria-describedby={`${id}wgs84LatErrorText`}
          variant="standard"
        >
          <InputLabel htmlFor={`${id}wgs84Lat`} shrink>
            Längengrad
          </InputLabel>
          <Input
            id={`${id}wgs84Lat`}
            data-id="wgs84Lat"
            name="wgs84Lat"
            value={wgs84LatState}
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
        </LeftFormControl>
        <StyledFormControl
          fullWidth
          error={!!wgs84LongError}
          aria-describedby={`${id}wgs84LongErrorText`}
          variant="standard"
        >
          <InputLabel htmlFor={`${id}wgs84Long`} shrink>
            Breitengrad
          </InputLabel>
          <Input
            id={`${id}wgs84Long`}
            data-id="wgs84Long"
            name="wgs84Long"
            value={wgs84LongState}
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
        </StyledFormControl>
      </Row>
      <Row>
        <LeftFormControl
          fullWidth
          error={!!xError}
          aria-describedby={`${id}lv95XErrorText`}
          variant="standard"
        >
          <InputLabel htmlFor={`${id}lv95X`} shrink>
            X-Koordinate
          </InputLabel>
          <Input
            id={`${id}lv95X`}
            data-id="lv95X"
            name="lv95X"
            value={lv95XState}
            type="number"
            onChange={onChangeX}
            onBlur={onBlurX}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {!!xError && (
            <FormHelperText id={`${id}lv95XErrorText`} data-id="lv95XErrorText">
              {xError}
            </FormHelperText>
          )}
        </LeftFormControl>
        <StyledFormControl
          fullWidth
          error={!!yError}
          aria-describedby={`${id}lv95YErrorText`}
          variant="standard"
        >
          <InputLabel htmlFor={`${id}lv95Y`} shrink>
            Y-Koordinate
          </InputLabel>
          <Input
            id={`${id}lv95Y`}
            data-id="lv95Y"
            name="lv95Y"
            value={lv95YState}
            type="number"
            onChange={onChangeY}
            onBlur={onBlurY}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
          {!!yError && (
            <FormHelperText id={`${id}lv95YErrorText`} data-id="lv95YErrorText">
              {yError}
            </FormHelperText>
          )}
        </StyledFormControl>
      </Row>
    </>
  )
}

export default observer(Coordinates)
