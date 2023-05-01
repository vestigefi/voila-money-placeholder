/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from 'store'
import animationDark from '../../assets/logo-dark-loop.json'
import animationLight from '../../assets/logo-light-loop.json'
import Lottie from 'react-lottie'
//@ts-ignore
import AnimatedNumber from 'react-animated-number'
import algosdk from 'algosdk'
import { toast } from 'react-hot-toast'
import Avatar from 'components/Avatar'
import AccountName from 'components/AccountName'
import axios from 'axios'
import dayjs from 'dayjs'
import Card from 'components/Card'
import AssetIcon from 'components/AssetIcon'
import logoLight from '../../assets/text-light.svg'
import logoDark from '../../assets/text-dark.svg'
import IconButton from 'components/IconButton'
import { FaDownload } from 'react-icons/fa'
import { toPng } from 'html-to-image'
import { classNames } from 'utils'
import { TwitterIcon, TwitterShareButton } from 'react-share'

const Account: React.FC = () => {
  const location = useLocation()
  const { state } = useStore()
  const isDark = state.theme === 'dark'
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [nfd, setNfd] = useState()
  const [assets, setAssets] = useState([])
  const [assetIcons, setAssetIcons] = useState([])
  const [generatingDownload, setGeneratingDownload] = useState(false)

  useEffect(() => {
    const address = location.pathname.slice(1)
    if (algosdk.isValidAddress(address) && transactions.length === 0) {
      const urlAssets = 'https://free-api.vestige.fi/assets/list'
      axios.get(urlAssets).then((response) => {
        const assets = response.data
        setAssets(assets)
      })
      const urlIcons =
        'https://asa-icons.s3.eu-central-1.amazonaws.com/icons.json'
      axios.get(urlIcons).then((response) => {
        setAssetIcons(Object.keys(response.data) as never[])
      })
      const urlTxs = `https://api.nf.domains/nfd/v2/address?address=${address}`
      axios.get(urlTxs).then((response) => {
        const nfdObject = response.data[address][0]
        setNfd(nfdObject)
      })
      const client = new algosdk.Indexer(
        '',
        'https://mainnet-idx.algonode.cloud',
        443
      )
      updateAccountTransactions(true, client, address)
    } else {
      toast.error('Something went wrong. Try again?')
    }
  }, [location])

  const updateAccountTransactions = async (
    firstRun: boolean,
    client: algosdk.Indexer,
    address: string,
    nextToken?: string
  ) => {
    if (firstRun || nextToken) {
      const response = nextToken
        ? await client
            .lookupAccountTransactions(address)
            .nextToken(nextToken)
            .do()
        : await client.lookupAccountTransactions(address).do()
      setTransactions((t) => [...t, ...response.transactions] as never[])
      setTimeout(
        () =>
          updateAccountTransactions(
            false,
            client,
            address,
            response['next-token']
          ),
        100
      )
    } else {
      setLoading(false)
    }
  }

  const transactionData = useMemo(() => {
    const getInnerTransactionAmount = (address: string, txs: never[]) => {
      let amount = 0
      txs.forEach((tx) => {
        if (tx['sender'] === address) {
          amount += 1
          if (tx['inner-txns'])
            amount += getInnerTransactionAmount(address, tx['inner-txns'] || [])
        }
      })
      return amount
    }
    const address = location.pathname.slice(1)
    if (!loading) {
      let earliestTimestamp = Infinity
      //@ts-ignore
      let earliestNFDTransaction = dayjs(nfd?.timeChanged).unix()
      let transactionsMade = 0
      let feesPaid = 0
      const uniqueTransactions = {}
      transactions.forEach((tx) => {
        //@ts-ignore
        uniqueTransactions[tx.id] = tx
      })
      const txs = Object.values(uniqueTransactions)
      const assetsUsed = {}
      //@ts-ignore
      txs.forEach((tx: never) => {
        if (tx['round-time'] < earliestTimestamp)
          earliestTimestamp = tx['round-time']
        if (tx['sender'] === address) {
          if (
            tx['application-transaction'] &&
            //@ts-ignore
            tx['application-transaction']['application-id'] === nfd?.appID &&
            tx['round-time'] < earliestNFDTransaction
          ) {
            earliestNFDTransaction = tx['round-time']
          }
          if (tx['asset-transfer-transaction']) {
            if (!assetsUsed[tx['asset-transfer-transaction']['asset-id']])
              //@ts-ignore
              assetsUsed[tx['asset-transfer-transaction']['asset-id']] = 0
            //@ts-ignore
            assetsUsed[tx['asset-transfer-transaction']['asset-id']] += 1
          }
          transactionsMade += 1
          if (tx['inner-txns'])
            transactionsMade += getInnerTransactionAmount(
              address,
              tx['inner-txns'] || []
            )
          feesPaid += tx['fee']
        }
      })
      const mostUsedAssets = Object.keys(assetsUsed).sort(
        //@ts-ignore
        (a, b) => assetsUsed[b] - assetsUsed[a]
      )
      const defiAssets = mostUsedAssets.filter((k) =>
        //@ts-ignore
        assets.find((a) => a.id.toString() === k.toString())
      )
      const walletAssets = defiAssets.map((k) => ({
        //@ts-ignore
        transactions: assetsUsed[k],
        //@ts-ignore
        ...assets.find((a) => a.id.toString() === k.toString())
      }))
      return {
        earliestTimestamp,
        earliestNFDTransaction,
        transactionsMade,
        feesPaid,
        assetsUsed,
        walletAssets
      }
    }
    return {
      earliestTimestamp: 0,
      earliestNFDTransaction: 0,
      transactionsMade: 0,
      feesPaid: 0,
      assetsUsed: {},
      walletAssets: []
    }
  }, [loading, transactions, nfd, location, assets])

  const ref = useRef<HTMLDivElement>(null)

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }
    setGeneratingDownload(true)
    setTimeout(() => {
      //@ts-ignore
      toPng(ref.current, { cacheBust: true })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.download = `voila-money-${
            //@ts-ignore
            nfd?.name || location.pathname.slice(1)
          }.png`
          link.href = dataUrl
          link.click()
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setGeneratingDownload(false))
    }, 100)
  }, [ref])

  return loading ? (
    <div className="flex w-full flex-col items-center">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData:
            state.theme === 'dark' ? animationDark : animationLight,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        }}
        height={360}
        width={360}
      />
      <h1 className="pb-4 text-2xl font-bold md:text-4xl">Crunching numbers</h1>
      <span>
        Reviewed{' '}
        <b>
          <AnimatedNumber value={transactions.length} stepPrecision={0} />
        </b>{' '}
        wallet transactions so far
      </span>
      <span className="py-4 text-sm opacity-60">Please wait...</span>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center space-x-8">
      <div ref={ref} className={generatingDownload ? 'min-w-max' : ''}>
        <Card className="flex-col items-center">
          <div
            className={classNames(
              'flex items-center justify-center',
              !generatingDownload && 'flex-col md:flex-row'
            )}
          >
            <div className="flex flex-col items-center p-8">
              <div className="p-4">
                <Avatar content={location.pathname.slice(1)} />
              </div>
              <AccountName address={location.pathname.slice(1)} nfd={nfd} />
              <div className="flex flex-col items-center p-8">
                <span className="text-5xl font-bold">
                  {dayjs().diff(
                    dayjs.unix(transactionData.earliestTimestamp),
                    'days'
                  ) || 0}{' '}
                </span>
                <span>days on Algorand</span>
              </div>
            </div>
            <div className="flex flex-col items-center p-8">
              <div className="flex flex-col space-y-2">
                {nfd && (
                  <span>
                    <span className="text-xl font-bold">
                      {dayjs().diff(
                        dayjs.unix(transactionData.earliestNFDTransaction),
                        'days'
                      )}{' '}
                    </span>
                    <span className="text-sm opacity-70">
                      <b>days</b> being the owner of{' '}
                    </span>
                    {/* @ts-ignore */}
                    <b>{nfd?.name}</b>
                  </span>
                )}
                <span>
                  <span className="text-xl font-bold">
                    {transactionData.transactionsMade}{' '}
                  </span>
                  <span className="text-sm opacity-70">
                    <b>transactions</b> made
                  </span>
                </span>
                <span>
                  <span className="text-xl font-bold">
                    {transactionData.feesPaid / 1000000}{' '}
                  </span>
                  <b>ALGO</b>{' '}
                  <span className="text-sm opacity-70">
                    paid in network fees
                  </span>
                </span>
                <span>
                  <span className="text-xl font-bold">
                    {Object.keys(transactionData.assetsUsed).length}{' '}
                  </span>{' '}
                  <span className="text-sm opacity-70">
                    <b>assets</b> used, mainly:
                  </span>
                </span>
              </div>
              <div className="flex max-h-max space-x-2 pt-8">
                {transactionData.walletAssets.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className="flex w-full flex-col justify-between text-center"
                  >
                    <div className="relative flex flex-col items-center rounded-lg p-2">
                      <div className="relative h-12 w-12">
                        <AssetIcon assetIcons={assetIcons} assetId={a.id} />
                      </div>
                      <b className="pt-2 text-sm">{a.name}</b>
                      <span className="text-xs font-light opacity-80">
                        {a.transactions} txs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <img
            className="h-6 w-auto cursor-pointer select-none"
            src={(isDark ? logoDark : logoLight) as unknown as string}
            alt={'Logo'}
          />
        </Card>
      </div>
      <div className="flex w-full items-center justify-center space-x-2 p-4">
        <IconButton
          disabled={generatingDownload}
          name="Download"
          onClick={onButtonClick}
          IconComponent={FaDownload}
        />
        <TwitterShareButton
          url={'voila.money @voilamoney'}
          title={`I've been on Algorand for ${dayjs().diff(
            dayjs.unix(transactionData.earliestTimestamp),
            'days'
          )} days. How about you?`}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </div>
    </div>
  )
}

export default Account
