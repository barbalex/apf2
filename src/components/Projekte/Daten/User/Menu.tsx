import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { gql as dynamicGql } from '../../../../apolloGql.ts'
import { graphql } from '../../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation, Link } from 'react-router'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import IconButton from '@mui/material/IconButton'
import MuiMenu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'

import { MenuBar } from '../../../shared/MenuBar/index.tsx'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { deleteModule } from '../../TreeContainer/DeleteDatasetModal/delete/index.ts'
import { tpopkontr as tpopkontrFragment } from '../../../shared/fragments.ts'
import { queryEkfTpops } from './queryEkfTpops.ts'

import type { UserId } from '../../../../models/apflora/User.ts'
import type { AdresseId } from '../../../../models/apflora/Adresse.ts'
import type { TpopId } from '../../../../models/apflora/Tpop.ts'

interface CreateUserResult {
  createUser: {
    user: {
      id: UserId
    }
  }
}

interface EkfTpopsQueryResult {
  ekfTpops: {
    totalCount: number
    nodes: {
      id: TpopId
      ekfInJahr: {
        totalCount: number
      }
    }[]
  } | null
}

interface MenuProps {
  row: {
    id: UserId
    adresseId: AdresseId | null
  }
  editPassword: boolean
  setEditPassword: (value: boolean) => void
  passwordMessage: string
  setPasswordMessage: (value: string) => void
}

import styles from './Menu.module.css'
import filesMenuStyles from '../../../shared/Files/Menu/index.module.css'

import { addNotificationAtom } from '../../../../store/index.ts'

const iconStyle = { color: 'white' }

export const Menu = ({
  row,
  editPassword,
  setEditPassword,
  passwordMessage,
  setPasswordMessage,
}: MenuProps) => {
  const addNotification = useSetAtom(addNotificationAtom)
  const { search, pathname } = useLocation()
  const navigate = useNavigate()

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
    let result: { data?: CreateUserResult | null | undefined } | undefined
    try {
      result = await apolloClient.mutate<CreateUserResult>({
        mutation: graphql(`
          mutation createUserForUserForm {
            createUser(input: { user: {} }) {
              user {
                id
              }
            }
          }
        `),
      })
    } catch (error) {
      return addNotification({
        message: (error as Error).message,
        options: {
          variant: 'error',
        },
      })
    }
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeUser`],
    })
    void tsQueryClient.invalidateQueries({
      queryKey: [`treeRoot`],
    })
    const id = result?.data?.createUser?.user?.id
    void navigate(`/Daten/Benutzer/${id}${search}`)
  }

  const [delMenuAnchorEl, setDelMenuAnchorEl] = useState<HTMLElement | null>(
    null,
  )
  const delMenuOpen = Boolean(delMenuAnchorEl)

  const onClickDelete = () =>
    void deleteModule({
      search,
      toDelete: {
        table: 'user',
        id: row.id,
        label: null,
        url: pathname.split('/').filter((p) => !!p),
        afterDeletionHook: () => {
          void navigate(`/Daten/Benutzer${search}`)
        },
      },
    })

  const onClickCreateEkfForms = async () => {
    const errors: Error[] = []
    for (const tpopId of ekfTpopsWithoutEkfThisYear) {
      try {
        await apolloClient.mutate({
          mutation: dynamicGql`
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
            typ: 'Freiwilligen-Kontrolle',
            bearbeiter: row.adresseId,
            jahr: thisYear,
          },
        })
      } catch (error) {
        errors.push(error as Error)
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
      void tsQueryClient.invalidateQueries({
        queryKey: ['ekfTpops', row.adresseId, thisYear],
      })
    }
  }

  return (
    <ErrorBoundary>
      <MenuBar>
        <Tooltip title="Neuen Benutzer erstellen">
          <IconButton onClick={() => void onClickAdd()}>
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
          <Button
            variant="outlined"
            onClick={() => {
              setEditPassword(true)
              setPasswordMessage('')
            }}
            className={styles.button}
          >
            Passwort ändern
          </Button>
        )}
        {hasEkfTpopsWithoutEkfThisYear && (
          <Button
            variant="outlined"
            onClick={() => void onClickCreateEkfForms()}
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
        <MenuItem onClick={() => void onClickDelete()}>ja</MenuItem>
        <MenuItem onClick={() => setDelMenuAnchorEl(null)}>nein</MenuItem>
      </MuiMenu>
    </ErrorBoundary>
  )
}
