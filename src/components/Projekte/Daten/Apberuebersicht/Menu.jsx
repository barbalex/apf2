import { memo, useCallback, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'

export const Menu = memo(
  observer(({ row }) => {
    const { search } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const queryClient = useQueryClient()
    const { projId } = useParams()
    const store = useContext(StoreContext)

    // TODO: implement
    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createApberuebersichtForApberuebersichtForm(
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
          // refetchQueries: ['?'],
        })
      } catch (error) {
        return store.addNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      queryClient.invalidateQueries({
        queryKey: [`treeApberuebersicht`],
      })
      const id = result?.data?.createApberuebersicht?.apberuebersicht?.id
      navigate(`/Daten/Projekte/${projId}/AP-Berichte/${id}${search}`)
    }, [projId, client])

    return (
      <ErrorBoundary>
        <MenuBar>
          <IconButton
            title="Neuen AP-Bericht erstellen"
            onClick={onClickAdd}
          >
            <FaPlus />
          </IconButton>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
