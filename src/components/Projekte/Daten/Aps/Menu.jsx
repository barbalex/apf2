import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { RiFolderCloseFill } from 'react-icons/ri'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useAtom } from 'jotai'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { moveTo } from '../../../../modules/moveTo/index.js'
import { copyTo } from '../../../../modules/copyTo/index.js'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.js'
import { ApFilter } from '../../TreeContainer/ApFilter/index.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { showTreeMenusAtom } from '../../../../JotaiStore/index.js'

import styles from './Menu.module.css'

const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }) => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apId } = useParams()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const { setMoving, moving, copying, setCopying } = store
  const [showTreeMenus] = useAtom(showTreeMenusAtom)

  const onClickAdd = async () => {
    let result
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createApForApsForm($projId: UUID!) {
            createAp(input: { ap: { projId: $projId } }) {
              ap {
                id
                projId
              }
            }
          }
        `,
        variables: { projId },
      })
    } catch (error) {
      return store.enqueNotification({
        message: error.message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeAp`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createAp?.ap?.id
    navigate(`/Daten/Projekte/${projId}/Arten/${id}${search}`)
  }

  const onClickMoveHere = () =>
    moveTo({
      id: apId,
      store,
      apolloClient,
    })

  const onClickStopMoving = () =>
    setMoving({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      toTable: null,
      fromParentId: null,
    })

  const onClickCopyTo = () =>
    copyTo({
      parentId: apId,
      apolloClient,
      store,
    })

  const onClickCloseLowerNodes = () =>
    closeLowerNodes({
      url: ['Projekte', projId, 'Arten', apId],
      store,
      search,
    })

  const onClickStopCopying = () =>
    setCopying({
      table: null,
      id: '99999999-9999-9999-9999-999999999999',
      label: null,
      withNextLevel: false,
    })

  const isMoving = !!moving.table
  const isCopying = !!copying.table

  return (
    <ErrorBoundary>
      <MenuBar rerenderer={`${moving.id}/${copying.id}`}>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neue Art erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
        {showTreeMenus && (
          <Tooltip title="Ordner im Navigationsbaum schliessen">
            <IconButton onClick={onClickCloseLowerNodes}>
              <RiFolderCloseFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isMoving &&
          moving.toTable === 'ap' &&
          moving.fromParentId !== apId && (
            <Tooltip title={`Verschiebe ${moving.label} zu dieser Art`}>
              <IconButton onClick={onClickMoveHere}>
                <MdOutlineMoveDown style={iconStyle} />
              </IconButton>
            </Tooltip>
          )}
        {isMoving && (
          <Tooltip title={`Verschieben von '${moving.label}' abbrechen`}>
            <IconButton onClick={onClickStopMoving}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopying && (
          <Tooltip title={`Kopiere '${copying.label}' in diese Art`}>
            <IconButton onClick={onClickCopyTo}>
              <MdContentCopy style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        {isCopying && (
          <Tooltip title={`Kopieren von '${copying.label}' abbrechen`}>
            <IconButton onClick={onClickStopCopying}>
              <BsSignStopFill style={iconStyle} />
            </IconButton>
          </Tooltip>
        )}
        <div className={styles.fitter}>
          <ApFilter color="white" />
        </div>
      </MenuBar>
    </ErrorBoundary>
  )
})
