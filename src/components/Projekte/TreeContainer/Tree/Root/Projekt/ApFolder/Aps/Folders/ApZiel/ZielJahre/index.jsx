import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../Row'
import storeContext from '../../../../../../../../../../../storeContext'

const ApZieljahr = ({ projekt, ap, zieljahre, ziels }) => {
  const store = useContext(storeContext)

  return zieljahre.map((jahr) => {
    const labelJahr = jahr === null || jahr === undefined ? 'kein Jahr' : jahr
    const zieleOfJahr = ziels.filter((el) => el.jahr === jahr)
    const labelJahreLength = zieleOfJahr.length

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr,
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zieljahrFolder',
      id: `${ap.id}Ziele${jahr || 'keinJahr'}`,
      jahr,
      parentId: ap.id,
      urlLabel: `${jahr === null || jahr === undefined ? 'kein Jahr' : jahr}`,
      label: `${labelJahr} (${labelJahreLength})`,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele', jahr],
      hasChildren: true,
    }

    return (
      <>
        <Row key={`${ap.id}/${jahr}`} node={node} />
        {isOpen && <div>Children</div>}
      </>
    )
  })
}

export default observer(ApZieljahr)
