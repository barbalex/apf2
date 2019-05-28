import axios from 'axios'

export default async ({ setKtZh, addError }) => {
  const url = `https://ucarecdn.com/e0979273-45fb-46cd-9635-9715a887f887/ktZh.json`
  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    addError(error)
  }
  setKtZh(result.data)
}
