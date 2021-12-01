const userNodes = ({ data, projektNodes }) => {
  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1

  // map through all elements and create array of nodes
  const nodes = (data?.allUsers?.nodes ?? [])
    .map((el) => ({
      nodeType: 'table',
      menuType: 'user',
      filterTable: 'user',
      id: el.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Benutzer', el.id],
      hasChildren: false,
    }))
    .map((el, index) => {
      el.sort = [userIndex, index]
      return el
    })

  return nodes
}

export default userNodes
