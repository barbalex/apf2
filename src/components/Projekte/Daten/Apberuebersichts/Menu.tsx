import { useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router'
import { FaPlus } from 'react-icons/fa6'
import { MdOutlineMoveDown, MdContentCopy } from 'react-icons/md'
import { RiFolderCloseFill } from 'react-icons/ri'
import { BsSignStopFill } from 'react-icons/bs'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { observer } from 'mobx-react-lite'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { FilterButton } from '../../../shared/MenuBar/FilterButton.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { moveTo } from '../../../../modules/moveTo/index.ts'
import { copyTo } from '../../../../modules/copyTo/index.ts'
import { closeLowerNodes } from '../../TreeContainer/closeLowerNodes.ts'
import { MobxContext } from '../../../../mobxContext.js'

import type { ApberuebersichtId } from '../../../../models/apflora/Apberuebersicht.js'
import type { ProjId } from '../../../../models/apflora/Proj.js'

interface CreateApberuebersichtResult {
  data?: {
    createApberuebersicht?: {
      apberuebersicht?: {
        id: ApberuebersichtId
        projId: ProjId
      }
    }
  }
}

interface MenuProps {
  toggleFilterInput?: () => void
}

const iconStyle = { color: 'white' }

export const Menu = observer(({ toggleFilterInput }: MenuProps) => {
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const { projId, apberuebersichtId } = useParams<{
    projId: string
    apberuebersichtId: string
  }>()

  const store = useContext(MobxContext)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const onClickAdd = async () => {
    let result: CreateApberuebersichtResult | undefined
    try {
      result = await apolloClient.mutate({
        mutation: gql`
          mutation createApberuebersichtForApberuebersichtsForm(
            $projId: UUID!
          ) {
            createApberuebersicht(
              input: { apberuebersicht: { projId: $projId } }
            ) {
              apberuebersicht {
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
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeApberuebersicht`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createApberuebersicht?.apberuebersicht?.id
    navigate(`./${id}${search}`)
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        {!!toggleFilterInput && (
          <FilterButton toggleFilterInput={toggleFilterInput} />
        )}
        <Tooltip title="Neuen AP-Bericht erstellen">
          <IconButton onClick={onClickAdd}>
            <FaPlus style={iconStyle} />
          </IconButton>
        </Tooltip>
      </MenuBar>
    </ErrorBoundary>
  )
})
