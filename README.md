# A Naive DNA Generation Algorithm

### But what isn't?

## Install
```
$ npm install
```
## Run
```
$ node app.js 9001
```

An example of Express, ChildProcess, Endpoints, Middleware (check out morgan logger, 
gets called on every endpoint), Mongoose and MongoDB. AngularJS frontend app
coming soon.

# AngularJS Tutorial
### *From The Ground Up*

First, make sure you are on the `pre-angular` branch:
~~~bash
$ git clone https://thejmazz/naivednageneration.git
$ cd naivednageneration
$ git checkout pre-angular
~~~

Now we have a RESTful API with two endpoints, and we will build the frontend app using AngularJS.
First, we need to make a folder for `static` content. This can be served easily from Node, and 
essentially allows us to make a simple html website. So:

~~~bash
$ mkdir public
$ cd public
$ touch index.html
~~~

Fill your `index.html` file as so:

~~~html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title></title>
    
    <!-- bower:css -->
    
    <!-- endbower -->
</head>

<body>
    <h1> Our First AngularJS app! </h1>
    
    <!-- bower:js -->
    
    <!-- endbower -->
</body>

</html>
~~~

Then to serve this from Node, add the following to the end of `app.js`:

~~~js
app.use(express.static('public'));
~~~

Start the server:
~~~bash
$ node app.js 9001
~~~

And visit the page at `http://localhost:9001`. You should see a white page with the text 'Our First AngularJS app!'.

From inside `public`, run
~~~bash
$ bower init
~~~
Change the name if you'd like, just enter through everything else.
