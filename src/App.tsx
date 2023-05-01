import React, { FC } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes as BrowserRoutes, Route } from 'react-router-dom'
import Home from './views/Home'
import { Toaster } from 'react-hot-toast'
import Account from 'views/Account'
import { StoreProvider } from 'store'

import algosdk from 'algosdk'
import MyAlgoConnect from '@randlabs/myalgo-connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { DeflyWalletConnect } from '@blockshake/defly-connect'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from 'algorand-walletconnect-qrcode-modal'
import {
  PROVIDER_ID,
  WalletProvider,
  algosigner,
  defly,
  exodus,
  myalgo,
  pera,
  reconnectProviders,
  walletconnect
} from '@txnlab/use-wallet'

const walletProviders = {
  [PROVIDER_ID.PERA]: pera.init({
    algosdkStatic: algosdk,
    clientStatic: PeraWalletConnect
  }),

  [PROVIDER_ID.DEFLY]: defly.init({
    algosdkStatic: algosdk,
    clientStatic: DeflyWalletConnect
  }),

  [PROVIDER_ID.EXODUS]: exodus.init({
    algosdkStatic: algosdk
  }),
  [PROVIDER_ID.MYALGO]: myalgo.init({
    algosdkStatic: algosdk,
    clientStatic: MyAlgoConnect
  }),
  [PROVIDER_ID.ALGOSIGNER]: algosigner.init({
    algosdkStatic: algosdk
  }),
  [PROVIDER_ID.WALLETCONNECT]: walletconnect.init({
    algosdkStatic: algosdk,
    clientStatic: WalletConnect,
    modalStatic: QRCodeModal
  })
}

const App: FC = () => {
  React.useEffect(() => {
    reconnectProviders(walletProviders)
  }, [])

  return (
    <WalletProvider value={walletProviders}>
      <StoreProvider>
        <BrowserRouter>
          <div
            className="flex min-w-[320px] flex-col"
            style={{ minHeight: 'clamp(568px, 100vh, 100vh)' }}
          >
            <Toaster position="bottom-right" reverseOrder />
            <Navbar />
            <div className="flex grow">
              <div className="flex w-full justify-center p-2 md:p-4">
                <div className="w-full max-w-screen-2xl">
                  <BrowserRoutes>
                    <Route index element={<Home />} />
                    <Route path="*" element={<Account />} />
                  </BrowserRoutes>
                </div>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </StoreProvider>
    </WalletProvider>
  )
}

export default App
