const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')

const app = express()

app.set('view engine','ejs')

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

mongoose.connect('mongodb://127.0.0.1/wikiDB')

const articleSchema = ({
    title: String,
    content: String
})

const Article = new mongoose.model('Article',articleSchema)

app.route("/articles")

.get((req,res) => {
    Article.find()
    .then(function (foundArticles) {
        res.send(foundArticles)
      })
      .catch(function (err) {
        console.log(err)
      })
})

.post((req,res) => {

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save()
    .then(function () {
        res.send("Successfully added a new article.")
      })
      .catch(function (err) {
        console.log(err)
      })
})

.delete((req,res) => {
    Article.deleteMany()
    .then(function () {
        res.send("Successfully deleted all articles.")
      })
      .catch(function (err) {
        console.log(err)
      })
})

app.route("/articles/:articleTitle")

.get((req,res) => {

    Article.findOne({title: req.params.articleTitle})
    .then(function (foundArticle) {
        if(foundArticle){
        res.send(foundArticle)
        }else{
            res.send("No article found") 
        }
      })
      .catch(function (err) {
        console.log(err)
      })
})

.put(async (req,res) => {
  await Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title: req.body.title, content: req.body.content})
    .then(function (updatedDoc) {
      res.send("Successfully updated doc " + updatedDoc)
    })
    .catch(function (err) {
      console.log(err)
    })
})

.patch((req,res) => {
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set: req.body})
    .then(function () {
          res.send("Successfully patched article.") 
      })
    .catch(function (err) {
      console.log(err)
    })
})

.delete((req,res) => {
  Article.deleteOne({title:req.params.articleTitle})
    .then(function () {
          res.send("Successfully deleted article.") 
      })
    .catch(function (err) {
      console.log(err)
    })  
})

app.listen(3000, () => {console.log("Server started on port 3000")})
