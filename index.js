const express=require("express");
const app=new express();
const bodyParser = require('body-parser');

var mysql = require('mysql2');
var userId;
//local sql
// host: "localhost",
// user: "root",
// password: "root",
// database: 'todo_app'
var con = mysql.createConnection({
  host: "containers-us-west-158.railway.app",
  user: "root",
  password: "WxLcZBeO0jHNLjUsdeZL",
  database: 'railway',
  port:7662
});



con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  const cors = require('cors');
  app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/",(req,res)=>{
    res.send("Running");
})

app.post("/getUser",(req,res)=>{
    con.query('SELECT * FROM todo_login where username="'+req.body.username+'" and password="'+req.body.password+'"', (err, rows, fields) => {
        if (err) throw err
        let dataLength=rows.length;
        if(dataLength==0)
        res.send("Invalid Username or Password");
        else
        {
            userId=rows[0]["userId"];

            con.query('SELECT * FROM todo_item where userId='+userId, (err_todoItem, rows_todoItem, fields_todoItem) => {
                if (err_todoItem) throw err_todoItem
                let dataLength_todoItem=rows_todoItem.length;
                if(dataLength_todoItem==0)
                res.send({"error":"No Todo Item"});
                else
                {
                   res.send(rows_todoItem)  
                }
            })
        }
    })
})

app.post("/getUserId",(req,res)=>{
    con.query('SELECT * FROM todo_login where username="'+req.body.username+'" and password="'+req.body.password+'"', (err, rows, fields) => {
        if (err) throw err
        let dataLength=rows.length;
        if(dataLength==0)
        res.send("Invalid Username or Password");
        else
        {
            userId=rows[0]["userId"];

                   res.send(userId.toString())  
                
        }
    })
})





app.post("/getToDoItems",(req,res)=>{
                con.query('SELECT * FROM todo_item where userId='+req.body.userId, (err_todoItem, rows_todoItem, fields_todoItem) => {
                if (err_todoItem) throw err_todoItem
                let dataLength_todoItem=rows_todoItem.length;
                if(dataLength_todoItem==0)
                res.send({"error":"No Todo Item"});
                else
                {
                   res.send(rows_todoItem)  
                }
            })
   
})



app.post("/addUser",(req,res)=>{
con.query("INSERT INTO todo_login (username, password) VALUES('"+req.body.username+"','"+req.body.password+"')", (err, rows, fields) => {
    if (err)
    {
        if(err.code=="ER_DUP_ENTRY")
        {
            res.send({"error":"Username Already Exists"});
        }
        else
        {
            res.send({"error":"Unknown Error"});
        }
    } 
    else
    {
        res.send(rows);
    }
    })
})


app.post("/addTodoItem",(req,res)=>{
    con.query("INSERT INTO todo_item (todoItem, userId) VALUES('"+req.body.todoItem+"',"+userId+")", (err, rows, fields) => {
        if (err)
        {
            res.send("Todo Item can not be added");
        } 
        else
        {
            res.send(rows);
        }
    })
})

app.post("/editTodoItem/:todoId",(req,res)=>{
    let currTodoId=req.params['todoId'];
    con.query("UPDATE todo_item SET todoItem='"+req.body.todoItem+"' WHERE todoId="+currTodoId, (err, rows, fields) => {
        if (err)
        {
            res.send("Todo Item can not be edited");
            //res.send(err);
        } 
        else
        {
            res.send(rows);
        }
    })
})

app.get("/deleteTodoItem/:todoId",(req,res)=>{
    let currTodoId=req.params['todoId'];
    con.query("DELETE FROM todo_item WHERE todoId="+currTodoId, (err, rows, fields) => {
        if (err)
        {
            res.send("Todo Item can not be deleted");
        } 
        else
        {
            res.send(rows);
        }
    })
})
  

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is started on ${PORT}`);
});