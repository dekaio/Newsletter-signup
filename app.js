const express = require("express");
const bodyParser =require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",(req, res)=>{
    res.sendFile(`${__dirname}/signup.html`);
});
app.post("/", (req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members:[
            {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = 'https://us10.api.mailchimp.com/3.0/lists/559380493';//change url
    const options = {
        method: "POST",
        auth: "vivian:dcf0fc339998797d3545459edf333111ae-us10";//change auth

    }
   const request =  https.request(url, options, function(response){
        if (response.statusCode === 200 ){
            res.sendFile(__dirname+"/success.html");
        } else{
            res.send(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

    //res.send('Received data');
})

app.post("/failure", (req, res)=>{
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is listening on port 3000");
})
