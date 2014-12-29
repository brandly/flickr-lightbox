'use strict';

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

  this.bindKeyboardShortcuts();
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

Lightbox.prototype.isOpen = function isOpen() {
  return this.element.style.display === '';
};

var keyCode = {
  left: 37,
  right: 39,
  escape: 27
};

Lightbox.prototype.bindKeyboardShortcuts = function bindKeyboardShortcuts() {
  var lightbox = this;
  window.addEventListener('keyup', function (event) {
    if (lightbox.isOpen()) {
      switch (event.which) {
        case keyCode.left:
          lightbox.previousPhoto();
          break;

        case keyCode.right:
          lightbox.nextPhoto();
          break;

        case keyCode.escape:
          lightbox.hide();
          break;
      }
    }
  });
};

module.exports = Lightbox;
