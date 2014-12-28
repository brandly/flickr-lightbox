'use strict';

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
