export default async ({ key, value, urlQuery, setUrlQuery }) => {
  let { projekteTabs, tpopTab, feldkontrTab, idealbiotopTab, qkTab } = urlQuery
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else if (key === 'tpopTab') {
    tpopTab = value
  } else if (key === 'feldkontrTab') {
    feldkontrTab = value
  } else if (key === 'qkTab') {
    qkTab = value
  } else {
    idealbiotopTab = value
  }
  setUrlQuery({ projekteTabs, tpopTab, feldkontrTab, idealbiotopTab, qkTab })
}
