import { memo, useCallback, useContext, useState, useMemo } from 'react'
import { useApolloClient, useQuery, gql } from '@apollo/client'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { getSnapshot } from 'mobx-state-tree'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import { MenuBar } from '../../../shared/MenuBar/index.jsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { MenuTitle } from '../../../shared/Files/Menu/index.jsx'
import { tpopkontr as tpopkontrFragment } from '../../../shared/fragments.js'
import { queryEkfTpops } from './queryEkfTpops.js'

const StyledButton = styled(Button)`
  text-transform: none !important;
  margin-right: 10px !important;
  color: white !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  &:hover {
    background-color: rgba(28, 74, 30, 0.2) !important;
  }
`

const iconStyle = { color: 'white' }

export const Menu = memo(
  observer(
    ({
      row,
      editPassword,
      setEditPassword,
      passwordMessage,
      setPasswordMessage,
    }) => {
      const { search, pathname } = useLocation()
      const navigate = useNavigate()
      const client = useApolloClient()
      const queryClient = useQueryClient()
      const store = useContext(StoreContext)

      const thisYear = new Date().getFullYear()
      const { data, refetch } = useQuery(queryEkfTpops, {
        variables: {
          id: row.adresseId || '9999999999999999999999999',
          jahr: thisYear,
          include: !!row.adresseId,
        },
      })
      const ekfTpops = data?.ekfTpops?.nodes ?? []
      const hasEkfTpops = !!ekfTpops.length
      const ekfTpopsWithoutEkfThisYear = useMemo(
        () =>
          ekfTpops
            .filter((e) => e?.ekfInJahr?.totalCount === 0)
            .map((e) => e.id),
        [ekfTpops],
      )
      const hasEkfTpopsWithoutEkfThisYear = !!ekfTpopsWithoutEkfThisYear.length

      const onClickAdd = useCallback(async () => {
        let result
        try {
          result = await client.mutate({
            mutation: gql`
              mutation createUserForUserForm {
                createUser(input: { user: {} }) {
                  user {
                    id
                  }
                }
              }
            `,
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
          queryKey: [`treeUser`],
        })
        queryClient.invalidateQueries({
          queryKey: [`treeRoot`],
        })
        const id = result?.data?.createUser?.user?.id
        navigate(`/Daten/Benutzer/${id}${search}`)
      }, [client, store, queryClient, navigate, search])

      const [delMenuAnchorEl, setDelMenuAnchorEl] = useState(null)
      const delMenuOpen = Boolean(delMenuAnchorEl)

      const onClickDelete = useCallback(async () => {
        let result
        try {
          result = await client.mutate({
            mutation: gql`
              mutation deleteUser($id: UUID!) {
                deleteUserById(input: { id: $id }) {
                  user {
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
          queryKey: [`treeUser`],
        })
        queryClient.invalidateQueries({
          queryKey: [`treeRoot`],
        })
        // navigate to parent
        navigate(`/Daten/Benutzer${search}`)
      }, [client, store, queryClient, navigate, search, row, pathname])

      const onClickCreateEkfForms = useCallback(async () => {
        const errors = []
        for (const tpopId of ekfTpopsWithoutEkfThisYear) {
          try {
            await client.mutate({
              mutation: gql`
                mutation createTpopkontrFromUser(
                  $typ: String
                  $tpopId: UUID
                  $bearbeiter: UUID
                  $jahr: Int
                ) {
                  createTpopkontr(
                    input: {
                      tpopkontr: {
                        typ: $typ
                        tpopId: $tpopId
                        bearbeiter: $bearbeiter
                        jahr: $jahr
                      }
                    }
                  ) {
                    tpopkontr {
                      ...TpopkontrFields
                    }
                  }
                }
                ${tpopkontrFragment}
              `,
              variables: {
                tpopId,
                typ: 'Freiwilligen-Erfolgskontrolle',
                bearbeiter: row.adresseId,
                jahr: thisYear,
              },
            })
          } catch (error) {
            errors.push(error)
          }
        }
        if (errors.length) {
          errors.forEach((error) =>
            store.enqueNotification({
              message: error.message,
              options: {
                variant: 'error',
              },
            }),
          )
        } else {
          store.enqueNotification({
            message: `${ekfTpopsWithoutEkfThisYear.length} EKF-Formulare erzeugt`,
            options: {
              variant: 'info',
            },
          })
          refetch()
        }
      }, [
        client,
        ekfTpopsWithoutEkfThisYear,
        refetch,
        row.adresseId,
        store,
        thisYear,
      ])

      return (
        <ErrorBoundary>
          <MenuBar
            bgColor="#388e3c"
            color="white"
          >
            <Tooltip title="Neuen Benutzer erstellen">
              <IconButton onClick={onClickAdd}>
                <FaPlus style={iconStyle} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Löschen">
              <IconButton
                onClick={(event) => setDelMenuAnchorEl(event.currentTarget)}
                aria-owns={delMenuOpen ? 'userDelMenu' : undefined}
              >
                <FaMinus style={iconStyle} />
              </IconButton>
            </Tooltip>

            {!editPassword && !passwordMessage && (
              <StyledButton
                variant="outlined"
                onClick={() => {
                  setEditPassword(true)
                  setPasswordMessage('')
                }}
              >
                Passwort ändern
              </StyledButton>
            )}
            {hasEkfTpopsWithoutEkfThisYear && (
              <StyledButton
                variant="outlined"
                onClick={onClickCreateEkfForms}
                title={`Erzeugt in ${ekfTpops.length} Teil-Population${
                  ekfTpops.length > 1 ? 'en' : ''
                }, in de${
                  ekfTpops.length > 1 ? 'nen' : 'r'
                } dieser Benutzer als EKF-Kontrolleur erfasst ist, EKF-Formulare für das Jahr ${thisYear}`}
              >
                {`(Fehlende) EKF-Formulare für ${thisYear} erzeugen`}
              </StyledButton>
            )}
            {hasEkfTpops && (
              <StyledButton
                variant="outlined"
                component={Link}
                to={`/Daten/Benutzer/${row.id}/EKF/${thisYear}${search}`}
              >
                {`EKF-Formulare für ${thisYear} öffnen`}
              </StyledButton>
            )}
          </MenuBar>
          <MuiMenu
            id="userDelMenu"
            anchorEl={delMenuAnchorEl}
            open={delMenuOpen}
            onClose={() => setDelMenuAnchorEl(null)}
          >
            <MenuTitle>löschen?</MenuTitle>
            <MenuItem onClick={onClickDelete}>ja</MenuItem>
            <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
          </MuiMenu>
        </ErrorBoundary>
      )
    },
  ),
)
