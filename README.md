# binance-firehose-streaming

![Language](https://img.shields.io/badge/language-nodejs-3C873A?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/team-siklab/binance-firehose-streaming?style=flat-square)

Subscribes to the [Binance][binance] streaming API, and sends incoming market tickers
to [Amazon Kinesis Firehose][firehose] using a simple batching process.

## Usage

Install the project dependencies using either `npm install` or `yarn`.

Run the application using `npm start` or `yarn start`.

The application sends received records in a batch request every `~60 seconds`.

### Stream name

The application needs to know the name of the Firehose stream to send the records to,
and defaults to `trades-stream` if none is provided.

You can provide the stream name through the `STREAM_NAME` environment variable in
your context.

```bash
# :: temporarily set the stream name
STREAM_NAME=my-stream yarn start

# :: or export it into your environment
export STREAM_NAME=my-stream
yarn start
```

The application is also configured to read off an `.env` file if present in the
project root. You can copy the `.env.sample` template in the codebase, and provide
the values in an `.env` instead.

> **IMPORTANT:** It's not very critical for this codebase, but it's not recommended
> to include the `.env` file in your codebase / repository, as it often contains
> sensitive information. Make sure this file is not included in your commits.
>
> This project's `.gitignore` file is already configured to ignore the `.env` file
> if present, so unless you change this file, you shouldn't need to do anything.

### Coin pair

To specify a coin pair to watch, just pass it as an argument to the run command.

```bash
# :: the application defaults to BTCUSDT
yarn start

# :: watch ETHUSDT instead
yarn start ETHUSDT
```

[binance]: https://binance.com
[firehose]: https://aws.amazon.com/kinesis/firehose

---

[@techlifemusic][twitter]

[twitter]: https://twitter.com/techlifemusic
