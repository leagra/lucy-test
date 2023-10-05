'use client'

import React, { ReactNode, useContext } from "react";
import { enableStaticRendering } from "mobx-react-lite";

import { StoreContext } from "./Context"
import {RootStore, RootStoreInitialData} from "./RootStore"

enableStaticRendering(typeof window === "undefined")

let clientStore: RootStore | undefined

export const useStore = () => {
    const context = useContext(StoreContext)
  
    return context
}

function initializeStore(initialData: RootStoreInitialData) {
    const store = clientStore ?? new RootStore()
  
    if (initialData) {
      store.hydrate(initialData)
    }
    
    if (typeof window === 'undefined') return store
    
    if (!clientStore) clientStore = store
  
    return store
  }

export const StoreProvider = ({ children, initialState }: { children: ReactNode, initialState?: any }) => {
    const store = initializeStore(initialState)

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}