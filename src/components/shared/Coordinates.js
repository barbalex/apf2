import React, { useState, useCallback, useEffect, useContext } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useApolloClient } from 'react-apollo-hooks'
import gql from 'graphql-tag'
import upperFirst from 'lodash/upperFirst'

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
import storeContext from '../../storeContext'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const Coordinates = ({ row, refetchForm, table }) => {
  const { lv95X, lv95Y, id } = row

  const client = useApolloClient()
  const store = useContext(storeContext)
  const { refetch } = store

  const [lv95XState, setLv95XState] = useState(lv95X || '')
  const [lv95YState, setLv95YState] = useState(lv95Y || '')
  const [xError, setXError] = useState('')
  const [yError, setYError] = useState('')

  // ensure state is updated when changed from outside
  useEffect(() => {
    setLv95XState(lv95X || '')
    setLv95YState(lv95Y || '')
  }, [lv95X, lv95Y])

  const onChangeX = useCallback(event => {
    const value = ifIsNumericAsNumber(event.target.value)
    setLv95XState(value)
  }, [])
  const onBlurX = useCallback(
    event => {
      const value = ifIsNumericAsNumber(event.target.value)
      const isValid = xIsValid(value)
      if (!isValid) return setXError(xMessage)
      setXError('')
      if ((value && lv95YState) || (!value && !lv95YState)) {
        saveToDb(value, lv95YState)
      }
    },
    [lv95YState],
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
      if ((value && lv95XState) || (!value && !lv95XState))
        saveToDb(lv95XState, value)
    },
    [lv95XState],
  )

  const saveToDb = useCallback(
    async (x, y) => {
      let geomPoint = null
      if (x && y) {
        const [lat, long] = epsg2056to4326(x, y)
        geomPoint = `SRID=4326;POINT(${long} ${lat})`
      }
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
        return setYError(error.message)
      }
      // update on map
      if (table === 'pop' && refetch.popForMap) refetch.popForMap()
      if (table === 'tpop' && refetch.tpopForMap) refetch.tpopForMap()
      // refetch form
      refetchForm()
      setYError('')
      setXError('')
    },
    [row],
  )

  return (
    <>
      <StyledFormControl
        fullWidth
        error={!!xError}
        aria-describedby={`${id}lv95XErrorText`}
      >
        <InputLabel htmlFor={`${id}lv95X`}>X-Koordinate</InputLabel>
        <Input
          id={`${id}lv95X`}
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
          <FormHelperText id={`${id}lv95XErrorText`}>{xError}</FormHelperText>
        )}
      </StyledFormControl>
      <StyledFormControl
        fullWidth
        error={!!yError}
        aria-describedby={`${id}lv95YErrorText`}
      >
        <InputLabel htmlFor={`${id}lv95Y`}>Y-Koordinate</InputLabel>
        <Input
          id={`${id}lv95Y`}
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
          <FormHelperText id={`${id}lv95YErrorText`}>{yError}</FormHelperText>
        )}
      </StyledFormControl>
    </>
  )
}

export default observer(Coordinates)
