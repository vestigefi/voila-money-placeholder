import React from 'react'
import { IconType } from 'react-icons'

interface IconButtonProps {
  IconComponent: IconType
  name: string
  disabled?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

const IconButton: React.FC<IconButtonProps> = ({
  IconComponent,
  name,
  disabled,
  onClick,
  children
}) => {
  return (
    <button
      title={name}
      disabled={disabled}
      onClick={onClick}
      className={
        'flex items-center space-x-2 rounded-lg bg-white p-3 text-gray-600 shadow-md hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'
      }
    >
      <IconComponent size="1.2rem" />
      {children}
    </button>
  )
}

export default IconButton
