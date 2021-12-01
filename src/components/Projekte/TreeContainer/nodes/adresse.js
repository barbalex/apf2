const adresse = ({ nodes: nodesPassed, data, projektNodes }) => {
  const adresses = data?.allAdresses?.nodes ?? []
  const wlIndex = projektNodes.length + 2
  const nodes = adresses
    // only show if parent node exists
    .filter(() => nodesPassed.map((n) => n.id).includes('adresseFolder'))
    .map((el) => ({
      nodeType: 'table',
      menuType: 'adresse',
      filterTable: 'adresse',
      id: el.id,
      parentId: 'adresseFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'Adressen', el.id],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [wlIndex, 1, index]
      return el
    })

  return nodes
}

export default adresse
