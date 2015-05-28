# A Naive DNA Generation Algorithm

### But what isn't?

## Install

~~~bash
$ npm install
$ cd public; bower install
~~~

## Run

~~~bash
$ node app.js 9001
~~~

An example of Express, ChildProcess, Endpoints, Middleware (check out morgan
logger, gets called on every endpoint), Mongoose and MongoDB. AngularJS frontend
app coming soon.

# NodeJS/Express/Mongoose Tutorial

#### *in progress*

Read the source! It is commented and filled with links to external resources.

First thing to do is set up our NodeJS/Express environment:

~~~bash
$ npm init
$ npm install --save express body-parser child-process mongoose morgan colors
~~~

`npm init` will create a `package.json` file. `npm install` will download our
dependencies into the `node_modules` folder. The `--save` option ensures
the dependencies will be added to the `dependencies` object within the
`package.json` file. Now let's create a basic app that responds to a `GET` and
`POST` http request at the root route. Create `app.js` as follows:

~~~js
var express = require('express');
var port = process.argv[2];
var app = express();

app.get('/', function(request, response) {
    res.send('got a GET request');
});

app.post('/', function(req, res) {
    res.send('got a POST request');
});

app.listen(port);
console.log('Express server listening on port ' + port);
~~~

Open up the [Postman - REST Client](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)
chrome app. You *cannot* test `POST` requests easily from your browser's
navigation bar. Instead, Postman allows you to easily send any http request to
a url and easily provide headers and other useful data. Point Postman to
`http://localhost:9001/` and choose `GET` from the dropdown. Click send. Notice
that the response is `got a GET request`. Similarily, select `POST` and send.
Notice how on *the same url*, you have received a different response: `got a 
POST request`. This is due to the use of http verbs - `GET, POST, PUT, DELETE,
PATCH,...` there are a [bunch] of different methods. `GET` (asking the 'embassy'
for your record), `POST` (sending the embassy personal info and they send back
a personalized passport), `PUT` (informing the embassy of a mistake in the
passport and they fix it, may send back confirmation of fix), `DELETE` (this
is what you do when you escape to a faraway island and remove your personal
information from inside the embassy's database).

# AngularJS Tutorial
#### *From The Ground Up*

First, make sure you are on the `pre-angular` branch:
~~~bash
$ git clone https://github.com/thejmazz/naivednageneration.git
$ cd naivednageneration
$ git checkout pre-angular
~~~

Now we have a RESTful API with two endpoints (`POST /genDNA` and `GET /dnas`),
and we will build the frontend app using AngularJS.  First, we need to make a
folder for static content. This can be served easily from Node, and essentially
allows us to make a simple html website. So:

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
    <title>naive dna gen.</title>
    
    <!-- bower:css -->
    
    <!-- endbower -->
</head>
<body>
    <h1> A Naive DNA Generation Algorithm </h1>
    
    <!-- bower:js -->
    
    <!-- endbower -->
</body>
</html>
~~~

Then to serve this from Node, add the following to the end of `app.js`:

~~~js
app.use(express.static('public'));
console.log('Serving content from ' + 'public'.blue);
~~~

Start the server:
~~~bash
$ node app.js 9001
~~~

And visit the page at `http://localhost:9001`.

From inside `public`, run
~~~bash
$ bower init
~~~

Change the name if you'd like, just enter through everything else. When that is
finished, a `bower.json` file will have been created. This file is very similar
to `package.json` except `package.json` is used by Node and most often for
backend dependencies (like Express, body-parser), or for command-line tools like
Gulp or Grunt, whereas `bower.json` is used for managing frontend dependencies
(like jQuery, bootstrap), and will install these into `bower_components`. Lets
get started by installing AngularJS:

~~~bash
$ bower install --save angular
~~~

The `--save` option will add `angular` to our `dependencies` object within
`bower.json`. Look at the file if you would like to see for yourself. If you
take a peek inside `bower_components`, you will see there is now a folder
`angular` and within there `angular.js`, the main file we are looking for. We
*could* manually add that script to our html, but there is an easier way to do
it. Remember those 

~~~html
<!-- bower:js -->
<!-- endbower -->
~~~

comments? They are for a tool called `wiredep` to add in our dependencies.
First, make sure you have `wiredep` installed globally:

~~~bash
$ npm install -g wiredep
~~~

And then wire up those dependencies into your _source_ file `index.html`:

~~~bash
$ wiredep -s index.html
~~~

Now the `<script src="...angular.js"></script>` will have been added to
`index.html` and we can really get started. Let's make a folder called `js`
within `public` and create a file `main.js` within. Fill `main.js`with the
following (also make sure to add `<script src="js/main.js"></script>` to
`index.html`, after the bower stuff):

~~~js
angular.module('naiveDNA', [])

.controller('bodyCtrl', ['$scope', function($scope) {
    $scope.mainTitle = 'A Naive DNA Generation Algorithm'
    $scope.subTitle = "But what isn't?"
}]);
~~~

A few things just happened. First, we have defined our main app as `naiveDNA`,
to reconcile this with our html modify the opening `<html>` tag like so:

~~~html
<html lang="en" ng-app="naiveDNA">
~~~

Second, we have defined our first controller. A controller is what is what it
sounds like..used to add/remove/modify/'use' the elements within it's context.
Again, let's reconcile this with our html:

~~~html
<body ng-controller="bodyCtrl">
~~~

Now, what is `$scope`? I like to think of `$scope` as the object containing the
variables available to the context of that controller. In this case, any
`ng-model="foo"` (which we will see soon) will be available from the controller
as `$scope.foo`. So let's put `$scope` to use, replace the current `<h1>` in
`index.html` with the following:

~~~html
<h1>{{mainTitle}}</h1>
<h2>{{subTitle}}</h2>
~~~

Refresh the page, and you should see your new titles. Time to get a little more
interesting. We have a `GET` endpoint on our api at `/dnas`. You can test this
by pointing Postman or your browser to `http://localhost:9001/dnas`. (If you
have not generated any sequences before, this will be empty). Let's add a button
to our page that will retreive all of our seqeunces and display them on the
page, below your headings add:

~~~html
<hr> <center> <button ng-click="getSeqs()">All Sequences</button> </center>
<div ng-repeat="seq in seqs">
    <p>{{seq.len}}</p>
    <textarea>{{seq.sequence}}</textarea>
</div>
~~~

And add the corresponding function and object to `main.js`:

~~~js
$scope.seqs = {};

$scope.getSeqs = function() {
    $http.get('http://localhost:9001/dnas').success(function(data) {
        $scope.seqs = data;
    });
};
~~~

But wait, not so fast! What is `$http`? It is service provided by Angular and as
such we need to properly define the dependencies of our controller, change the
controller declaration to:

~~~js
.controller('bodyCtrl', ['$scope', '$http', function($scope, $http) {
    // our stuff
}]);
~~~

Okay so what has happened? We defined a function `getSeqs` and since the
`$scope` is shared between our controller and it's respective DOM element (in
this case, `<body>`) we call that function on the button's click with
`ng-click="getSeqs()"`. Then we are using
[`$http`](https://docs.angularjs.org/api/ng/service/$http) to perform a `GET`
request to `/dnas`, which returns a
[promise](https://docs.angularjs.org/api/ng/service/$q) with two specific
methods: `success` and `error`. You can also use the promise method `then`.
Essentially, we have requested a resource, some async stuff goes off, we get our
callback with the results (`.success(function(results){...})`) and store the
results into `$scope.seqs`. The `ng-repeat` part of this loops through the
`$scope.seqs` array and outputs some nice html.

Now let's add the ability to add sequences to the database from our app. The
markup for `index.html`:

~~~html
<input type="number" ng-model="numNts" placeholder="how many nucleotides?"></input>
<button ng-click="genDNA()">Generate DNA!</button>
<div ng-show="currentSeq">
    You just generated: <textarea>{{currentSeq}}</textarea>
</div>
~~~

And the associated JavaScript in `main.js`:

~~~js
$scope.genDNA = function() {
    var envelopeContents = {
        arg: $scope.numNts
    };
    
    var sentEnvelope = $http.post('http://localhost:9001', envelopeContents);
    
    // could handle this like we did with .success in getSeqs, but for
    // the sake of variety/learning we will use the promise method then
    // see https://docs.angularjs.org/api/ng/service/$q
    // promise.then(success,error,update);
    sentEnvelope.then(function(reply) {
        // person got our envelope, did some stuff, sent us back a reply
        $scope.currentSeq = reply.output;
    }, function(reason) {
        alert('Failed: ' + reason);
    }, function(update) {
        alert('Got notification: ' + update);
    });
};
~~~

[`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) will enforce css
styles so that the div will show or not show depending on if it's associated
expression is truthy. In our case, `if(currentSeq)` would return false until
`genDNA()` is ran, at which point `if(notNullVariable)` will return true and the
div will show.

Questions? Errors? Please let me know! Next steps: work through some
[tutorials](http://campus.codeschool.com/courses/shaping-up-with-angular-js/intro)
and read the [docs](https://docs.angularjs.org/api)!

Cheers,<br>
thejmazz
