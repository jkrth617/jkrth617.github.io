$(document).on('ready', function (e) {

  ajaxLoadInfo();

  $('.navbar-nav li a').on('click', function (event) {
    event.preventDefault();
    var $self = $(this);
    if ($self.attr('id') !== "currently-on"){
      changeCurrentTab($self);
      ajaxLoadInfo($self);
    }
  })
});

var changeCurrentTab = function ($target) {
  $('#currently-on').removeAttr('id');
  $target.attr('id', 'currently-on');
};

var ajaxLoadInfo = function ($targetLink) {
  $('.loading-wheel').show();
  var myUrl = "http://jkrth617.github.io/info/about.html";
  var myType = "GET";
  if($targetLink){
    myUrl = $targetLink.attr("href");
  }
  $.ajax({
    url: myUrl,
    type: myType,
  }).then(function(response) {
    $('.loading-wheel').hide();
    debugger;
    var bodyContent = parseHTMLResponse(response)
    $('[data-role="info-target"]').html(response);
  }).fail(function(deffered) {
    $('.loading-wheel').hide();
    alert("Sorry, There was a problem fetching the data");
  });
};

var parseHTMLResponse = function (htmlString) {
  return $(htmlString).filter('body')[0];//not hitting any matches
};