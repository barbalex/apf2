import axios from 'axios'

export default async store => {
  const { setKtZh, enqueNotification } = store
  const url = `https://ucarecdn.com/e0979273-45fb-46cd-9635-9715a887f887/ktZh.json`
  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    return enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  setKtZh(result.data)
}
