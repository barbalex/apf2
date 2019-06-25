export default async ({ key, value, urlQuery, setUrlQuery }) => {
  let { projekteTabs, feldkontrTab, idealbiotopTab } = urlQuery
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else if (key === 'feldkontrTab') {
    feldkontrTab = value
  } else {
    idealbiotopTab = value
  }
  setUrlQuery({ projekteTabs, feldkontrTab, idealbiotopTab })
}
