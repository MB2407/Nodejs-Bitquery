const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.set('view engine', 'ejs')

const endpoint = "https://graphql.bitquery.io/" 
const query = `
{
	bitcoin{
    	blocks{
      		count
    	}
   	}
}`

function BitqueryAPICall(){
	const result =  fetch(endpoint, {
	    method: "POST",
	    headers: {
	    	"Content-Type": "application/json",
	      	"X-API-KEY": "YOUR UNIQUE API KEY"
	    },
	    body: JSON.stringify({
	        query
	    })
	}).then(res => res.json()).then(data => {
		countValue = data.data.bitcoin.blocks[0].count
	})
	return result
}

let countValue = BitqueryAPICall()

app.get('/', (req, res)=>{
	console.log(countValue+" is the returned value!")
	res.render('home', {result: countValue})
})

const PORT = 3000 || process.env.PORT 

app.listen(PORT, ()=>{console.log(`Server starting in port ${PORT}. `)})


