import React, { createContext, useReducer, useContext } from 'react'

interface State {
  theme: 'dark' | 'light'
}

interface Action {
  type: string
  payload?: any
}

const initialState: State = {
  theme: 'light'
}

export const ActionTypes = {
  TOGGLE_THEME: 'TOGGLE_THEME'
}

const reducer = (state: State, action: Action): State => {
  const isDark = state.theme === 'dark'
  switch (action.type) {
    case ActionTypes.TOGGLE_THEME:
      document.body.classList.toggle('dark', !isDark)
      localStorage.setItem('theme', isDark ? 'light' : 'dark')
      return { ...state, theme: isDark ? 'light' : 'dark' }
    default:
      return state
  }
}

// Store context
const StoreContext = createContext<{
  state: State
  dispatch: (type: string, payload?: any) => void
}>({
  state: initialState,
  dispatch: () => {}
})

interface StoreProviderProps {
  children: React.ReactNode
}

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = window.localStorage.getItem('theme')
    return savedTheme === 'dark' ? 'dark' : 'light'
  }
  return 'light'
}

const initializeStore = (): State => {
  const theme = getInitialTheme()

  return {
    ...initialState,
    theme
  }
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const initState = initializeStore()
  const [state, dispatchBase] = useReducer(reducer, initState)

  const dispatch = (type: string, payload?: any) => {
    dispatchBase({ type, payload })
  }

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
