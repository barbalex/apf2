// @flow

export default ({
  projektNodes,
}: {
  projektNodes: Array<Object>,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const wlIndex = projektNodes.length + 2

  return [
    {
      nodeType: 'folder',
      menuType: 'wlFolder',
      id: 'wlFolder',
      urlLabel: 'Werte-Listen',
      label: `Werte-Listen`,
      url: ['Werte-Listen'],
      sort: [wlIndex],
      hasChildren: true,
    },
  ]
}
