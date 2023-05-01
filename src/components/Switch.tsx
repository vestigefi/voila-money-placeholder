import React, { ChangeEvent, ReactNode } from 'react'

interface SwitchProps {
  id: string
  name: string
  checked: boolean
  onChange: (checked: boolean) => void
  iconOff?: ReactNode
  iconOn?: ReactNode
  label?: string
  className?: string
}

const Switch: React.FC<SwitchProps> = ({
  id,
  name,
  checked,
  onChange,
  iconOff,
  iconOn,
  label,
  className
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
  }

  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        name={name}
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={handleChange}
      />
      <label
        htmlFor={id}
        className={`relative h-6 w-12 cursor-pointer rounded-full bg-gray-300 transition-all duration-200 dark:bg-gray-600`}
      >
        <span
          className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out dark:bg-gray-800 ${
            checked ? 'translate-x-6' : ''
          }`}
        >
          {checked ? iconOn : iconOff}
        </span>
      </label>
      {label && <span className="ml-3">{label}</span>}
    </div>
  )
}

export default Switch
