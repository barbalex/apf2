import axios from 'axios'

export default async ({ setDetailplaene, addError }) => {
  const url = `https://ucarecdn.com/9bf9680e-ccbc-4e4b-9487-5b483d21e26d/detailplaeneWgs84neu.json`
  //const axios = await import('axios').then(m => m.default)
  let result
  try {
    result = await axios.get(url)
  } catch (error) {
    addError(error)
  }
  setDetailplaene(result.data)
}
