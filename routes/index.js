const express = require('express');
const fs = require('fs');
const mydata = require('../data.json');
const count = require('../counterid.json');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('welcome');
  });

router.get('/index-promotion', function(req, res, next) {
    var sample = [];
      //mydata.forEach(function(item){
      //  sample = sample.concat(item);
      //});

      for (let oned of mydata) {
        sample = sample.concat(oned);
      }
      res.render('index', {data:sample});
});

/* Add data. */
router.post('/add', (req, res) => {
  // We will be coding here
    var errors = [];
    var id;
    var generateId = function (prefix, start) {
      var i = start || 0;
      return function() {
          return prefix + i++;
      };
    };
    
    var data_old = {
      "ticket" : req.body.ticket,
      "title" : req.body.title,
      "country" : req.body.country,
      "startdate" : req.body.startdate,
      "enddate" : req.body.enddate
    };

    if ((Date.parse(req.body.startdate) >= Date.parse(req.body.enddate))) {
      errors.push("End date should be greater than Start date");
    }
    if (errors.length>0){
      res.render("promotions", { data:data_old, errors : errors});
    } else {
      id = generateId("idofobject_", count.counter); // start the counter at increment
    }
    
    var c = count.counter++;
    fs.writeFile("counterid.json", JSON.stringify(count), err => { 
      // Checking for errors 
      if (err) throw err;
    });
      var genid = id();
      // Output the book to the console for debugging
      let data = {
        "id" : genid,
        "ticket" : req.body.ticket,
        "title" : req.body.title,
        "country" : req.body.country,
        "startdate" : req.body.startdate,
        "enddate" : req.body.enddate
      };
      mydata.push(data);
      fs.writeFile("data.json", JSON.stringify(mydata, null, 2), err => { 
        // Checking for errors 
        if (err) throw err;  
        console.log("Done writing"); // Success 
      });
      req.flash('success_msg', "Homepage Promotion added");
      res.redirect('/index-promotion');
});

router.get('/edit/:id', (req, res) => {
  let idea = req.params.id;
    // Searching id for the with param
    for (let oned of mydata) {
      if (oned.id === idea) {
          res.render('promotion-update', {data:oned});
          return;
      }
    }

  // Sending 404 when not found something is a good practice
  res.status(404).send('data not found');

});

router.post('/update/:id', (req, res) => {
  var errors = [];
  let idea = req.params.id;
    if ((Date.parse(req.body.startdate) >= Date.parse(req.body.enddate))) {
      errors.push("End date should be greater than Start date");
    }
    if (errors.length>0){
      for (let oned of mydata) {
        if (oned.id === idea) {
            res.render('promotion-update', {data:oned,errors:errors});
            return;
        }
      }
    } else {
    var newid = req.params.id;
    //Searching id for the with param
      mydata.forEach(cold => {
        if(cold.id == newid){
          var tbd = mydata.indexOf(cold);
          mydata.splice(tbd,1);
        }
      });
      let data = {
        "id" : req.params.id,
        "ticket" : req.body.ticket,
        "title" : req.body.title,
        "country" : req.body.country,
        "startdate" : req.body.startdate,
        "enddate" : req.body.enddate
      };
      mydata.push(data);
      fs.writeFileSync("data.json", JSON.stringify(mydata, null, 2), err => { 
        // Checking for errors 
        if (err) throw err;  
        console.log("Done Update"); // Success 
      });
      req.flash('success_msg', "Homepage Promotion Updated");
      res.redirect("../index-promotion");
    }
});

router.post('/delete/:id', (req, res) => {
    var newid = req.params.id;
    // Searching id for the with param
      mydata.forEach(cold => {
        if(cold.id == newid){
          var tbd = mydata.indexOf(cold);
          mydata.splice(tbd,1);
        }
      });
      fs.writeFileSync("data.json", JSON.stringify(mydata, null, 2), err => { 
        // Checking for errors 
        if (err) throw err;  
        console.log("Done Update"); // Success 
      });
      req.flash('success_msg', "Homepage Promotion removed");
      res.redirect("../index-promotion");
});

router.get('/promotions', (req, res) => {
  
  var blankd = {
    "ticket" : "",
    "title" : "",
    "country" : "",
    "startdate" : "",
    "enddate" : ""
  };

  res.render('promotions', {data:blankd});
});

router.get('/index-teaser', (req, res) => {
  res.render('teasers');
});

module.exports = router;
