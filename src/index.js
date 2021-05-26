import AWS from 'aws-sdk'
import Binance from 'node-binance-api'

// :: ---

const client = new Binance()
const firehose = new AWS.Firehose({ region: 'ap-southeast-1' })

// :: ---

const STREAM_NAME = process.env.STREAM_NAME || 'trades-stream' // :: change this to your stream name
const SYMBOL = process.argv[2] || 'BTCUSDT'

// :: ---

console.clear()
console.info(`Aggregating ticker records for symbol: ${SYMBOL}`)
console.info(`Will send records to Firehose stream: ${STREAM_NAME}`)

const cache = []

// :: connect to the Binance ticker WSS
client.futuresAggTradeStream(SYMBOL, (ticker) => {
  cache.push(ticker)
})

// :: flush the cache and send to Firehose stream every second
setInterval(async () => {
  const __cache = [...cache]
  cache.length = 0

  // :: transform ticker records to firehose payload
  const records = __cache.map((record) => ({
    // :: The \n at the end is required because without it, Firehose will append
    //    JSON records right after the other like so:
    //
    //    { a: 1 }{ a: 2 }{ a: 3 }
    //
    //    and for a lot of analytics tools, this is considered invalid.
    //    There has to be a newline delimiter.
    Data: Buffer.from(JSON.stringify(record) + '\n'),
  }))

  const payload = {
    DeliveryStreamName: STREAM_NAME,
    Records: records,
  }

  console.info(`Sending: Cache size is ${__cache.length} records.`)
  await firehose.putRecordBatch(payload).promise()
}, 1e3)
