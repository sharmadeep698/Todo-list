const express = require("express")
const bodyPraser = require("body-parser")
const app = express();
const _ = require('lodash');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

app.use(express.static("public"))
app.set('view engine','ejs');
app.use(bodyPraser.urlencoded({extended:true}))
// let DefaultIteams=["cook food ","buy food" , "eat food"]
let workIteams=[];
// app.use(bodyPraser)

mongoose.connect('mongodb+srv://admin-deep:dreamdeep3@cluster0-ziicf.mongodb.net/Todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const itemsSchema = {
	name:String
	}
const Item = mongoose.model("Item", itemsSchema );
const listsSchema ={
	name:String,
	iteams:[itemsSchema]
} 
const List = mongoose.model("List", listsSchema );

// default Arry
const  item1 = new Item({
		name : "Welcome To your TODOLIST! "
			})
		const item2 = new Item({
			name:"Hit the + button to add a new item"
			})
		const item3 = new Item({
			name:"<-- Hit this to delete item "
			})
		const arrItem = [item1,item2,item3]

app.get("/",(req,res)=>{
	Item.find(({}),(err,result)=>{
	if (result.length === 0){
		console.log("call")
		
			Item.insertMany(arrItem,(err)=>{
				if (err){console.log(err)} else{
					console.log("Successful adding")
					}		
				res.redirect("/")
				})
			
			}else {
	res.render("list",{TitleDay:"day" ,list:result}) }
	if(err){
		alert("error while updating data ")
	}
})
	// console.log(iteams)
	

})
app.post("/",(req,res)=>{
 const iteamName = req.body.work
 const NameList = req.body.button //Returns the name of page 
 // console.log(NameList)  
 const item = new Item({
 		name:iteamName 
 			})
 if (NameList === "day") {
	item.save()
 	res.redirect("/");
 }
 else{
	List.findOne({name:NameList}, (err,result)=>{
 			if(err){console.log(err)} 
 				else{
 				result.iteams.push(item)
 				 result.save()
 				 res.redirect(`/${NameList}`)
 			}
 		})


 }
 	
 	

})
app.post("/delete" ,(req,res)=>{
	const itemObj = req.body.checkbox
	const Title = req.body.Title
if (Title === "day"){
	// console.log(req.body.checkbox)
	Item.deleteOne({ _id:itemObj }, function (err) {
  if (err) {handleError(err)} 
  	// else{console.log("sucessfully removed")} the data is being removed 
 	res.redirect("/")
});
}  else{
	List.findOneAndUpdate( {name:Title}, { $pull:{iteams:{_id:itemObj}}},function(err,result){ 
	if (!err){
		res.redirect(`/${Title}`)
	}else{
		console.log(err)
	}
})
}

})
app.get("/:id",(req,res)=>{

const ListName = _.capitalize(req.params.id)
	List.findOne({name:ListName},(err,result)=>{
	if(err){console.log(err)} else{
	if (result)
		{res.render("list",{TitleDay:ListName,list:result.iteams})}
	else{ 
	const list = new List({
		name:ListName,
		iteams: arrItem
	})
	list.save()
	res.redirect(`/${ListName}`) 
	}
	}
	})
	


})
app.listen(3000,()=>{
	console.log("app is listing ")
})