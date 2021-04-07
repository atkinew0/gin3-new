const file = require('fs')
const cors = require('cors')

const express = require('express')
const app = express()

const port = 3000

const stream = require('stream')
const config = require('./config.json')

//const BALEFILE = '/mnt/usb/bales.txt'
const BALEFILE = 'bales.txt'


app.use(cors());
app.use(express.json())


app.post("/",(req,res) => {
    console.log("Got info :", req.body);

    outFile.write(`${req.body.time},${req.body.tag},${req.body.weight}\n`);
    //TODO here write the bales json in body into a filesmtream of bales.txt
    res.send()
})

app.get('/gin', (req, res) => {


    res.send(config);


})



app.get('/latest/:cutoff', (req, res) => {

    let cutoff = parseInt(req.params.cutoff);
    console.log("Hit latest cutoff route");

    file.readFile(BALEFILE, 'utf8', (err, data) => {

        if (err){
            console.log("Read error:", err)
            return;
            
        } 


        let lines = data.trim().split("\n");
        let bales_data = {};
        let bales_list = []

        for(let i = 0; i < lines.length; i++){
            let item = lines[i].split(",");

            // let d = new Date()
            // let cutoff = d.getTime() - (1000 * 60 * 60);        //in response to GET /latest send bales from previous 1 hr

            if(item[0] > cutoff){


                let bale_interval = 0;

                if(i > 0){
                    bale_interval =item[0] -  bales_list[i -1].time;  //time since last bale in milliseconds
                }

                bales_list.push({time: item[0], tag: item[1], weight: item[2], interval: bale_interval});
            }
        }

        bales_data.bales = {list: bales_list};

        res.send(bales_data);
    });

});


app.listen(port, () => console.log(`Example app listening at http ://localhost:${port}`));


const outFile = file.createWriteStream(BALEFILE, {flags:'a'},err =>{
    console.log("Create write err",err)
} );

