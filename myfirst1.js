var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "S@21011999",
  database: "mydb"
});

var bodyParser = require('body-parser');
var express = require('express');
var session     =   require('express-session');
var url = require('url');
var path = require('path');
var fs = require('fs');
var app = express();

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

//app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.post('/sign_up', function (req, res) {
  //res.send('hello world');
  //var url_parts = url.parse(req.url, true);
  //var query = url_parts.query;
  var club_name = req.body.clubName_s;
  var name = req.body.userid_s;
  var password = req.body.p1_s;
  var email = req.body.e1_s;
  console.log(password);
  
  con.connect(function(err) {
    //if (err) throw err;
    console.log("Connected!");
  //Make SQL statement:
    var sql = "INSERT INTO user (club_name, username, password, email) VALUES ?";
  //Make an array of values: 
    var values = [
      [club_name, name, password, email]
    ];
  //Execute the SQL statement, with the value array:
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      res.send({ redirect : '/' });
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });
});

app.post('/name',function(req, res){
  var name=req.body.name;
  var flag;
  console.log(req.body.name);
  var sql = 'SELECT * FROM user WHERE username = ?';
  con.query(sql, [name], function (err, result) {
    if (err) throw err;
    else if (result.length>0) {
     console.log('User name already taken!!!!');
     console.log('dusara naam lee!!!!');
     flag=1;
    }
    else {
    	console.log('nahi hai');
    	res.status(301).end();
    }
  });
  if(flag == 1){
     res.status(200).end();
  }

});

app.post('/login', function (req, res) {
	var person;
	var i;
	var name = req.body.name;
	var password = req.body.password;
	console.log(name);
	
	con.connect(function(err) {
    	console.log("Connected!");
		var sql = 'SELECT * FROM user WHERE username = ?';
		//Execute the SQL statement, with the value array:
		con.query(sql, [name], function (err, result) {
			//if (err) throw err;
				if(result[0].password==password){
					console.log('Login Successful');			
					person=1;	
					//res.locals.username = name;
					res.send({redirect:'/successLoginCM/'+name });
					//res.redirect('/successLoginCM');
				}
				else console.log('Incorrect password');
			//con.end();
		}); 
	});
});

app.post('/loginFaculty', function (req, res) {
  var person;
  var i;
  var name = req.body.name;
  var password = req.body.password;
  console.log(name);
  
  con.connect(function(err) {
      console.log("Connected!");
    var sql = 'SELECT * FROM faculty WHERE name = ?';
    //Execute the SQL statement, with the value array:
    con.query(sql, [name], function (err, result) {
      //if (err) throw err;
        if(result[0].password==password && result[0].Emp_id != "00000"){
          console.log('Login Successful');      
          res.send({redirect:'/successLoginFC/'+name });
          //res.redirect('/successLoginCM');
        }
        else if(result[0].password==password && result[0].Emp_id == "00000"){
          console.log("lodo aayo");
          res.send({redirect:'/successLoginADSW/'+name });
        }
        else console.log('Incorrect password');
      //con.end();
    }); 
  });
});

app.get('/successLoginCM/:name',function(req,res){
  console.log('CM');
  res.render(path.join(__dirname+'/login1.html'),{ myvar: req.params.name });
});

app.get('/successLoginFC/:name',function(req,res){
  console.log('FS');
  var f_name = req.params.name;
  var Ename = [];
  con.connect(function(err) {
      console.log("Connected!");
      var sql = 'SELECT * FROM event WHERE E_FCN = ? and E_Permission IS NULL';
      //Execute the SQL statement, with the value array:
      con.query(sql, [f_name], function (err, result) {
        //if (err) throw err;
        for(i=0;i<result.length;i++){
          var elem = new Object();
          elem["Event"] = result[i].Event_Name;
          console.log(elem);
          Ename.push(elem);
          //Ename.push(result[i].Event_Name);
        }
        console.log(Ename);
        res.render(path.join(__dirname+'/login2.html'),{ myvar: req.params.name, Event_Name: Ename });
      }); 
      
  });
  
});

app.get('/successLoginADSW/:name',function(req,res){
  console.log('ADSW');
  var f_name = req.params.name;
  var Ename = [];
  con.connect(function(err) {
      console.log("Connected!");
      var sql = 'SELECT * FROM event WHERE E_Permission="Approve"';
      //Execute the SQL statement, with the value array:
      con.query(sql, [f_name], function (err, result) {
        //if (err) throw err;
        for(i=0;i<result.length;i++){
          var elem = new Object();
          elem["Event"] = result[i].Event_Name;
          console.log(elem);
          Ename.push(elem);
          //Ename.push(result[i].Event_Name);
        }
        console.log(Ename);
        res.render(path.join(__dirname+'/login4.html'),{ myvar: req.params.name, Event_Name: Ename });
      }); 
      
  });
  
});

app.get('/successLoginS',function(req,res){
  console.log('S');
  res.sendFile(path.join(__dirname+'/login3.html'));
});


