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

Change the name if you'd like, just enter through everything else. When that is finished, a `bower.json` file will have been created. This file is very similar to `package.json` except `package.json` is used by Node and most often for backend dependencies (like Express, body-parser), or for command-line tools like Gulp or Grunt, whereas `bower.json` is used for managing frontend dependencies (like jQuery, bootstrap), and will install these into `bower_components`. Lets get started by installing AngularJS:

~~~bash
$ bower install --save angular
~~~

The `--save` option will add `angular` to our `dependencies` object within `bower.json`. Look at the file if you would like to see for yourself. If you take a peek inside `bower_components`, you will see there is now a folder `angular` and within there `angular.js`, the main file we are looking for. We *could* manually add that script to our html, but there is an easier way to do it. Remember those 

~~~html
<!-- bower:js -->
<!-- endbower -->
~~~

comments? They are for a tool called `wiredep` to add in our dependencies. First, make sure you have `wiredep` installed globally:

~~~bash
$ npm install -g wiredep
~~~

And then wire up those dependencies into your _source_ file `index.html`:

~~~bash
$ wiredep -s index.html
~~~

Now the `<script src="...angular.js"></script>` will have been added to `index.html` and we can really get started. Let's make a folder called `js` within `public` and create a file `main.js` within. Fill `main.js`with the following (also make sure to add `<script src="js/main.js"></script>` to `index.html`, after the bower stuff):

~~~js
angular.module('naiveDNA', [])

.controller('bodyCtrl', ['$scope', function($scope) {
    $scope.title = 'A Naive DNA Generation Algorithm'
    $scope.subtitle = 'But what isn't?'
}]);
~~~

A few things just happened. First, we have defined our main app as `naiveDNA`, to reconcile this with our html modify the opening `<html>` tag like so:

~~~html
<html lang="en" ng-app="naiveDNA">
~~~

Second, we have defined our first controller. A controller is what is what it sounds like..used to add/remove/modify/'use' the elements within it's context. Again, let's reconcile this with our html:

~~~html
<body ng-controller="bodyCtrl">
~~~

Now, what is `$scope`? I like to think of `$scope` as the object contating the variables available to the context of that controller. In this case, any `ng-model="foo"` (which we will see soon) will be available from the controller as `$scope.foo`. So let's put `$scope` to use, replace the current `<h1>` in `index.html` with the following:

~~~html
<h1>{{title}}</h1>
<h2>{{subtitle}}</h2>
~~~

Refresh the page, and you should see your new titles. Time to get a little more interesting. We have a `GET` endpoint on our api at `/dnas`. You can test this by pointing Postman or your browser to `http://localhost:9001/dnas`. (If you have not generated any sequences before, this will be empty). Let's add a button to our page that will retreive all of our seqeunces and display them on the page, below your headings add:

~~~html
<hr> <center> <button ng-click="getSeqs()">All Sequences</button> <center>
<div ng-repeat="seq in seqs">
    <p>{{seq.len}}</p>
    <textarea>{{seq.sequence}}</textarea>
</div>
~~~

Add add the corresponding function and object to `main.js`:

~~~js
$scope.seqs = {};

$scope.getSeqs = function() {
    $http.get('http://localhost:9001/dnas').success(function(data) {
        $scope.seqs = data;
    });
};
~~~

But wait, not so fast! What is `$http`? It is service provided by Angular and as such we need to properly define the dependencies of our controller, change the controller declaration to:

~~~js
.controller('bodyCtrl', ['$scope', '$http', function($scope, $http) {
    // our stuff
}]);
~~~

Okay so what has happened? We defined a function `getSeqs` and since the `$scope` is shared between our controller and it's respective DOM element (in this case, `<body>`) we call that function on the button's click with `ng-click="getSeqs()"`. Then we are using [`$http`](https://docs.angularjs.org/api/ng/service/$http) to perform a `GET` request to `/dnas`, which returns a [promise](https://docs.angularjs.org/api/ng/service/$q) with two specific methods: `success` and `error`. You can also use the promise method `then`. Essentially, we have requested a resource, some async stuff goes off, we get our callback with the results (`.success(function(results){...})`) and store the results into `$scope.seqs`. The `ng-repeat` part of this loops through the `$scope.seqs` array and outputs some nice html.

Now let's add the ability to add sequences to the database from our app. The markup for `index.html`:

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

[`ngShow`](https://docs.angularjs.org/api/ng/directive/ngShow) will enforce css styles so that the div will show or not show depending on if it's associated expression is truthy. In our case, `if(currentSeq)` would return false until `genDNA()` is ran, at which point `if(notNullVariable)` will return true and the div will show.

Questions? Errors? Please let me know! Next steps: work through some [tutorials](http://campus.codeschool.com/courses/shaping-up-with-angular-js/intro) and read the [docs](https://docs.angularjs.org/api)!

Cheers,
thejmazz
