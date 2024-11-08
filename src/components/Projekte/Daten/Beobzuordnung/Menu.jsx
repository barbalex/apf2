import { memo, useCallback, useContext, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
// import { FaPlus, FaMinus } from 'react-icons/fa6'
// import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { showCoordOfBeobOnMapsZhCh } from '../../../../modules/showCoordOfBeobOnMapsZhCh.js'
import { showCoordOfBeobOnMapGeoAdminCh } from '../../../../modules/showCoordOfBeobOnMapGeoAdminCh.js'
import { copyBeobZugeordnetKoordToTpop } from '../../../../modules/copyBeobZugeordnetKoordToTpop/index.js'

const StyledButton = styled(Button)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
`
const StyledLoadingButton = styled(LoadingButton)`
  margin: 0 5px;
  padding: 3px 10px;
  text-transform: none;
  line-height: 1.1;
  font-size: 0.8rem;
`

export const Menu = memo(
  observer(({ row }) => {
    const { search, pathname } = useLocation()
    const navigate = useNavigate()
    const client = useApolloClient()
    const queryClient = useQueryClient()
    const { projId, apId, beobId } = useParams()
    const store = useContext(StoreContext)

    const onClickAdd = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation createEkzaehleinheitForEkzaehleinheitForm($apId: UUID!) {
              createEkzaehleinheit(input: { ekzaehleinheit: { apId: $apId } }) {
                ekzaehleinheit {
                  id
                  apId
                }
              }
            }
          `,
          variables: { apId },
        })
      } catch (error) {
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }
      queryClient.invalidateQueries({
        queryKey: [`treeEkzaehleinheit`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      const id = result?.data?.createEkzaehleinheit?.ekzaehleinheit?.id
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten/${id}${search}`,
      )
    }, [apId, client, store, queryClient, navigate, search, projId])

    const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
    const delMenuOpen = Boolean(delMenuAnchorEl)

    const onClickDelete = useCallback(async () => {
      let result
      try {
        result = await client.mutate({
          mutation: gql`
            mutation deleteEkzaehleinheit($id: UUID!) {
              deleteEkzaehleinheitById(input: { id: $id }) {
                ekzaehleinheit {
                  id
                }
              }
            }
          `,
          variables: { id: row.id },
        })
      } catch (error) {
        return store.enqueNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        })
      }

      // remove active path from openNodes
      const openNodesRaw = store?.tree?.openNodes
      const openNodes = getSnapshot(openNodesRaw)
      const activePath = pathname.split('/').filter((p) => !!p)
      const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
      store.tree.setOpenNodes(newOpenNodes)

      // update tree query
      queryClient.invalidateQueries({
        queryKey: [`treeEkzaehleinheit`],
      })
      queryClient.invalidateQueries({
        queryKey: [`treeApFolders`],
      })
      // navigate to parent
      navigate(
        `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten${search}`,
      )
    }, [
      client,
      store,
      queryClient,
      navigate,
      search,
      apId,
      projId,
      row,
      pathname,
    ])

    const [
      copyingBeobZugeordnetKoordToTpop,
      setCopyingBeobZugeordnetKoordToTpop,
    ] = useState(false)
    const onClickCopyingBeobZugeordnetKoordToTpop = useCallback(async () => {
      setCopyingBeobZugeordnetKoordToTpop(true)
      await copyBeobZugeordnetKoordToTpop({
        id: beobId,
        client,
        enqueNotification: store.enqueNotification,
      })
      setCopyingBeobZugeordnetKoordToTpop(false)
    })

    return (
      <ErrorBoundary>
        <MenuBar
          widths={[192, 102, 142]}
          rerenderer={copyingBeobZugeordnetKoordToTpop}
        >
          <StyledLoadingButton
            variant="outlined"
            style={{ width: 180 }}
            onClick={onClickCopyingBeobZugeordnetKoordToTpop}
            loading={copyingBeobZugeordnetKoordToTpop}
          >
            Koordinaten auf die Teilpopulation übertragen
          </StyledLoadingButton>
          <StyledButton
            variant="outlined"
            style={{ width: 90 }}
            onClick={() =>
              showCoordOfBeobOnMapsZhCh({
                id: beobId,
                client,
                enqueNotification: store.enqueNotification,
              })
            }
          >
            zeige auf maps.zh.ch
          </StyledButton>
          <StyledButton
            variant="outlined"
            style={{ width: 130 }}
            onClick={() =>
              showCoordOfBeobOnMapGeoAdminCh({
                id: beobId,
                client,
                enqueNotification: store.enqueNotification,
              })
            }
          >
            zeige auf map.geo.admin.ch
          </StyledButton>
        </MenuBar>
      </ErrorBoundary>
    )
  }),
)
