// This is the entry file for the application
import { useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import storeContext from '../storeContext'

const NavigateSetter = () => {
  const navigate = useNavigate()
  const { navigate: navigateInStore, setNavigate } = useContext(storeContext)
  const navigateSet = useRef(false)

  useEffect(() => {
    if (navigateInStore) return
    // prevent setting navigate twice
    // only because of strict mode?
    if (navigateSet.current) return

    // console.log('NavigateSetter setting navigate')
    setNavigate(navigate)
    navigateSet.current = true
  }, [navigate, navigateInStore, setNavigate])

  return null
}

export default observer(NavigateSetter)
