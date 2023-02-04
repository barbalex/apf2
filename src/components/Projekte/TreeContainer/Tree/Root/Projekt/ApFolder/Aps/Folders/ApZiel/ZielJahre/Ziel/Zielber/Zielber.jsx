import Row from '../../../../../../../../../Row'

const Zielber = ({ zielbers, projekt, ap, jahr, ziel }) =>
  (zielbers ?? []).map((el) => {
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

    return <Row key={el.id} node={node} />
  })

export default Zielber
