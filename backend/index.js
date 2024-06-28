const express= require("express"); 
const app=express()  ; 
const cors=require("cors") ;  
const port=300; 

app.get("/",(req,res)=>{
  return res.json("hii ffrom api")
})
  
app.listen(port,()=>{
  console.log(`server is start at ${port}`)
})