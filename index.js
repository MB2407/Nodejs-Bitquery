// const express = require('express')
// const fetch = require('node-fetch')
import express from 'express'
import fetch from 'node-fetch'
const app = express()
app.set('view engine', 'ejs')

const endpoint = "https://graphql.bitquery.io/" 
const query = `
{
  OHLC: ethereum(network: bsc) {
    dexTrades(
      options: {limit: 100, asc: "timeInterval.minute"}
      date: {since: "2020-11-01"}
      exchangeName: {in: ["Pancake", "Pancake v2"]}
      baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}
      quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}
    ) {
      timeInterval {
        minute(count: 5)
      }
      baseCurrency {
        symbol
        address
      }
      baseAmount
      quoteCurrency {
        symbol
        address
      }
      quoteAmount
      trades: count
      quotePrice
      maximum_price: quotePrice(calculate: maximum)
      minimum_price: quotePrice(calculate: minimum)
      open_price: minimum(of: block, get: quote_price)
      close_price: maximum(of: block, get: quote_price)
    }
  }
  New_Pairs: ethereum(network: bsc) {
    arguments(
      smartContractAddress: {is: "0xBCfCcbde45cE874adCB698cC183deBcF17952812"}
      smartContractEvent: {is: "PairCreated"}
      argument: {is: "pair"}
      options: {desc: "block.height", limit: 9}
    ) {
      block {
        height
      }
      argument {
        name
      }
      reference {
        address
      }
    }
  }
  Trade_Volume_For_DEX: ethereum(network: ethereum) {
    dexTrades(exchangeName: {is: "Uniswap"}) {
      count
      tradeAmount(calculate: sum, in: USD)
      medianTrade: tradeAmount(calculate: median, in: USD)
      averageTrade : tradeAmount (calculate: average, in: USD)
    }
  }
  Most_Traded_Ethereum_Tokens: ethereum(network: ethereum) {
    transfers(
      options: {desc: "count", limit: 10, offset: 0}
      amount: {gt: 0}
      date: {since: "2021-07-01", till: "2022-02-09T23:59:59"}
    ) {
      currency {
        symbol
        address
      }
      count
      senders: count(uniq: senders)
      receivers: count(uniq: receivers)
      days: count(uniq: dates)
      from_date: minimum(of: date)
      till_date: maximum(of: date)
      amount
    }
  }
	Gas_Unit_Price_By_Date: ethereum(network: ethereum) {
    transactions(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      gasPrice
      gasValue
      average: gasValue(calculate: average)
      maxGasPrice: gasPrice(calculate: maximum)
      medianGasPrice: gasPrice(calculate: median)
    }
  }
  Gas_Cost_By_Date: ethereum(network: ethereum) {
    transactions(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      gasPrice
      gasValue
      average: gasValue(calculate: average)
      maxGasPrice: gasPrice(calculate: maximum)
      medianGasPrice: gasPrice(calculate: median)
    }
  }
  Gas_Price_By_Date: ethereum(network: ethereum) {
    transactions(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      gasPrice
      gasValue
      average: gasValue(calculate: average)
      maxGasPrice: gasPrice(calculate: maximum)
      medianGasPrice: gasPrice(calculate: median)
    }
  }
  Trades_By_Time: ethereum(network: ethereum) {
    dexTrades(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      trades: countBigInt
      traders: countBigInt(uniq: takers)
      contracts: countBigInt(uniq: smart_contracts)
      currencies: countBigInt(uniq: buy_currency)
    }
  }
	Trade_Takers: ethereum(network: ethereum) {
    dexTrades(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      trades: countBigInt
      traders: countBigInt(uniq: takers)
      contracts: countBigInt(uniq: smart_contracts)
      currencies: countBigInt(uniq: buy_currency)
    }
  }
	Trade_Currencies_By_Time: ethereum(network: ethereum) {
    dexTrades(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      trades: countBigInt
      traders: countBigInt(uniq: takers)
      contracts: countBigInt(uniq: smart_contracts)
      currencies: countBigInt(uniq: buy_currency)
    }
  }
	DEX_Smart_Contracts_By_Time: ethereum(network: ethereum) {
    dexTrades(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      trades: countBigInt
      traders: countBigInt(uniq: takers)
      contracts: countBigInt(uniq: smart_contracts)
      currencies: countBigInt(uniq: buy_currency)
    }
  }
  DEX_Trades_By_Exchange: ethereum(network: ethereum) {
    dexTrades(options: {asc: "date.date"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      date: date {
        date(format: "%Y-%m-%d")
      }
      exchange {
        fullName
      }
      count
      tradeAmount(in: USD)
    }
  }
	Amount_Of_DEX_Trades_by_Exchange: ethereum(network: ethereum) {
    dexTrades(options: {desc: "tradeAmount"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      exchange {
        fullName
      }
      trades: count
      tradeAmount(in: USD)
      currencies: count(uniq: buy_currency)
      contracts: count(uniq: smart_contracts)
    }
  }
  DEX_Exchanges: ethereum(network: ethereum) {
    dexTrades(options: {desc: "tradeAmount"}, date: {since: "2022-01-13", till: "2022-02-11T23:59:59"}) {
      exchange {
        fullName
      }
      trades: count
      tradeAmount(in: USD)
      currencies: count(uniq: buy_currency)
      contracts: count(uniq: smart_contracts)
    }
  }

}

`

