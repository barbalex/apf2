import { useContext, useState } from 'react'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import { MobxContext } from '../../../../mobxContext.js'

import { cellForSelect } from '../index.module.css'

const processChangeWorkerFactory = createWorkerFactory(
  () => import('./processChange.js'),
)

const StyledDialogTitle = styled(DialogTitle)`
  font-size: 1rem;
  font-weight: 700;
  padding: 10px 16px 5px 16px;
`
const StyledListItem = styled(ListItem)`
  font-size: 0.85rem;
  user-select: none;
  ${(props) =>
    props.active === 'true' && 'background-color: rgba(0, 0, 0, 0.04);'}
`
const CodeText = styled.span`
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85rem;
  min-width: ${(props) => props.width * 0.65}rem;
`
const AnwendungsfallText = styled.span`
  font-size: 0.85rem;
`

export const CellForEkfrequenz = observer(
  ({ row, isOdd, field, width, setProcessing, data }) => {
    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const { hovered, apValues } = store.ekPlan

    const processChangeWorker = useWorker(processChangeWorkerFactory)

    const allEkfrequenzs = data?.allEkfrequenzs?.nodes ?? []

    const maxCodeLength = Math.max(
      ...allEkfrequenzs.map((a) => (a.code || '').length),
    )

    const onMouseEnter = () => hovered.setTpopId(row.id)

    const onChange = async (e) => {
      const value = e.target.value || null
      setProcessing(true)
      await processChangeWorker.processChange({
        apolloClient,
        value,
        row,
        enqueNotification,
        store,
        tsQueryClient,
      })
      setProcessing(false)
    }

    const valueToShow = allEkfrequenzs?.find((e) => e.id === field.value)?.code

    const [open, setOpen] = useState(false)
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)

    const isHovered = hovered.tpopId === row.id
    const cellStyle = {
      maxWidth: width,
      minWidth: width,
      backgroundColor:
        isHovered ? 'hsla(45, 100%, 90%, 1)'
        : isOdd ? 'rgb(255, 255, 252)'
        : 'unset',
    }

    return (
      <>
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={hovered.reset}
          onClick={onOpen}
          className={cellForSelect}
          style={cellStyle}
        >
          {valueToShow}
        </div>
        <Dialog
          onClose={onClose}
          open={open}
        >
          <StyledDialogTitle>EK-Frequenz wählen:</StyledDialogTitle>
          <List sx={{ pt: 0 }}>
            <StyledListItem
              onClick={() => {
                onChange({ target: { value: '' } })
                onClose()
              }}
              button={true.toString()}
              dense
              active={(data?.tpopById?.ekfrequenz === null).toString()}
            >
              Kein Wert
            </StyledListItem>
            {allEkfrequenzs.map((e) => (
              <StyledListItem
                key={e.id}
                onClick={() => {
                  onChange({ target: { value: e.id } })
                  onClose()
                }}
                button={true.toString()}
                dense
                active={(e.id === data?.tpopById?.ekfrequenz).toString()}
              >
                <CodeText width={maxCodeLength}>{e.code}</CodeText>
                <AnwendungsfallText>{e.anwendungsfall}</AnwendungsfallText>
              </StyledListItem>
            ))}
          </List>
        </Dialog>
      </>
    )
  },
)
