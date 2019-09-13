import React, { useState, useCallback, useEffect, useContext } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
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
  const { lv95X, lv95Y, wgs84Lat, wgs84Long, id } = row || {}

  const client = useApolloClient()
  const store = useContext(storeContext)
  const { refetch } = store

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

  const onChangeX = useCallback(event => {
    const value = ifIsNumericAsNumber(event.target.value)
    setLv95XState(value)
  }, [])

  const saveToDb = useCallback(
    async (geomPoint, projection) => {
      // _somehow_ this managed to be called without id when deleting a tpop????
      if (!id) return
      try {
        const mutationName = `update${upperFirst(table)}ById`
        const patchName = `${table}Patch`
        await client.mutate({
          mutation: gql`
            mutation ${mutationName}(
              $id: UUID!
              $geomPoint: String
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
                  geomPoint
                }
              }
            }
          `,
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
      if (table === 'pop' && refetch.popForMap) refetch.popForMap()
      if (table === 'tpop' && refetch.tpopForMap) refetch.tpopForMap()
      // refetch form
      refetchForm()
      setYError('')
      setXError('')
      setWgs84LatError('')
      setWgs84LongError('')
    },
    [client, id, refetch, refetchForm, row.id, store.user.name, table],
  )
  const saveToDbLv95 = useCallback(
    (x, y) => {
      let geomPoint = null
      if (x && y) {
        const [lat, long] = epsg2056to4326(x, y)
        geomPoint = `SRID=4326;POINT(${long} ${lat})`
      }
      saveToDb(geomPoint, 'lv95')
    },
    [saveToDb],
  )
  const saveToDbWgs84 = useCallback(
    (lat, long) => {
      let geomPoint = null
      if (lat && long) {
        geomPoint = `SRID=4326;POINT(${long} ${lat})`
      }
      saveToDb(geomPoint, 'wgs84')
    },
    [saveToDb],
  )
  const onBlurX = useCallback(
    event => {
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
  const onChangeY = useCallback(event => {
    const value = ifIsNumericAsNumber(event.target.value)
    setLv95YState(value)
  }, [])
  const onBlurY = useCallback(
    event => {
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

  const onChangeWgs84Lat = useCallback(event => {
    const value = ifIsNumericAsNumber(event.target.value)
    setWgs84LatState(value)
  }, [])
  const onBlurWgs84Lat = useCallback(
    event => {
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
  const onChangeWgs84Long = useCallback(event => {
    const value = ifIsNumericAsNumber(event.target.value)
    setWgs84LongState(value)
  }, [])
  const onBlurWgs84Long = useCallback(
    event => {
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
        >
          <InputLabel htmlFor={`${id}wgs84Lat`} shrink>
            Breitengrad
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
        >
          <InputLabel htmlFor={`${id}wgs84Long`} shrink>
            Längengrad
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
