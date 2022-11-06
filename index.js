const express = require("express")
var cors = require('cors')
const connection = require("./Config/db")
const UserModel = require("./models/UserModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authentication } = require("./middlewares/authentication");
const { BMIModel } = require("./models/BIMModel");
require('dotenv').config()
const PORT = process.env.PORT || 4000

const app= express()
app.use(express.json())

app.use(cors())
app.get("/", (req,res)=>{
    res.send("hello")
})

//signup
app.post("/signup", async (req,res)=>{
    const {name,email,password}= req.body
    
    //if user already exists
    const isUser= await UserModel.findOne({email})
    if(isUser){
        res.send({"mssg":"User already exixts"})
    }
   else{
    bcrypt.hash(password, 6,async function(err, hash) {
        // Store hash in your password DB.
        if(err){
            res.send({"mssg":"Something went gone wrong"})
        }
        const new_user= new UserModel({name,email,password:hash})

        try{
            await new_user.save()
            res.send({"mssg":"Signup Succesfull"})
        }catch(err){
            console.log(err)
            res.send({"mssg":"Wrong"})
        }
       
    })
   }

  
  });
    
   
//login
app.post("/login", async (req,res)=>{
    const {email, password}= req.body
    const user= await UserModel.findOne({email})
    const hash=user.password
    //id
    const userId= user._id

    bcrypt.compare(password, hash, function(err, result) {
        if(err){
            res.send({"msg" : "Something went wrong, try again later"})
          }

        // result == true
       if(result)
       {
        const token = jwt.sign({userId}, process.env.SECRET_KEY);
        console.log(token)
        res.send({"msg":"Login Sucessfully", "token":token})
       }
       else{
        res.send({"mssg":"Invalid User"})
       }

    });
    

})


//profile
app.get("/getProfile",authentication,async (req,res)=>{

    const {user_id}= req.body
    const user=await  UserModel.findOne({_id:user_id})
    const {name,email}= user
    console.log(user)
   res.send({name,email})

}) 

//calculate
app.post("/calculateBMI", authentication, async(req,res)=>{
    const {height, weight,user_id}= req.body;
    const height_meter= Number(height) * 0.3048
    const BMI= Number(weight)/(height_meter)**2

    //model
    const new_bmi= new BMIModel({
        BMI, height:height_meter, weight, user_id
    })
    await new_bmi.save()
    res.send({BMI})
})

//get calculation
app.get("/getCalculation", authentication, async(req,res)=>{
    const {user_id}= req.body
    const all_bmi= await BMIModel.find({user_id:user_id})
    res.send({history:all_bmi})

})



app.listen(PORT, async ()=>{
    try{
        await connection
        console.log("connect to DB Server")
    }catch(err){
        console.log(err)
    }
    console.log(`listening on Port ${PORT}`)
})