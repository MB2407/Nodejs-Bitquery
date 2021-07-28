const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.set('view engine', 'ejs')

const endpoint = "https://graphql.bitquery.io/" 
const query = `
{
	bitcoin {
    		blocks {
      			count
    		}
   	}
}`

let countValue = 0; 

function BitqueryAPICall(){
	const data =  fetch(endpoint, {
	    method: "POST",
	    headers: {
	    	"Content-Type": "application/json",
	      	"X-API-KEY": "BQYUGuoO6tZKM20I0lfBNCTEC4ouBCT1"
	    },
	    body: JSON.stringify({
	        query
	    })
	}).then(res => res.json()).then(data => {
		countValue = data.data.bitcoin.blocks[0].count
		console.log(countValue)
	})

}


app.get('/', (req, res)=>{
	console.log(BitqueryAPICall())
	res.render('home', {result: countValue})
})

const PORT = 3000 || process.env.PORT 

app.listen(PORT, ()=>{console.log(`Server starting in port ${PORT}. `)})


