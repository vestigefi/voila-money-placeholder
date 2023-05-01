import React, { FC, KeyboardEventHandler } from 'react'
import { FaTimes } from 'react-icons/fa'

interface InputProps {
  value?: string
  onChange: (value: string) => void
  onEnter?: () => void
  className?: string
  placeholder?: string
  icon?: React.ReactNode
  type?: string
  onClear?: () => void
  showClear?: boolean
  disableMaxWidth?: boolean
  replaceClear?: React.ReactNode
  noPadding?: boolean
  onFocus?: string
  disabled?: boolean
}

const Input: FC<InputProps> = ({
  value,
  onChange,
  className,
  placeholder,
  icon,
  type,
  onEnter,
  onClear,
  showClear,
  disableMaxWidth,
  replaceClear,
  noPadding,
  onFocus,
  disabled
}) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (onEnter && event.key === 'Enter') onEnter()
  }

  return (
    <div
      className={`relative flex w-full items-center space-x-2 rounded-full px-2 sm:px-3 ${className}`}
      style={{
        maxWidth: disableMaxWidth ? '100%' : '16rem'
      }}
    >
      {icon && icon}
      <input
        className={`w-full max-w-full overflow-hidden rounded-full border-2 border-gray-300 bg-transparent py-1 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:text-gray-300 dark:placeholder:text-gray-400 dark:focus:border-blue-600 sm:py-2 ${
          noPadding ? '' : 'px-3'
        }`}
        value={value}
        onChange={(event) => onChange(event.target.value || '')}
        placeholder={placeholder}
        type={type}
        onKeyDown={handleKeyDown as unknown as KeyboardEventHandler}
        onFocus={onFocus as unknown as never}
        disabled={disabled}
      />
      {replaceClear
        ? replaceClear
        : (showClear !== undefined ? showClear : value !== '') && (
            <FaTimes
              className="absolute right-2 cursor-pointer transition-all hover:opacity-80 sm:right-4"
              onClick={(event) => {
                event.stopPropagation()
                onChange('')
                if (onClear) onClear()
              }}
            />
          )}
    </div>
  )
}

export default Input
