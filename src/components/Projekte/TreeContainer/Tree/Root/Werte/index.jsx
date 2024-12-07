import { memo, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../Row.jsx'
import { StoreContext } from '../../../../../../storeContext.js'
import { AdresseFolder } from './Adresse/index.jsx'
import { ApberrelevantGrundFolder } from './ApberrelevantGrund/index.jsx'
import { EkAbrechnungstypFolder } from './EkAbrechnungstyp/index.jsx'
import { ZaehlEinheitFolder } from './ZaehlEinheit/index.jsx'
import { useWertesNavData } from '../../../../../../modules/useWertesNavData.js'

export const WerteFolder = memo(
  observer(() => {
    const client = useApolloClient()
    const store = useContext(StoreContext)

    const isOpen = store.tree.openNodes.some(
      (nodeArray) => nodeArray[0] === 'Werte-Listen',
    )

    const { navData, isLoading, error } = useWertesNavData()

    const node = {
      nodeType: 'folder',
      menuType: 'wlFolder',
      id: 'wlFolder',
      urlLabel: 'Werte-Listen',
      label: navData?.label,
      url: ['Werte-Listen'],
      hasChildren: true,
    }

    const adresseMenu = useMemo(
      () => navData?.menus?.find?.((n) => n.id === 'Adressen'),
      [navData],
    )
    const apberrelevantGrundMenu = useMemo(
      () => navData?.menus?.find?.((n) => n.id === 'ApberrelevantGrundWerte'),
      [navData],
    )
    const ekAbrechnungstypMenu = useMemo(
      () => navData?.menus?.find?.((n) => n.id === 'EkAbrechnungstypWerte'),
      [navData],
    )
    const zaehleinheitMenu = useMemo(
      () =>
        navData?.menus?.find?.((n) => n.id === 'TpopkontrzaehlEinheitWerte'),
      [navData],
    )

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && [
            <AdresseFolder
              key={1}
              menu={adresseMenu}
            />,
            <ApberrelevantGrundFolder
              key={2}
              menu={apberrelevantGrundMenu}
            />,
            <EkAbrechnungstypFolder
              key={3}
              menu={ekAbrechnungstypMenu}
            />,
            <ZaehlEinheitFolder
              key={4}
              menu={zaehleinheitMenu}
            />,
          ]}
        </TransitionGroup>
      </>
    )
  }),
)
