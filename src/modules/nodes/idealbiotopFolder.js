export default (store, projId, apArtId) => {
  const { activeUrlElements } = store

  return {
    nodeType: `folder`,
    menuType: `idealbiotopFolder`,
    id: apArtId,
    label: `Idealbiotop`,
    expanded: activeUrlElements.idealbiotopFolder,
    url: [`Projekte`, projId, `Arten`, apArtId, `Idealbiotop`],
  }
}
