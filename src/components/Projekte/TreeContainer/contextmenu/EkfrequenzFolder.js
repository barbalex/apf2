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
import { ContextMenu, MenuItem } from '../../../../modules/react-contextmenu'

// create objects outside render
const insertData = {
  action: 'insert',
  table: 'ekfrequenz',
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

const EkfrequenzFolder = ({ onClick, treeName }) => {
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
      // 1. delete existing ekfrequenz
      // 1.1: query existing ekfrequenz
      let existingEkfrequenzResult
      try {
        existingEkfrequenzResult = await client.query({
          query: gql`
            query getExistingEkfrequenzForEkfrequenzFolder($apId: UUID) {
              allEkfrequenzs(filter: { apId: { equalTo: $apId } }) {
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
          // because apollo seemed to use local cache which was not up to date any more
          fetchPolicy: 'network-only',
        })
      } catch (error) {
        console.log({ error })
        setApOptionsError(
          `Fehler beim Abfragen der Aktionspläne: ${error.message}`,
        )
      }
      const existingEkfrequenzs = (
        existingEkfrequenzResult?.data?.allEkfrequenzs?.nodes ?? []
      ).map((e) => e.id)

      // 1.2: delete existing ekfrequenz
      try {
        await Promise.allSettled(
          existingEkfrequenzs.map(
            async (id) =>
              await client.mutate({
                mutation: gql`
                  mutation deleteExistingEkfrequenzForEkfrequenzFolder(
                    $id: UUID!
                  ) {
                    deleteEkfrequenzById(input: { id: $id }) {
                      deletedEkfrequenzId
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
          `Fehler beim Löschen der existierenden EK-Frequenzen: ${error.message}`,
        )
      }

      // 2. add ekfrequenz from other ap
      // 2.1: query ekfrequenz
      let newEkfrequenzResult
      try {
        newEkfrequenzResult = await client.query({
          query: gql`
            query getNewEkfrequenzForEkfrequenzFolder($apId: UUID) {
              allEkfrequenzs(filter: { apId: { equalTo: $apId } }) {
                nodes {
                  id
                  anwendungsfall
                  apId
                  bemerkungen
                  code
                  ekAbrechnungstyp
                  ektyp
                  kontrolljahre
                  kontrolljahreAb
                  sort
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
          `Fehler beim Abfragen der neuen EK-Frequenzen: ${error.message}`,
        )
      }
      const newEkfrequenzs =
        newEkfrequenzResult?.data?.allEkfrequenzs?.nodes ?? []

      // 2.2: insert ekfrequenz
      try {
        await Promise.allSettled(
          newEkfrequenzs.map(async (ekf) => {
            client.mutate({
              mutation: gql`
                mutation insertEkfrequenzForEkfrequenzFolder(
                  $apId: UUID!
                  $anwendungsfall: String
                  $bemerkungen: String
                  $changedBy: String
                  $code: String
                  $ekAbrechnungstyp: String
                  $ektyp: EkType
                  $kontrolljahre: [Int]
                  $kontrolljahreAb: EkKontrolljahreAb
                  $sort: Int
                ) {
                  createEkfrequenz(
                    input: {
                      ekfrequenz: {
                        apId: $apId
                        anwendungsfall: $anwendungsfall
                        bemerkungen: $bemerkungen
                        changedBy: $changedBy
                        code: $code
                        ekAbrechnungstyp: $ekAbrechnungstyp
                        ektyp: $ektyp
                        kontrolljahre: $kontrolljahre
                        kontrolljahreAb: $kontrolljahreAb
                        sort: $sort
                      }
                    }
                  ) {
                    ekfrequenz {
                      __typename
                      id
                      anwendungsfall
                      apId
                      bemerkungen
                      code
                      ekAbrechnungstyp
                      ektyp
                      kontrolljahre
                      kontrolljahreAb
                      sort
                      changedBy
                    }
                  }
                }
              `,
              variables: {
                anwendungsfall: ekf.anwendungsfall,
                apId: apId,
                bemerkungen: ekf.bemerkungen,
                code: ekf.code,
                ekAbrechnungstyp: ekf.ekAbrechnungstyp,
                ektyp: ekf.ektyp,
                kontrolljahre: ekf.kontrolljahre,
                kontrolljahreAb: ekf.kontrolljahreAb,
                sort: ekf.sort,
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
          `Fehler beim Kopieren der EK-Frequenzen: ${error.message}`,
        )
      }

      // 3. inform user
      setOpenChooseAp(false)
      enqueNotification({
        message: `Die EK-Frequenzen wurden kopiert`,
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
          // would be elegant to query only ap with ekfrequenz
          // solution: https://github.com/graphile/pg-aggregates
          query: gql`
            query apForEkfrequenzfolder($filter: ApFilter) {
              allAps(orderBy: [LABEL_ASC], filter: $filter) {
                nodes {
                  value: id
                  label
                  ekfrequenzsByApId {
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
      // only show options with ekfrequenzs
      const optionsWithEkfrequenzs = options.filter(
        (e) => e.ekfrequenzsByApId.totalCount > 0,
      )
      cb(optionsWithEkfrequenzs)
    },
    [apId, client],
  )

  return (
    <ErrorBoundary>
      <ContextMenu
        id={`${treeName}ekfrequenzFolder`}
        collect={(props) => props}
        onShow={onShow}
      >
        <div className="react-contextmenu-title">EK-Frequenz</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neue
            </MenuItem>
            <MenuItem onClick={onOpenChooseApDialog}>
              aus anderem Aktionsplan kopieren
            </MenuItem>
          </>
        )}
      </ContextMenu>
      <Dialog open={openChooseAp} onClose={onCloseChooseApDialog}>
        <DialogTitle>
          EK-Frequenzen aus anderem Aktionsplan kopieren
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Achtung: Allfällige bestehende EK-Frequenzen werden gelöscht und mit
            den kopierten ersetzt, sobald Sie einen Aktionsplän wählen
          </DialogContentText>
          <SelectContainer>
            <SelectLabel>
              Aktionsplan (nur solche mit EK-Frequenzen)
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

export default observer(EkfrequenzFolder)