let ohlc = 0, newPairs_height = 0, newPairs_name = 0, Trade_Volume_For_DEX_count = 0, Trade_Volume_For_DEX_amount = 0 , Most_Traded_Ethereum_Tokens = 0 , DEX_Exchanges = 0 , Amount_Of_DEX_Trades_by_Exchange = 0; 
let DEX_Trades_By_Exchange = 0, DEX_Smart_Contracts_By_Time =0, Trade_Currencies_By_Time = 0 , Trade_Takers = 0, Trades_By_Time = 0;
let Gas_Price_By_Date = 0 , Gas_Cost_By_Date = 0, Gas_Unit_Price_By_Date = 0 ; 
let countValue = 0;
let DEX_Trades_By_Exchange_count = 0, Trade_Currencies_By_Time_contracts = 0, Trade_Takers_traders = 0, Trades_By_Time_trade = 0;
let finalBaseAmount = 0;
const result2 = 2022; 
function BitqueryAPICall(){
	const data =  fetch(endpoint, {
	    method: "POST",
	    headers: {
	    	"Content-Type": "application/json",
	      	"X-API-KEY": "BQYedS7YfEFrtiYt9KOSezoT6ChtUReU"
	    },
	    body: JSON.stringify({
	        query
	    })
	}).then(res => res.json()).then(data => {
		ohlc = data.data.OHLC.dexTrades
		// newPairs_height = data.data.New_Pairs.block.height
		// newPairs_name = data.data.New_Pairs.argument.name

		for (let i=0;i<10;i++){
			let baseCurrencyDetails = ohlc[i].baseCurrency.symbol
			let baseCurrencyAmount = ohlc[i].baseAmount
			console.log(baseCurrencyDetails+" is the BASECURRENCY SYMBOL")
			console.log(baseCurrencyAmount+" is the BASEAMOUNT");
			// console.log(quoteCurrencyDetails+" is the QUOTECURRENCY SYMBOL")
			// console.log(quoteCurrencyAmount+" is the QUOTEAMOUNT")
			console.log("\n")
		}
		finalBaseAmount = ohlc[0].baseAmount
		newPairs_name = data.data.New_Pairs.arguments[0].argument.name
		newPairs_height = data.data.New_Pairs.arguments[0].block.height
		Trade_Volume_For_DEX_count = data.data.Trade_Volume_For_DEX.dexTrades[0].count
		Trade_Volume_For_DEX_amount = data.data.Trade_Volume_For_DEX.dexTrades[0].amount
		Most_Traded_Ethereum_Tokens = data.data.Most_Traded_Ethereum_Tokens.transfers[0].currency.symbol
		DEX_Exchanges = data.data.DEX_Exchanges.dexTrades[0].exchange.fullName
		Amount_Of_DEX_Trades_by_Exchange = data.data.Amount_Of_DEX_Trades_by_Exchange.dexTrades[0].tradeAmount
		DEX_Trades_By_Exchange = data.data.DEX_Trades_By_Exchange.dexTrades[0].fullname 
		DEX_Trades_By_Exchange_count = data.data.DEX_Trades_By_Exchange.dexTrades[0].count
		Trade_Currencies_By_Time = data.data.Trade_Currencies_By_Time.dexTrades[0].trades
		Trade_Currencies_By_Time_contracts = data.data.Trade_Currencies_By_Time.dexTrades[0].contracts
		Trade_Takers =data.data.Trade_Takers.dexTrades[0].trades
		Trade_Takers_traders =data.data.Trade_Takers.dexTrades[0].traders
		Trades_By_Time = data.data.Trades_By_Time.dexTrades[0].date
		Trades_By_Time_trade = data.data.Trades_By_Time.dexTrades[0].trades
	})


}


app.get('/', (req, res)=>{
	// console.log(BitqueryAPICall())
	// BitqueryAPICall()
	console.log(BitqueryAPICall())
	res.render(
		'home', 
		{
			result: finalBaseAmount, 
			result2: newPairs_name, 
			result3: newPairs_height, 
			result4: Trade_Volume_For_DEX_count,
			result5: Trade_Volume_For_DEX_amount,
			result6: Most_Traded_Ethereum_Tokens,
			result7: DEX_Exchanges,
			result8: Amount_Of_DEX_Trades_by_Exchange,
			result9: DEX_Trades_By_Exchange,
			result10: Trade_Currencies_By_Time,
			result11: Trade_Currencies_By_Time_contracts,
			result12: Trade_Takers,
			result13: Trade_Takers_traders,
			result14: Trades_By_Time,
			result15: Trades_By_Time_trade
		}
	)
})

app.get('/new', (req, res)=>{
	
	res.render('new', {result2: result2})
})


const PORT = 3000 || process.env.PORT 

app.listen(PORT, ()=>{console.log(`Server starting in port ${PORT}. `)})


