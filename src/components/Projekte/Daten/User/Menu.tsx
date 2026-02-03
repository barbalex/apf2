import { useState } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate, useLocation, Link } from 'react-router'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { isEqual } from 'es-toolkit'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { tpopkontr as tpopkontrFragment } from '../../../shared/fragments.ts'
import { queryEkfTpops } from './queryEkfTpops.ts'

import type { UserId } from '../../../../models/apflora/UserId.ts'
import type { AdresseId } from '../../../../models/apflora/AdresseId.ts'
import type { TpopId } from '../../../../models/apflora/TpopId.ts'
import type { TpopkontrId } from '../../../../models/apflora/TpopkontrId.ts'

interface CreateUserResult {
  data: {
    createUser: {
      user: {
        id: UserId
      }
    }
  }
}

interface EkfTpopsQueryResult {
  ekfTpops: {
    totalCount: number
    nodes: Array<{
      id: TpopId
      ekfInJahr: {
        totalCount: number
      }
    }>
  } | null
}

interface CreateTpopkontrResult {
  data: {
    createTpopkontr: {
      tpopkontr: {
        id: TpopkontrId
      }
    }
  }
}

interface MenuProps {
  row: {
    id: UserId
    adresseId: AdresseId | null
    [key: string]: any
  }
}

import styles from './Menu.module.css'
import filesMenuStyles from '../../../shared/Files/Menu/index.module.css'

import {
  addNotificationAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

const iconStyle = { color: 'white' }

export const Menu = ({ row }: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

  const apolloClient = useApolloClient()
  const tsQueryClient = useQueryClient()

  const thisYear = new Date().getFullYear()
  const { data } = useQuery({
    queryKey: ['ekfTpops', row.adresseId, thisYear],
    queryFn: async () => {
      const result = await apolloClient.query<EkfTpopsQueryResult>({
        query: queryEkfTpops,
        variables: {
          id: row.adresseId,
          jahr: thisYear,
          include: !!row.adresseId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    enabled: !!row.adresseId,
    staleTime: Infinity,
    gcTime: Infinity,
  })
  const ekfTpops = data?.ekfTpops?.nodes ?? []
  const hasEkfTpops = !!ekfTpops.length
  const ekfTpopsWithoutEkfThisYear = ekfTpops
    .filter((e) => e?.ekfInJahr?.totalCount === 0)
    .map((e) => e.id)
  const hasEkfTpopsWithoutEkfThisYear = !!ekfTpopsWithoutEkfThisYear.length

  const onClickAdd = async () => {
    let result: CreateUserResult | undefined
    try {
      result = await apolloClient.mutate<CreateUserResult['data']>({
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
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    tsQueryClient.invalidateQueries({
      queryKey: [`treeUser`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createUser?.user?.id
    navigate(`/Daten/Benutzer/${id}${search}`)
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = async () => {
    let result
    try {
      result = await apolloClient.mutate({
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
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }

    // remove active path from openNodes
    const activePath = pathname.split('/').filter((p) => !!p)
    const newOpenNodes = openNodes.filter((n) => !isEqual(n, activePath))
    setOpenNodes(newOpenNodes)

    // update tree query
    tsQueryClient.invalidateQueries({
      queryKey: [`treeUser`],
    })
    tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    // navigate to parent
    navigate(`/Daten/Benutzer${search}`)
  }

  const onClickCreateEkfForms = async () => {
    const errors = []
    for (const tpopId of ekfTpopsWithoutEkfThisYear) {
      try {
        await apolloClient.mutate({
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
        addNotification({
          message: error.message,
          options: {
            variant: 'error',
          },
        }),
      )
    } else {
      addNotification({
        message: `${ekfTpopsWithoutEkfThisYear.length} EKF-Formulare erzeugt`,
        options: {
          variant: 'info',
        },
      })
      tsQueryClient.invalidateQueries({
        queryKey: ['ekfTpops', row.adresseId, thisYear],
      })
    }
  }

  return (
    <ErrorBoundary>
      <MenuBar>
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

        {hasEkfTpopsWithoutEkfThisYear && (
          <Button
            variant="outlined"
            onClick={onClickCreateEkfForms}
            title={`Erzeugt in ${ekfTpops.length} Teil-Population${
              ekfTpops.length > 1 ? 'en' : ''
            }, in de${
              ekfTpops.length > 1 ? 'nen' : 'r'
            } dieser Benutzer als EKF-Kontrolleur erfasst ist, EKF-Formulare für das Jahr ${thisYear}`}
            className={styles.button}
          >
            {`(Fehlende) EKF-Formulare für ${thisYear} erzeugen`}
          </Button>
        )}
        {hasEkfTpops && (
          <Button
            variant="outlined"
            component={Link}
            to={`/Daten/Benutzer/${row.id}/EKF/${thisYear}${search}`}
            className={styles.button}
          >
            {`EKF-Formulare für ${thisYear} öffnen`}
          </Button>
        )}
      </MenuBar>
      <MuiMenu
        id="userDelMenu"
        anchorEl={delMenuAnchorEl}
        open={delMenuOpen}
        onClose={() => setDelMenuAnchorEl(null)}
      >
        <h3 className={filesMenuStyles.menuTitle}>löschen?</h3>
        <MenuItem onClick={onClickDelete}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
