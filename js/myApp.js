$(document).on('ready', function (e) {

  ajaxLoadInfo();

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

var ajaxLoadInfo = function ($targetLink) {
  var myUrl = "http://jkrth617.github.io/info/about.html";
  var myType = "GET";
  if($targetLink){
    myUrl = $targetLink.attr("href");
  }
  $.ajax({
    url: myUrl,
    type: myType,
  }).then(function(response) {
    $('[data-role="info-target"]').html(response);
  }).fail(function(deffered) {
    alert("Sorry, There was a problem fetching the data");
  });
};
