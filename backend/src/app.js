const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const publicPath = path.join(__dirname,'./public')

const locationsPath = fs.readFileSync('./public/locations.json','utf-8')

app.use(express.static(publicPath))
app.use(cors())




app.get('/api/locations', async(req,res)=>{
    const location =await JSON.parse(locationsPath)
    // console.log('locations',location);
    
    res.json(location)
})

app.listen(port,()=>console.log(`server started at port no ${port}`)
)


  