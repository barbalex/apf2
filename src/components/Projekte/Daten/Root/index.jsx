import { memo, useMemo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { useRootNavData } from '../../../../modules/useRootNavData.js'

export const Component = memo(
  observer(() => {
    const store = useContext(StoreContext)
    // calling filter even though not used here so useRootNavData re-runs when the filter changes
    const { userGqlFilterForTree } = store.tree
    const { data, isLoading, error } = useRootNavData({ userGqlFilterForTree })
    const totalCount = 5
    const usersCount = data?.data?.allUsers?.totalCount ?? 0
    const usersFilteredCount = data?.data?.filteredUsers?.totalCount ?? 0
    const messagesCount = data?.data?.allMessages?.totalCount ?? 0
    const currentIssuesCount = data?.data?.allCurrentissues?.totalCount ?? 0

    const navs = useMemo(
      () => [
        {
          url: 'Projekte',
          label: `Projekte`,
        },
        {
          url: 'Benutzer',
          label: `Benutzer (${usersFilteredCount}/${usersCount})`,
        },
        {
          url: 'Werte-Listen',
          label: `Werte-Listen (4)`,
        },
        {
          url: 'Mitteilungen',
          label: `Mitteilungen (${messagesCount})`,
        },
        {
          url: 'Aktuelle-Fehler',
          label: `Aktuelle Fehler (${currentIssuesCount})`,
        },
      ],
      [usersCount, messagesCount, currentIssuesCount],
    )

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={navs}
        title="AP Flora"
        totalCount={totalCount}
      />
    )
  }),
)
