import { Row } from '../../../../../../../../../Row.jsx'

export const Zielber = ({ menus, projekt, ap, jahr, ziel }) =>
  menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'zielber',
      id: el.id,
      parentId: ziel.id,
      parentTableId: ziel.id,
      urlLabel: el.id,
      label: el.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'AP-Ziele',
        jahr,
        ziel.id,
        'Berichte',
        el.id,
      ],
      hasChildren: false,
    }

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
