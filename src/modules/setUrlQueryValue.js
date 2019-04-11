export default async ({ key, value, urlQuery, setUrlQuery }) => {
  let { projekteTabs, feldkontrTab } = urlQuery
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else {
    feldkontrTab = value
  }
  setUrlQuery({ projekteTabs, feldkontrTab })
}
