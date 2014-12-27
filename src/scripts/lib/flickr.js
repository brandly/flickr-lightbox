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
