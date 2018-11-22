// @flow

export default async ({
  key,
  value,
  urlQuery,
  setUrlQuery,
  client,
  history,
}: {
  key: String,
  value: String,
  urlQuery: Object,
  setUrlQuery: () => void,
  client: Object,
  history: Object,
}): void => {
  let { projekteTabs, feldkontrTab } = urlQuery
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else {
    feldkontrTab = value
  }
  setUrlQuery({ projekteTabs, feldkontrTab, client, history })
}
