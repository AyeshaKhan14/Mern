const mongoose= require("mongoose")

const bmi= new mongoose.Schema({
    BMI:{type:String , required:true},
    height:{type:String , required:true},
    weight:{type:String , required:true},
    user_id:{type:String , required:true}
})

const BMIModel= mongoose.model("BMI", bmi)

module.exports= {BMIModel}