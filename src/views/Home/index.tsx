/* eslint-disable react-hooks/exhaustive-deps */
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import IconButton from 'components/IconButton'
import Input from 'components/Input'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { FaSignInAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const { providers, activeAccount } = useWallet()

  const goToAddress = (adr: string) => {
    const validAddress = adr.trim()
    if (algosdk.isValidAddress(validAddress)) {
      navigate(`/${validAddress}`)
    } else {
      toast.error('Bad address. Try again?')
    }
  }

  useEffect(() => {
    if (activeAccount?.address) {
      goToAddress(activeAccount?.address || '')
      providers
        ?.find((p) => p.metadata.id === activeAccount?.providerId)
        ?.disconnect()
    }
  }, [activeAccount?.address])

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold md:text-6xl">Welcome!</h1>
      <div className="pb-4 text-sm opacity-80">
        {
          "Your favourite wallet is currently being built. While you're here, take a moment to appreciate your Algorand journey!"
        }
      </div>
      <h3 className="pt-4 text-xl md:pt-8 md:text-2xl">
        <span className="opacity-60">Enter your </span>
        <b>Algorand address </b>
      </h3>
      <div className="mx-auto flex max-w-screen-md flex-col items-center space-x-2 space-y-2 pb-4 md:flex-row md:space-y-0 md:pb-8">
        <Input
          showClear={false}
          disableMaxWidth
          className="text-sm"
          value={address}
          onChange={setAddress}
          placeholder={algosdk.generateAccount().addr}
          onEnter={() => goToAddress(address)}
        />
        <IconButton
          IconComponent={FaSignInAlt}
          name={'Enter'}
          onClick={() => goToAddress(address)}
          disabled={!address}
        >
          <span>Enter</span>
        </IconButton>
      </div>
      <h3 className="text-xl md:text-2xl">
        <span className="opacity-60">or </span>
        <b>connect wallet</b>
      </h3>
      <div className="flex flex-col items-center space-y-4 pt-2">
        {providers?.map((provider) => (
          <button
            key={'provider-' + provider.metadata.id}
            onClick={provider.connect}
            disabled={provider.isConnected}
            className="flex items-center space-x-2 rounded-lg bg-white p-3 text-gray-600 shadow-md hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
          >
            <img
              width={30}
              height={30}
              alt=""
              className="rounded-md"
              src={provider.metadata.icon}
            />
            <b>
              {provider.metadata.name} {provider.isActive && '[active]'}
            </b>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
