$(document).on('ready', function (e) {

  $('section.success').hover(handlerIn, handlerOut)

})

var handlerIn = function () {
  $(this).css('background-color', 'rgba(12,61,196,1)')
};

var handlerOut = function () {
  $(this).css('background-color', 'rgba(12,61,196,0.5)')
};