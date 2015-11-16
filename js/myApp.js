$(document).on('ready', function (e) {
  $('.navbar-nav li a').on('click', function (event) {
    event.preventDefault();
    var $self = $(this);
    changeCurrentTab($self);
  })
});

var changeCurrentTab = function ($target) {
  $('#currently-on').removeAttr('id');
  $target.attr('id', 'currently-on');
};
