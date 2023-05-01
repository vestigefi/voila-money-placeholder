import React from 'react'
import logoLight from '../assets/text-light.svg'
import logoDark from '../assets/text-dark.svg'
import Switch from './Switch'
import { FaSun, FaMoon } from 'react-icons/fa'
import { ActionTypes, useStore } from '../store'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  const { state, dispatch } = useStore()
  const isDark = state.theme === 'dark'

  const toggleTheme = () => {
    dispatch(ActionTypes.TOGGLE_THEME)
  }

  return (
    <nav className="relative inset-x-0 top-0 z-10 p-2 transition-all md:p-4">
      <div className="container mx-auto flex items-center justify-between space-x-4 px-2 md:px-4">
        <div className="flex min-w-max items-center py-1 md:py-2">
          <Link to="/">
            <img
              className="h-6 w-auto cursor-pointer select-none md:h-8"
              src={(isDark ? logoDark : logoLight) as unknown as string}
              alt={'Logo'}
            />
          </Link>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <Switch
            id={'toggle-theme'}
            name={'toggle-theme'}
            checked={isDark}
            onChange={toggleTheme}
            iconOff={<FaSun size="0.8rem" />}
            iconOn={<FaMoon size="0.8rem" />}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
