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

// TODO:
// check if ekfrequenz exist
// if not:
// add MenuItem to copy all from AP

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

// would be elegant to query only ap with ekfrequenz
// one solution: https://github.com/graphile/pg-aggregates
const apValuesQuery = gql`
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
`

const EkfrequenzFolder = ({ onClick, treeName }) => {
  const client = useApolloClient()
  const { user } = useContext(storeContext)

  const [openChooseAp, setOpenChooseAp] = useState(false)
  const onCloseChooseApDialog = useCallback(() => setOpenChooseAp(false), [])
  const onOpenChooseApDialog = useCallback(() => setOpenChooseAp(true), [])
  const onChooseAp = useCallback((option) => {
    console.log('option choosen: ', option)
    // TODO:
    // 0. choosing no option is not possible so needs not be catched
    // 1. delete existing ekfrequenz
    // 2. add ekfrequenz from other ap
    // 3. if other ap has no ekfrequenz, tell user
    // 4. if ekfrequenz were added, tell user
    setOpenChooseAp(false)
  }, [])

  const apOptions = useCallback(
    async (inputValue, cb) => {
      console.log('apOptionsCallback, inputValue:', inputValue)
      const filter = inputValue
        ? { label: { includesInsensitive: inputValue } }
        : { label: { isNull: false } }
      let result
      try {
        result = await client.query({
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
      }
      const { data } = result
      const options = data?.allAps?.nodes ?? []
      // only show options with ekfrequenzs
      const optionsWithEkfrequenzs = options.filter(
        (e) => e.ekfrequenzsByApId.totalCount > 0,
      )
      cb(optionsWithEkfrequenzs)
    },
    [client],
  )

  return (
    <ErrorBoundary>
      <ContextMenu id={`${treeName}ekfrequenzFolder`}>
        <div className="react-contextmenu-title">EK-Frequenz</div>
        {!userIsReadOnly(user.token) && (
          <>
            <MenuItem onClick={onClick} data={insertData}>
              erstelle neue
            </MenuItem>
            <MenuItem onClick={onOpenChooseApDialog}>
              Aus anderem Aktionsplan kopieren
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
