import { memo, useContext, useCallback, useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { useApolloClient } from '@apollo/client/react'
import { observer } from 'mobx-react-lite'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker'

import { StyledCellForSelect } from '../index.jsx'
import { MobxContext } from '../../../../mobxContext.js'

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

export const CellForEkfrequenz = memo(
  observer(({ row, isOdd, field, width, setProcessing, data }) => {
    const client = useApolloClient()
    const store = useContext(MobxContext)
    const { enqueNotification } = store
    const { hovered, apValues } = store.ekPlan
    const className = hovered.tpopId === row.id ? 'tpop-hovered' : ''

    const processChangeWorker = useWorker(processChangeWorkerFactory)

    const allEkfrequenzs = data?.allEkfrequenzs?.nodes ?? []

    const maxCodeLength = useMemo(
      () => Math.max(...allEkfrequenzs.map((a) => (a.code || '').length)),
      [allEkfrequenzs],
    )

    const onMouseEnter = useCallback(
      () => hovered.setTpopId(row.id),
      [hovered, row.id],
    )
    const onChange = useCallback(
      async (e) => {
        const value = e.target.value || null
        console.log('CellForEkfrequenz, onChange, value:', value)
        setProcessing(true)
        await processChangeWorker.processChange({
          client,
          value,
          row,
          enqueNotification,
          store,
        })
        setProcessing(false)
        setTimeout(() => {
          // TODO: needed?
          // rowContainerRef.current.focus()
        }, 300)
      },
      [row, client, store, enqueNotification],
    )
    const valueToShow = useMemo(
      () => allEkfrequenzs?.find((e) => e.id === field.value)?.code,
      [allEkfrequenzs, field.value],
    )

    const [open, setOpen] = useState(false)
    const onOpen = useCallback(() => setOpen(true), [])
    const onClose = useCallback(() => setOpen(false), [])

    return (
      <>
        <StyledCellForSelect
          width={width}
          onMouseEnter={onMouseEnter}
          onMouseLeave={hovered.reset}
          onClick={onOpen}
          className={className}
          data-isodd={isOdd}
        >
          {valueToShow}
        </StyledCellForSelect>
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
  }),
)