app.post('/EventRegister',function(req,res){
	var n = req.body.n;
	var E_N = req.body.E_Name;
	var E_D = req.body.E_Date;
	var E_D1 = req.body.E_Desc;
	var E_T = req.body.E_Time;

	var E_P = req.body.Expected_Participants;
	var V = req.body.Venue;
	var R = req.body.Room;
	var G_D = req.body.Guest_Details;
	var Bud = req.body.BudgetE;
	var Spo = req.body.SponsorsE;

	var SCN = req.body.SCNE;
	var RN = req.body.SCRN;
	var SMN = req.body.SCMN;
	var SEI = req.body.SCEI

	var FCN = req.body.FCNE;
	var EID = req.body.FEID;
	var FMN = req.body.FCMN;
	var FEI = req.body.FCEI;

	console.log(n+" "+E_N);
	con.connect(function(err) {
    //if (err) throw err;
    	console.log("Connected!");
  //Make SQL statement:
    	var sql = "INSERT INTO event (Login_name, Event_Name, Event_Date, Event_Time, Event_Desc, Exp_Parti, Event_Venue, Event_RNo, Guest_Det, Event_Bud, Event_Spo, E_SCN, E_SCRN, E_SCMN, E_SCEI, E_FCN, E_FEID, E_FMN, E_FCEI) VALUES ?";
  //Make an array of values: 
    	var values = [
      		[n, E_N, E_D, E_T, E_D1, E_P, V, R, G_D, Bud, Spo, SCN, RN, SMN, SEI, FCN, EID, FMN, FEI]
    	];
  //Execute the SQL statement, with the value array:
    	con.query(sql, [values], function (err, result) {
      			//if (err) throw err;
      			console.log("Number of records inserted: " + result.affectedRows);
      			res.status(200).end();
    	});

  	});
});

app.post('/EventInfo',function(req,res){
  var Event = req.body.Event;
  con.connect(function(err) {
      console.log("Connected!");
      var sql = 'SELECT * FROM event WHERE Event_Name = ?';
      //Execute the SQL statement, with the value array:
      con.query(sql, [Event], function (err, result) {
        //if (err) throw err;
        var data = JSON.stringify(result);
        res.status(200).end(data);
      }); 
  });
});

app.post('/EventInfoDate',function(req,res){
  var E_date = req.body.date;
  console.log(E_date);
  con.connect(function(err) {
      console.log("Connected!");
      var sql = 'SELECT * FROM event WHERE Event_Date = ? and ADSW_per = "Approve";';
      //Execute the SQL statement, with the value array:
      con.query(sql, [E_date], function (err, result) {
        //if (err) throw err;
        console.log(result);
        var data = JSON.stringify(result);
        res.status(200).end(data);
      }); 
  });
});

app.post('/Faculty',function(req,res){
  var f_message = req.body.F_M;
  var p = req.body.Permission;
  var Event = req.body.Event_Name;
  var f_name = req.body.Faculty_Name;
  con.connect(function(err) {
      console.log("Connected!");
      var sql = 'UPDATE event SET E_Permission = ?,F_Message = ? WHERE Event_Name = ? and E_FCN = ?';
      //Execute the SQL statement, with the value array:
      con.query(sql, [p,f_message,Event,f_name], function (err, result) {
        //if (err) throw err;
        //var data = JSON.stringify(result);
        res.status(200).end();
      }); 
  });
});

app.post('/ADSW',function(req,res){
  var p = req.body.Permission;
  var Event = req.body.Event_Name;
  con.connect(function(err) {
      console.log("Connected!");
      var sql = 'UPDATE event SET ADSW_per = ? WHERE Event_Name = ?';
      //Execute the SQL statement, with the value array:
      con.query(sql, [p,Event], function (err, result) {
        //if (err) throw err;
        //var data = JSON.stringify(result);
        res.status(200).end();
      }); 
  });
});

app.post('/EventCalender',function(req,res){
  var d = new Date();
  var m = d.getMonth();
  var Event = [];
  console.log(m);
  con.connect(function(err){
    console.log("Connected!");
    var sql = 'SELECT Event_Name,Event_Date FROM event  where ADSW_per = "Approve";';
    con.query(sql,function(err, result){
      console.log(result);
      if(result != []){
        for(var i=0;i<result.length;i++){
          var msec = Date.parse(result[i].Event_Date);
          var E_d = new Date(msec);
          var E_month= E_d.getMonth();
          console.log(E_month);
          if(E_month==m){
            console.log(result[i].Event_Name);
            var elem = new Object();
            elem["E_Name"] = result[i].Event_Name;
            elem["E_Date"] = result[i].Event_Date;
          }
          Event.push(elem);
        }
      }
      console.log(Event);
      var data = JSON.stringify(Event);
      console.log(data);
      res.status(200).end(data);
    });
  });
});

app.post('/logout',function(req,res){    
  req.session.destroy(function(err){  
      if(err){  
          console.log(err);  
      }  
      else  
      {  
          res.end(JSON.stringify({"redirect":'/'}));
          //res.redirect('/');  
      }  
  });
});

app.get('/EventHistory/:name',function(req,res){
  var n = req.params.name;
  console.log(n);
  var Ename = [];
   con.connect(function(err) {
      console.log("Connected!");
      var sql = 'SELECT Event_Name,E_Permission,ADSW_per FROM event WHERE Login_name = ?';
      //Execute the SQL statement, with the value array:
      con.query(sql, [n], function (err, result) {
        //if (err) throw err;
        //var data = JSON.stringify(result);
        for(i=0;i<result.length;i++){
          var elem = new Object();
          elem["Event"] = result[i].Event_Name;
          elem["F_Per"] = result[i].E_Permission;
          elem["A_Per"] = result[i].ADSW_per;
          console.log(elem);
          Ename.push(elem);
          //Ename.push(result[i].Event_Name);
        }
        console.log(Ename);
        res.render(path.join(__dirname+'/History.html'),{ myvar: req.params.name, Event_Name: Ename });
        //res.status(200).end(data);
      }); 
  });
});

app.listen(3000);