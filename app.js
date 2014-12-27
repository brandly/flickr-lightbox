(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/app.js":[function(require,module,exports){
var Flickr = require('./lib/flickr');
var Lightbox = require('./lib/lightbox');
var config = require('./config');

var flickr = new Flickr(config.apiKey);

flickr.getPhotos(config.photosetId, function (photos) {
  var lightbox = new Lightbox(photos);
  var fragment = document.createDocumentFragment();

  photos.forEach(function (photo, index) {
    var image = new Image();
    image.src = photo.url;
    image.className = 'image-thumbnail';

    // When we click a photo,
    image.addEventListener('click', function () {
      // we'd like to view it in the lightbox
      lightbox.open(index);
    });

    fragment.appendChild(image);
  });

  document.querySelector('.container').appendChild(fragment);
});

},{"./config":"/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/config.json","./lib/flickr":"/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/lib/flickr.js","./lib/lightbox":"/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/lib/lightbox.js"}],"/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/config.json":[function(require,module,exports){
module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports=module.exports={
  "apiKey": "c9b993b21d399e4a3ff66a8fbd6365c4",
  "photosetId": "72157626579923453"
}

},{}],"/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/lib/flickr.js":[function(require,module,exports){
'use strict';

function Flickr(apiKey) {
  this.apiKey = apiKey;
  this.baseURL = 'https://api.flickr.com/services/rest/'
}

Flickr.prototype.buildURL = function buildURL(method) {
  var queryFields = {
    method: method,
    api_key: this.apiKey,
    format: 'json'
  };

  var qs = [];
  for (var prop in queryFields) {
    if (queryFields.hasOwnProperty(prop)) {
      qs.push(prop + '=' + queryFields[prop]);
    }
  }

  return this.baseURL + '?' + qs.join('&');
};

// http://stackoverflow.com/a/22780569/1614967
Flickr.prototype.JSONP = function JSONP(url, callback) {
  var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'jsoncallback=' + callbackName;
  document.body.appendChild(script);
};

Flickr.prototype.getPhotos = function getPhotos(photosetId, callback) {
  var url = this.buildURL('flickr.photosets.getPhotos') + '&photoset_id=' + photosetId;

  this.JSONP(url, function (res) {
    // Strip the response down to what we really need
    var photos = res.photoset.photo.map(function (photo) {
      return {
        title: photo.title,
        url: 'http://farm' + photo.farm + '.staticflickr.com/'
            + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg'
      }
    });

    callback(photos);
  });
};

module.exports = Flickr;

},{}],"/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/lib/lightbox.js":[function(require,module,exports){

var classNames = {
  lightbox: 'lightbox',
  close: 'lightbox-close',
  previous: 'lightbox-previous',
  next: 'lightbox-next',
  image: 'lightbox-image',
  title: 'lightbox-title',
  titleWrapper: 'lightbox-title-wrapper'
};

function Lightbox(photos) {
  this.photos = photos;
  this.currentIndex = null;

  this.element = buildLightboxElement(this);
  this.image = this.element.querySelector('img');
  this.title = this.element.querySelector('h3');

  this.hide();
  document.body.appendChild(this.element);
}

// A helper for piecing together the DOM elements we need
function buildLightboxElement(lightbox) {
  var element = document.createElement('div');
  element.className = classNames.lightbox;
  element.addEventListener('click', function (event) {
    lightbox.hide();
  });

  // Close button
  var close = document.createElement('button');
  close.innerHTML = 'x';
  close.className = classNames.close;
  close.addEventListener('click', function (event) {
    lightbox.hide();
    event.stopPropagation();
  });
  element.appendChild(close);

  // Previous button
  var previous = document.createElement('button');
  previous.innerHTML = '<';
  previous.className = classNames.previous;
  previous.addEventListener('click', function (event) {
    lightbox.previousPhoto();
    event.stopPropagation();
  });
  element.appendChild(previous);

  // Next button
  var next = document.createElement('button');
  next.innerHTML = '>';
  next.className = classNames.next;
  next.addEventListener('click', function (event) {
    lightbox.nextPhoto();
    event.stopPropagation();
  });
  element.appendChild(next);

  // Image
  var image = new Image();
  image.className = classNames.image;
  element.appendChild(image);

  // Title
  var titleWrapper = document.createElement('div');
  titleWrapper.className = classNames.titleWrapper;
  var title = document.createElement('h3');
  title.className = classNames.title;
  titleWrapper.appendChild(title);
  element.appendChild(titleWrapper);

  return element;
}

Lightbox.prototype.open = function open(index) {
  this.currentIndex = index;

  var photo = this.photos[index];
  this.image.src = photo.url;
  this.title.innerHTML = photo.title;

  this.show();
};

Lightbox.prototype.nextPhoto = function nextPhoto() {
  var index = (this.currentIndex + 1) % this.photos.length;
  this.open(index);
};

Lightbox.prototype.previousPhoto = function previousPhoto() {
  // Ensures we don't go into negative indices
  var index = (this.currentIndex === 0) ? (this.photos.length - 1) : (this.currentIndex - 1);
  this.open(index);
};

Lightbox.prototype.show = function show() {
  this.element.style.display = '';
};

Lightbox.prototype.hide = function hide() {
  this.element.style.display = 'none';
};

module.exports = Lightbox;

},{}]},{},["/Users/brandly/Documents/code/web/flickr-lightbox/src/scripts/app.js"]);
