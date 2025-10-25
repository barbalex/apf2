export const RootNode = ({ fetcher }) => {
  const res = fetcher?.()
  const navData = res?.navData

  if (!navData) return null

  return <navData.component menu={navData} />
}
