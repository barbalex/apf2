import { useContext } from 'react'
import { sortBy, uniqBy } from 'es-toolkit'
import Button from '@mui/material/Button'
import { MdAddCircleOutline, MdDeleteForever } from 'react-icons/md'
import { observer } from 'mobx-react-lite'
import { useApolloClient, useQuery } from '@apollo/client/react'
import { useQueryClient } from '@tanstack/react-query'

import { Einheit } from './Einheit.jsx'
import { Gezaehlt } from './Gezaehlt.jsx'
import { Geschaetzt } from './Geschaetzt.jsx'
import { query } from './query.js'
import { createTpopkontrzaehl } from './createTpopkontrzaehl.js'
import { MobxContext } from '../../../../../../mobxContext.js'
import { Error } from '../../../../../shared/Error.jsx'
import { Spinner } from '../../../../../shared/Spinner.jsx'

import {
  deleteIcon,
  containerBase,
  containerEmpty,
  containerNew,
  containerElse,
  formBase,
  formShowDelete,
  formElse,
  einheitLabel,
  gezaehltLabel,
  gezaehltVal,
  geschaetztLabel,
  geschaetztVal,
  deleteClass,
  styledDeleteButton,
  styledAddIcon,
  showNew,
} from './index.module.css'

const getZaehleinheitWerte = ({
  data,
  einheitsUsed,
  ekzaehleinheits,
  ekzaehleinheitsOriginal,
  row,
}) => {
  const allEinheits = data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []
  // do list this count's einheit
  const einheitsNotToList = einheitsUsed.filter((e) => e !== row.einheit)
  let zaehleinheitWerte = ekzaehleinheits
    // remove already set values
    .filter((e) => !einheitsNotToList.includes(e.code))
  // add this zaehleineits value if missing
  // so as to show values input in earlier years that shall not be input any more
  const thisRowsEinheit = allEinheits.find((e) => e.code === row.einheit)
  if (thisRowsEinheit) {
    zaehleinheitWerte = uniqBy(
      [thisRowsEinheit, ...zaehleinheitWerte],
      (e) => e.id,
    )
  }
  return sortBy(zaehleinheitWerte, [
    (z) => {
      const ekzaehleinheitOriginal = ekzaehleinheitsOriginal.find(
        (e) => e.tpopkontrzaehlEinheitWerteByZaehleinheitId.code === z.code,
      )
      if (!ekzaehleinheitOriginal) return 999
      return ekzaehleinheitOriginal.sort || 999
    },
  ]).map((el) => ({
    value: el.code,
    label: el.text,
  }))
}

export const Count = observer(
  ({
    id,
    tpopkontrId,
    nr,
    showEmpty,
    showNew,
    refetch,
    einheitsUsed = [],
    ekzaehleinheits = [],
    ekzaehleinheitsOriginal = [],
  }) => {
    const store = useContext(MobxContext)
    const { setToDelete } = store
    const { activeNodeArray } = store.tree

    const apolloClient = useApolloClient()
    const tsQueryClient = useQueryClient()

    const {
      data,
      loading,
      error,
      refetch: refetchMe,
    } = useQuery(query, {
      variables: {
        id: id || '99999999-9999-9999-9999-999999999999',
      },
    })

    const row = data?.tpopkontrzaehlById ?? {}

    const createNew = () =>
      apolloClient
        .mutate({
          mutation: createTpopkontrzaehl,
          variables: { tpopkontrId },
        })
        .then(() => {
          refetch()
          tsQueryClient.invalidateQueries({
            queryKey: [`treeTpopfreiwkontrzaehl`],
          })
          tsQueryClient.invalidateQueries({
            queryKey: [`treeTpopfreiwkontrzaehlFolders`],
          })
        })

    const zaehleinheitWerte = getZaehleinheitWerte({
      data,
      einheitsUsed,
      ekzaehleinheits,
      ekzaehleinheitsOriginal,
      row,
    })

    const showDelete = nr > 1

    const remove = ({ row }) => {
      const afterDeletionHook = () => {
        refetch()
        tsQueryClient.invalidateQueries({
          queryKey: [`treeTpopfreiwkontrzaehl`],
        })
        tsQueryClient.invalidateQueries({
          queryKey: [`treeTpopfreiwkontrzaehlFolders`],
        })
      }
      setToDelete({
        table: 'tpopkontrzaehl',
        id: row.id,
        label: null,
        url: activeNodeArray,
        afterDeletionHook,
      })
    }

    const containerStyle = {
      gridArea: `count${nr}`,
    }
    const containerClass =
      showNew ? containerNew
      : showEmpty ? containerEmpty
      : containerElse

    const formStyle = {
      gridArea: `count${nr}`,
    }
    const formClass = showDelete ? formShowDelete : formElse

    if (showNew) {
      return (
        <div
          style={containerStyle}
          className={`${containerBase} ${containerClass}`}
        >
          <div className={einheitLabel}>{`Zähleinheit ${nr}`}</div>
          <div className={showNew}>
            <Button
              color="primary"
              onClick={createNew}
            >
              <MdAddCircleOutline className={styledAddIcon} /> Neu
            </Button>
          </div>
        </div>
      )
    }
    if (showEmpty) {
      return (
        <div
          style={containerStyle}
          className={`${containerBase} ${containerClass}`}
        >
          <div className={einheitLabel}>{`Zähleinheit ${nr}`}</div>
        </div>
      )
    }
    if (loading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <div
        data-id={`count${nr}`}
        style={formStyle}
        className={`${containerBase} ${formClass}`}
      >
        <Einheit
          row={row}
          refetch={refetch}
          zaehleinheitWerte={zaehleinheitWerte}
          nr={nr}
        />
        <div className={gezaehltLabel}>gezählt</div>
        <div className={geschaetztLabel}>geschätzt</div>
        <div className={gezaehltVal}>
          <Gezaehlt
            row={row}
            refetch={refetchMe}
          />
        </div>
        <div className={geschaetztVal}>
          <Geschaetzt
            row={row}
            refetch={refetchMe}
          />
        </div>
        {showDelete && (
          <div className={deleteClass}>
            <Button
              title="löschen"
              onClick={() => remove({ row })}
              color="inherit"
              className={styledDeleteButton}
            >
              <MdDeleteForever className={deleteIcon} />
            </Button>
          </div>
        )}
      </div>
    )
  },
)
