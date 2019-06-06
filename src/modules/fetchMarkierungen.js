import axios from 'axios'

export default async ({ setMarkierungen, store }) => {
  const url = `https://ucarecdn.com/531f7c51-53d6-432e-8eb1-c75717c8e6ab/markierungen.json`
  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    store.enqueNotification({
      message: error.message,
      options: {
        variant: 'error',
      },
    })
  }
  setMarkierungen(result.data)
}
