$(document).on('ready', function (e) {

  $.ajax({
    url:"http://jkrth617.github.io/info/about.html",
    type:"get",
  }).then(function(response) {
    $('#info-content').html(response);
  }).fail(function(deffered) {
    alert("Sorry, There was a problem fetching the 'about me' data");
  });

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
