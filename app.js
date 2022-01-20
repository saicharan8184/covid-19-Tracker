const express=require("express");
const https=require("https");
const parser=require("body-parser");
const ejs=require("ejs");


const app=express();

app.use(parser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/",function(req,res){
  res.render("home");
});

app.post("/data",function(req,res){
  const query=req.body.countryname;
  const url="https://api.covid19api.com/summary";

  https.get(url,"JSON",function(response){
    console.log(response.statusCode);
    var data;
    response.on("data",function(chunk){
      if(!data)
      {
        data=chunk;
      }
      else{
        data+=chunk;
      }
    });
    response.on("end",function(){
      var i=0;
      const globalData=JSON.parse(data);
      var country=globalData.Countries[i].Country;
      while(country!==query)
      {
        i+=1;
        country=globalData.Countries[i].Country;
      }
      res.render("datum",{data:globalData.Countries[i]})
    })
  })
})


app.listen(2000,function(){
  console.log("server started at port 2000");
});
