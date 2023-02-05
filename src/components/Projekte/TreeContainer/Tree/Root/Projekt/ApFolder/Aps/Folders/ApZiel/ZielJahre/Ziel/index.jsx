import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../storeContext'
import ZielberFolder from './Zielber'

const Ziel = ({ projekt, ap, jahr, ziels }) => {
  const store = useContext(storeContext)

  return ziels.map((ziel) => {
    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 7 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr &&
          n[6] === ziel.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'ziel',
      id: ziel.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: ziel.id,
      label: ziel.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'AP-Ziele',
        ziel.jahr,
        ziel.id,
      ],
      hasChildren: true,
    }

    return (
      <>
        <Row key={ziel.id} node={node} />
        {isOpen && (
          <ZielberFolder projekt={projekt} ap={ap} jahr={jahr} ziel={ziel} />
        )}
      </>
    )
  })
}

export default observer(Ziel)
