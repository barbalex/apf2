import { memo, useContext, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import AsyncSelect from 'react-select/async'
import styled from '@emotion/styled'
import { gql, useApolloClient } from '@apollo/client'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import { userIsReadOnly } from '../../modules/userIsReadOnly.js'
import { MobxContext } from '../../mobxContext.js'
import { ErrorBoundary } from '../shared/ErrorBoundary.jsx'

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

// const textEncoder = new TextEncoder()

export const ChooseApToCopyEkfrequenzsFrom = memo(
  observer(() => {
    const { apId } = useParams()
    const apolloClient = useApolloClient()
    const tanstackClient = useQueryClient()
    const store = useContext(MobxContext)
    const {
      user,
      enqueNotification,
      openChooseApToCopyEkfrequenzsFrom,
      setOpenChooseApToCopyEkfrequenzsFrom,
    } = store

    const onCloseChooseApDialog = useCallback(
      () => setOpenChooseApToCopyEkfrequenzsFrom(false),
      [setOpenChooseApToCopyEkfrequenzsFrom],
    )

    const onChooseAp = useCallback(
      async (option) => {
        const newApId = option.value
        // 0. choosing no option is not possible so needs not be catched
        // 1. delete existing ekfrequenz
        // 1.1: query existing ekfrequenz
        let existingEkfrequenzResult
        try {
          existingEkfrequenzResult = await apolloClient.query({
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
            // when copying repeatedly
            // apollo seemed to use local cache which was not up to date any more
            // so probably not the newly inserted were queried but the earlier deleted ones
            // which created conflicts with uniqueness
            fetchPolicy: 'network-only',
          })
        } catch (error) {
          console.log({ error })
          setApOptionsError(`Fehler beim Abfragen der Arten: ${error.message}`)
        }
        const existingEkfrequenzs = (
          existingEkfrequenzResult?.data?.allEkfrequenzs?.nodes ?? []
        ).map((e) => e.id)

        // 1.2: delete existing ekfrequenz
        try {
          await Promise.allSettled(
            existingEkfrequenzs.map(
              async (id) =>
                await apolloClient.mutate({
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
          newEkfrequenzResult = await apolloClient.query({
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
        let res
        try {
          res = await Promise.allSettled(
            newEkfrequenzs.map(async (ekf) =>
              apolloClient.mutate({
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
                          code: $code
                          ekAbrechnungstyp: $ekAbrechnungstyp
                          ektyp: $ektyp
                          kontrolljahre: $kontrolljahre
                          kontrolljahreAb: $kontrolljahreAb
                          sort: $sort
                          changedBy: $changedBy
                        }
                      }
                    ) {
                      ekfrequenz {
                        id
                        apId
                        anwendungsfall
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
                // somehow in dev i got errors claiming the strings were not utf-8
                // invalid byte sequence for encoding "UTF8"
                variables: {
                  apId: apId,
                  anwendungsfall: ekf.anwendungsfall ?? null,
                  bemerkungen: ekf.bemerkungen ?? null,
                  code: ekf.code ?? null,
                  ekAbrechnungstyp: ekf.ekAbrechnungstyp ?? null,
                  ektyp: ekf.ektyp ?? null,
                  kontrolljahre: ekf.kontrolljahre ?? null,
                  kontrolljahreAb: ekf.kontrolljahreAb ?? null,
                  sort: ekf.sort ?? null,
                  changedBy: user.name,
                },
              }),
            ),
          )
        } catch (error) {
          console.log('Error adding copied EK-Frequenzen:', error)
          return setApOptionsError(
            `Fehler beim Kopieren der EK-Frequenzen: ${error.message}`,
          )
        }
        // console.log('ChooseApToCopyEkfrequenzsFrom, res:', res)

        // 3. inform user
        setOpenChooseApToCopyEkfrequenzsFrom(false)
        enqueNotification({
          message: `Die EK-Frequenzen wurden kopiert`,
          options: {
            variant: 'info',
          },
        })
        tanstackClient.invalidateQueries({ queryKey: [`treeEkfrequenz`] })
        tanstackClient.invalidateQueries({ queryKey: [`treeApFolders`] })
        tanstackClient.invalidateQueries({
          queryKey: [`treeAp`],
        })
      },
      [
        apId,
        apolloClient,
        enqueNotification,
        user.name,
        setOpenChooseApToCopyEkfrequenzsFrom,
      ],
    )

    const [apOptionsError, setApOptionsError] = useState(undefined)
    const apOptions = useCallback(
      async (inputValue, cb) => {
        if (apId === 0) return
        const filter =
          inputValue ?
            {
              label: { includesInsensitive: inputValue },
              id: { notEqualTo: apId },
            }
          : { label: { isNull: false }, id: { notEqualTo: apId } }
        let result
        try {
          result = await apolloClient.query({
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
          setApOptionsError(`Fehler beim Abfragen der Arten: ${error.message}`)
        }
        const options = result?.data?.allAps?.nodes ?? []
        // only show options with ekfrequenzs
        const optionsWithEkfrequenzs = options.filter(
          (e) => e.ekfrequenzsByApId.totalCount > 0,
        )
        cb(optionsWithEkfrequenzs)
      },
      [apId, apolloClient],
    )

    return (
      <ErrorBoundary>
        <Dialog
          open={openChooseApToCopyEkfrequenzsFrom}
          onClose={onCloseChooseApDialog}
        >
          <DialogTitle>EK-Frequenzen aus anderer Art kopieren</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Achtung: Allfällige bestehende EK-Frequenzen werden gelöscht und
              mit den kopierten ersetzt, sobald Sie eine Art wählen
            </DialogContentText>
            <SelectContainer>
              <SelectLabel>Art (nur solche mit EK-Frequenzen)</SelectLabel>
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
  }),
)
