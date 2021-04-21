const file = require('fs')
const cors = require('cors')
const util = require('util')
const express = require('express')
const app = express()

const port = 3000

const stream = require('stream')
const config = require('./config.json')

//const BALEFILE = '/mnt/usb/bales.txt'

let d = new Date();
let today = `${d.getMonth()}${d.getDate()}${d.getFullYear()}`

const BALEFILE = `baledata/bales${today}.txt`
const LOGFILE = 'log.log'

app.use(cors());
app.use(express.json())

var log = (d) => {
 
	let time = new Date()
	logFile.write(time.toLocaleString() + util.format(d) + '\n')
	process.stdout.write(util.format(d) + '\n')
}


app.post("/",(req,res) => {
    log("Got bale info :" + req.body.time + " " + req.body.tag + " " + req.body.weight);

    outFile.write(`${req.body.time},${req.body.tag},${req.body.weight}\n`);
    //TODO here write the bales json in body into a filesmtream of bales.txt
    res.send()
})

app.get('/gin', (req, res) => {


    res.send(config);


})



app.get('/today', (req, res) => {


    file.readFile(BALEFILE, 'utf8', (err, data) => {

        if (err){
           log("Read error:"+ err)
            return;
            
        } 


        let lines = data.trim().split("\n");

	console.log("Lines after split are", lines)

	//check necessary to prevent empty file being read as spurious bale    
        if(lines[0].length == 1) lines = []


        let bales_data = {};
        let bales_list = []

        for(let i = 0; i < lines.length; i++){
            let item = lines[i].split(",");

            // let d = new Date()
            // let cutoff = d.getTime() - (1000 * 60 * 60);        //in response to GET /latest send bales from previous 1 hr


                let bale_interval = 0;

                if(i > 0){
                    bale_interval =item[0] -  bales_list[i -1].time;  //time since last bale in milliseconds
                }

                bales_list.push({time: item[0], tag: item[1], weight: item[2], interval: bale_interval});
            
        }

        bales_data.bales = {list: bales_list};

        res.send(bales_data);
    });

});


app.listen(port, () => log(`Bale watch server listening at http ://localhost:${port}`));


const outFile = file.createWriteStream(BALEFILE, {flags:'a'},err =>{
    log("Create write err" + err)
} );

const logFile = file.createWriteStream(LOGFILE, {flags:'a'}, err => {
	log("Create log file error" + err)
} );

