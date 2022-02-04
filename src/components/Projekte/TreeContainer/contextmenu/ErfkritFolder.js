import React, { useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AsyncSelect from 'react-select/async'
import styled from 'styled-components'
import { gql, useApolloClient } from '@apollo/client'

import userIsReadOnly from '../../../../modules/userIsReadOnly'
import storeContext from '../../../../storeContext'
import ErrorBoundary from '../../../shared/ErrorBoundary'
import { ContextMenu, MenuItem } from 'react-contextmenu/dist/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'erfkrit',
}

const SelectContainer = styled.div`
  padding-top: 15px;
  min-height: 360px;
  max-height: 360px;
`
const SelectLabel = styled.div`
  font-size: 12px;
  color: rgb(0, 0, 0, 0.54);
`
const SelectStyled = styled(AsyncSelect)`
  .react-select__control {
    background-color: rgba(0, 0, 0, 0) !important;
    border-bottom-color: rgba(0, 0, 0, 0.1);
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  .react-select__control:hover {
    border-bottom-width: 2px;
  }
  .react-select__control:focus-within {
    border-bottom-color: rgba(28, 80, 31, 1) !important;
    box-shadow: none;
  }
  .react-select__select-container {
    padding-top: 5px;
  }
  .react-select__value-container {
    padding-left: 0;
  }
  .react-select__clear-indicator {
    /* ability to hide caret when not enough space */
    padding-right: ${(props) => (props.nocaret ? '0' : '8px')};
  }
  .react-select__dropdown-indicator {
    /* ability to hide caret when not enough space */
    display: ${(props) => (props.nocaret ? 'none' : 'flex')};
  }
  .react-select__indicator-separator {
    /* ability to hide caret when not enough space */
    width: ${(props) => (props.nocaret ? '0' : '1px')};
  }
`
const Error = styled.div`
  font-size: 12px;
  color: red;
`

