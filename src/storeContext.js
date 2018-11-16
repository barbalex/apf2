import React from 'react'

const StoreContext = React.createContext({})
export const StoreContextProvider = StoreContext.Provider
export const StoreContextConsumer = StoreContext.Consumer
export default StoreContext
