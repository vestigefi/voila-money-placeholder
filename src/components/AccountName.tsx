import React from 'react'
import nfdIcon from '../assets/nfd-icon.png'

interface AccountNameProps {
  address: string
  nfd?: { name: string }
}

const AccountName: React.FC<AccountNameProps> = ({ address, nfd }) => {
  return (
    <div className="flex flex-col items-center">
      {nfd && (
        <div className="flex items-center space-x-2 px-4 pt-4">
          <img
            src={nfdIcon}
            className="pointer-events-none select-none rounded-lg"
          />
          <span className="text-xl font-bold md:text-3xl">{nfd?.name}</span>
        </div>
      )}
      <div className="flex items-center py-2 text-xs">
        <b>{address.slice(0, 4)}</b>
        <span className="opacity-80">{address.slice(4, 8)}</span>
        <span className="opacity-50">
          {address.slice(8, 12)}⋯{address.slice(46, 50)}
        </span>
        <span className="opacity-80">{address.slice(50, 54)}</span>
        <b>{address.slice(54)}</b>
      </div>
    </div>
  )
}

export default AccountName
