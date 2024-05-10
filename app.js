const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.set("view engine" , "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.get("/" , function(req, res){
    var arr = [];
    fs.readdir(`./files`, function(err, files) {
        files.forEach(function(file){
            var data = fs.readFileSync(`./files/${file}`, 'utf8');
            arr.push({name:file, details:data});
        })
        res.render("index", {files:arr});
    })
});

app.get("/", function(req, res) {
    res.redirect("index");
});


app.get("/read/:filename", function(req, res){
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename);

    fs.readFile(filePath, 'utf8', function(err, data){
        if(err) return res.status(500).send(err);
        res.render("read", { filename: filename , fileContent: data });
    });
});

app.get("/edit/:filename", function(req, res){
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename);

    fs.readFile(filePath, 'utf8', function(err, data){
        if(err) return res.status(500).send(err);
        res.render("edit", { filename: filename , fileContent: data });
    });
});


app.get("/delete/:filename", function(req,res){
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'files', filename);

    fs.unlink(filePath, function(err) {
        if(err) return res.status(500).send('Error deleting file.');
         else  res.redirect("/");
    });
})

app.post("/create", function(req, res){
    var fn = req.body.name.split(' ').join('')+'.txt';
    fs.writeFile(`./files/${fn}` , req.body.details, function(err){
        if(err) return res.status(500).send(err);
        else res.redirect("/");
    })
});

app.post("/update/:filename", function(req, res){
    const filename = req.params.filename;
    fs.writeFile(`./files/${filename}` ,req.body.details, function(err){
        if(err) return res.status(500).send(err);
        else res.redirect("/");
    })
});

app.listen(3000);
