// @flow

export default async ({
  key,
  value,
  urlQuery,
  setUrlQuery,
}: {
  key: String,
  value: String,
  urlQuery: Object,
  setUrlQuery: () => void,
}): void => {
  let { projekteTabs, feldkontrTab } = urlQuery
  if (key === 'projekteTabs') {
    projekteTabs = value
  } else {
    feldkontrTab = value
  }
  setUrlQuery({ projekteTabs, feldkontrTab })
}