const ErfkritFolder = ({ onClick, treeName }) => {
  const client = useApolloClient()
  const { user, enqueNotification } = useContext(storeContext)
  // according to https://github.com/vkbansal/react-contextmenu/issues/65
  // this is how to pass data from ContextMenuTrigger to ContextMenu
  // i.e. to know what node was clicked
  const [apId, changeApId] = useState(0)
  const onShow = useCallback(
    (event) => changeApId(event.detail.data.tableId),
    [],
  )

  const [openChooseAp, setOpenChooseAp] = useState(false)
  const onCloseChooseApDialog = useCallback(() => setOpenChooseAp(false), [])
  const onOpenChooseApDialog = useCallback(() => setOpenChooseAp(true), [])

  const onChooseAp = useCallback(
    async (option) => {
      const newApId = option.value
      // 0. choosing no option is not possible so needs not be catched
      // 1. delete existing erfkrit
      // 1.1: query existing erfkrit
      let existingErfkritResult
      try {
        existingErfkritResult = await client.query({
          query: gql`
            query getExistingErfkritForErfkritFolder($apId: UUID) {
              allErfkrits(filter: { apId: { equalTo: $apId } }) {
                nodes {
                  id
                }
              }
            }
          `,
          variables: {
            apId,
          },
          // got errors when not setting 'network-only' policy
          // when copying repeatedly
          // apollo seemed to use local cache which was not up to date any more
          // so probably not the newly inserted were queried but the earlier deleted ones
          // which created conflicts with uniqueness
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        console.log({ error })
        setApOptionsError(
          `Fehler beim Abfragen der Aktionspläne: ${error.message}`,
        )
      }
      const existingErfkrits = (
        existingErfkritResult?.data?.allErfkrits?.nodes ?? []
      ).map((e) => e.id)

      // 1.2: delete existing erfkrit
      try {
        await Promise.allSettled(
          existingErfkrits.map(
            async (id) =>
              await client.mutate({
                mutation: gql`
                  mutation deleteExistingErfkritForErfkritFolder($id: UUID!) {
                    deleteErfkritById(input: { id: $id }) {
                      deletedErfkritId
                    }
                  }
                `,
                variables: {
                  id,
                },
                update(cache) {
                  cache.evict({ id })
                },
              }),
          ),
        )
      } catch (error) {
        console.log({ error })
        setApOptionsError(
          `Fehler beim Löschen der existierenden Erfolgskriterien: ${error.message}`,
        )
      }

      // 2. add erfkrit from other ap
      // 2.1: query erfkrit
      let newErfkritResult
      try {
        newErfkritResult = await client.query({
          query: gql`
            query getNewErfkritForErfkritFolder($apId: UUID) {
              allErfkrits(filter: { apId: { equalTo: $apId } }) {
                nodes {
                  id
                  apId
                  erfolg
                  kriterien
                }
              }
            }
          `,
          variables: {
            apId: newApId,
          },
        })
      } catch (error) {
        console.log({ error })
        return setApOptionsError(
          `Fehler beim Abfragen der neuen Erfolgskriterien: ${error.message}`,
        )
      }
      const newErfkrits = newErfkritResult?.data?.allErfkrits?.nodes ?? []

      // 2.2: insert erfkrit
      try {
        await Promise.allSettled(
          newErfkrits.map(async (ekf) => {
            client.mutate({
              mutation: gql`
                mutation insertErfkritForErfkritFolder(
                  $apId: UUID!
                  $erfolg: Int
                  $kriterien: String
                ) {
                  createErfkrit(
                    input: {
                      erfkrit: {
                        apId: $apId
                        erfolg: $erfolg
                        kriterien: $kriterien
                      }
                    }
                  ) {
                    erfkrit {
                      __typename
                      id
                      apId
                      erfolg
                      kriterien
                      changedBy
                    }
                  }
                }
              `,
              variables: {
                anwendungsfall: ekf.anwendungsfall,
                apId: apId,
                erfolg: ekf.erfolg,
                kriterien: ekf.kriterien,
                changedBy: user.name,
              },
              refetchQueries: ['TreeAllQuery'],
              awaitRefetchQueries: true,
            })
          }),
        )
      } catch (error) {
        console.log({ error })
        return setApOptionsError(
          `Fehler beim Kopieren der Erfolgskriterien: ${error.message}`,
        )
      }

      // 3. inform user
      setOpenChooseAp(false)
      enqueNotification({
        message: `Die Erfolgskriterien wurden kopiert`,
        options: {
          variant: 'info',
        },
      })
    },
    [apId, client, enqueNotification, user.name],
  )

  const [apOptionsError, setApOptionsError] = useState(undefined)
  const apOptions = useCallback(
    async (inputValue, cb) => {
      if (apId === 0) return
      const filter = inputValue
        ? {
            label: { includesInsensitive: inputValue },
            id: { notEqualTo: apId },
          }
        : { label: { isNull: false }, id: { notEqualTo: apId } }
      let result
      try {
        result = await client.query({
          // would be elegant to query only ap with erfkrit
          // solution: https://github.com/graphile/pg-aggregates
          query: gql`
            query apForErfkritfolder($filter: ApFilter) {
              allAps(orderBy: [LABEL_ASC], filter: $filter) {
                nodes {
                  value: id
                  label
                  erfkritsByApId {
                    totalCount
                  }
                }
              }
            }
          `,
          variables: {
            filter: filter,
          },
        })
      } catch (error) {
        console.log({ error })
        setApOptionsError(
          `Fehler beim Abfragen der Aktionspläne: ${error.message}`,
        )
      }
      const options = result?.data?.allAps?.nodes ?? []
      // only show options with erfkrits
      const optionsWithErfkrits = options.filter(
        (e) => e.erfkritsByApId.totalCount > 0,
      )
      cb(optionsWithErfkrits)
    },
    [apId, client],
  )

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}erfkritFolder`}
        collect={(props) => props}
        onShow={onShow}
        hideOnLeave={true}
      >
        <div className="react-contextmenu-title">AP-Erfolgskriterien</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neues
            </MenuItem>
            <MenuItem onClick={onOpenChooseApDialog}>
              aus anderem Aktionsplan kopieren
            </MenuItem>
          </>
        )}
      </ContextMenu>
      <Dialog open={openChooseAp} onClose={onCloseChooseApDialog}>
        <DialogTitle>
          Erfolgskriterien aus anderem Aktionsplan kopieren
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Achtung: Allfällige bestehende Erfolgskriterien werden gelöscht und
            mit den kopierten ersetzt, sobald Sie einen Aktionsplän wählen
          </DialogContentText>
          <SelectContainer>
            <SelectLabel>
              Aktionsplan (nur solche mit Erfolgskriterien)
            </SelectLabel>
            <SelectStyled
              autoFocus
              defaultOptions
              name="ap"
              onChange={onChooseAp}
              value=""
              hideSelectedOptions
              placeholder=""
              isClearable
              isSearchable
              // remove as can't select without typing
              nocaret
              // don't show a no options message if a value exists
              noOptionsMessage={() => '(Bitte Tippen für Vorschläge)'}
              // enable deleting typed values
              backspaceRemovesValue
              classNamePrefix="react-select"
              loadOptions={apOptions}
              openMenuOnFocus
            />
            {apOptionsError && <Error>{apOptionsError}</Error>}
          </SelectContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseChooseApDialog}>abbrechen</Button>
        </DialogActions>
      </Dialog>
    </ErrorBoundary>
  )
}

export default observer(ErfkritFolder)
