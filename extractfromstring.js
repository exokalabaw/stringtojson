import longstring from './longstring.js';
import express from 'express'
const app = express();
const port = 8000;

let stringToArray = [...longstring]/*.filter(i=>i !== " ")*/


const newArray = []
let tempObject = {price:null, date:null}
let currentKey = "price"
const monthString = {'Jan':1,'Feb':2,'Mar':3,'Apr':4,'May':5,'Jun':6,'Jul':7,'Aug':8,'Sep':9,'Oct':10,'Nov':11,'Dec':12}
const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
const dayHalves = {'AM':1,'PM':2}
const monthsOnly = Object.keys(monthString)

const fampm = (a) =>  a.substring(a.length -2 )
const ftime = (b) => b.slice(-8, -6)
const ffullDate = (c) => c.slice(0,6).trim().replace(',','')
const fmDate = (d) => parseInt(d.slice(4, d.length ))
const fmonth = (e) => e.slice(0,3)


function addToObject(ck,item){
  if(ck === "price"){
    tempObject.price = tempObject.price ? tempObject.price + item : item
  }else{
    let g = item === ","? ", ":item
    tempObject.date = tempObject.date ? tempObject.date + g : g
  }
}

function sorter(a,b){
	 if(a.month !== b.month){
   	return monthString[a.month] - monthString[b.month]
   }
   if(a.day !== b.day){
   	return a.day - b.day
   }
   if(a.ampm !== b.ampm){
   	return dayHalves[a.ampm] - dayHalves[b.ampm]
   }
   return a.hour - b.hour
   
  
}
function dateProcess(dateString){
	const ampm =  fampm(dateString)
  const time = ftime(dateString)
  const minutes = dateString.slice(-5,-3)
  const fullDate = ffullDate(dateString)
  const mDate = fmDate(fullDate)
  const month = fmonth(fullDate)
  const monthNumMinus = monthsOnly.indexOf(month) -1
  let newObject = {}
	if (ampm === "AM" && time === "12") {
  	if(mDate === 1){
    	
    	/*return monthsOnly[monthNumMinus] + ", "+ monthDays[monthNumMinus] +", 2021, 11:"+minutes+" PM"*/
		newObject = {month: monthsOnly[monthNumMinus], day:monthDays[monthNumMinus], hour: 11, ampm: "PM"}
      
    }else{
    	let nd = mDate - 1
      /*return month + " " + nd +", 2021, 11:"+minutes+" PM"*/
      newObject = {month: month, day:nd, hour: 11, ampm: "PM"}
    }
  }else{
  	/*return dateString*/
    newObject = {month: month, day:mDate, hour: time -1, ampm: ampm}
  }
  if (newObject.hour === 12){
  	newObject.hour = 0
  }
  return newObject
}

stringToArray.map(i=>{
	if((currentKey === "price") && (!isNaN(i)|| i ==="$" || i === ".")){
  	currentKey = "price";
    addToObject(currentKey,i)
  }else if(currentKey === "date" && i === '$'){
    currentKey = "price"
    const mstremoved =  tempObject.date.trim().replace(' MST','')
    tempObject.price = tempObject.price.trim()
    tempObject.month = dateProcess(mstremoved).month
    tempObject.day = dateProcess(mstremoved).day
    tempObject.hour = dateProcess(mstremoved).hour
    tempObject.ampm = dateProcess(mstremoved).ampm
    newArray.push(tempObject)
    tempObject = {}
    addToObject(currentKey,i)
  }else{
  	currentKey = "date"
    addToObject(currentKey,i)
  }
})
newArray.sort((a,b) => sorter(a,b))


app.get('/', (req, res) => {
    res.json(()=> newArray)
  });
  
app.listen(port, () => {
    console.log(newArray)
  });


