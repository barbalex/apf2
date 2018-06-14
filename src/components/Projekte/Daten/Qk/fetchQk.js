// @flow
import axios from 'axios'

const fetchQk = async ({
  berichtjahr,
  apId,
  addMessages,
  errorState,
}: {
  berichtjahr: Number,
  apId: String,
  addMessages: () => void,
  errorState: Object,
}) => {
  const qualityControls = [
    // 3. Teilpopulation
    // TPop ohne verlangten TPop-Bericht im Berichtjahr
    { type: 'function', name: 'qk_tpop_ohne_tpopber', berichtjahr },
    // TPop ohne verlangten TPop-Massn.-Bericht im Berichtjahr
    { type: 'function', name: 'qk_tpop_ohne_massnber', berichtjahr },

    // 5. Kontrollen

    // Zählung ohne Einheit/Methode/Anzahl
    { type: 'view', name: 'v_qk_feldkontrzaehlung_ohneanzahl', berichtjahr },
    { type: 'view', name: 'v_qk_freiwkontrzaehlung_ohneanzahl', berichtjahr },
  ]
  let nrOfMessages = 0

  const qualityControlsUsingView = qualityControls.filter(
    q => q.type === 'view'
  )
  const queryUrls = qualityControlsUsingView.map(t => {
    if (t.berichtjahr) {
      return `/${t.name}?ap_id=eq.${apId}&Berichtjahr=eq.${t.berichtjahr}`
    } else {
      return `/${t.name}?ap_id=eq.${apId}`
    }
  })
  const dataFetchingPromisesForQueries = queryUrls.map(dataUrl =>
    axios
      .get(dataUrl)
      .then(res => {
        if (res.data.length > 0) {
          const newMessages = res.data
          addMessages(newMessages)
          nrOfMessages += 1
        }
        return null
      })
      .catch(e => e)
  )

  const qualityControlsUsingFunction = qualityControls.filter(
    q => q.type === 'function'
  )
  const functionUrls = qualityControlsUsingFunction.map(t => `/rpc/${t.name}`)
  const dataFetchingPromisesForFunctions = functionUrls.map(dataUrl =>
    axios
      .post(dataUrl, { apid: apId, berichtjahr })
      .then(res => {
        if (res.data.length > 0) {
          const newMessages = res.data
          addMessages(newMessages)
          nrOfMessages += 1
        }
        return null
      })
      .catch(e => e)
  )

  try {
    await Promise.all([
      ...dataFetchingPromisesForQueries,
      ...dataFetchingPromisesForFunctions,
    ])
  } catch (error) {
    errorState.add(error)
  }

  // if no messages: tell user
  if (nrOfMessages === 0) {
    const messages = [
      {
        hw: 'Wow: Scheint alles i.O. zu sein!',
        url: [],
        text: [],
      },
    ]
    addMessages(messages)
  }
  try {
    await axios.post('/rpc/correct_vornach_beginnap_stati', {
      apid: apId,
    })
  } catch (error) {
    errorState.add(error)
  }
}

export default fetchQk
