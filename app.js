const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const ejs = require('ejs');
app.set('view engine', 'ejs');

const _ = require('lodash');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

require("dotenv").config()
const login = process.env.LOGIN;
const password = process.env.PASSWORD;

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${login}:${password}@cluster0.vicar3r.mongodb.net/blogDB`);

const postSchema = ({
  title: String,
  content: String
})
const Post = mongoose.model('Post', postSchema);


const homeStartingContent = 'Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.';
const aboutContent = 'Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.';
const contactContent = 'Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.';



app.get('/', (req, res) => {

  Post.find({}, (err, foundPosts) => {
    if (err) {
      console.error(err.message);
    } else {
      res.render('home', {
        homeContent: homeStartingContent,
        posts: foundPosts
      });
    }
  })
})

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent });
})

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent });
})

app.get('/compose', (req, res) => {
  res.render('compose')
})

app.post('/compose', (req, res) => {

  const title = _.upperFirst(req.body.postTitle);
  const link = _.camelCase(req.body.postTitle);
  const content = req.body.postBody;

  const newPost = new Post({
    title: title,
    content: content
  })

  newPost.save((err) => {
    if (!err) {
      res.redirect('/')
    }
  })
})


app.get('/post/:postId', (req, res) => {
  const reqPostId = req.params.postId;

  Post.findOne(({ _id: reqPostId }), (err, post) => {
    if (err) {
      console.error(err);
    } else {
      res.render('post', { postTitle: post.title, postContent: post.content })
    }
  })
})





app.listen(port, function () {
  console.log('Listening to the port ' + port);
});
