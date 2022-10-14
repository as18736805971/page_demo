(function(win, doc) {
  var docEl = doc.documentElement
  var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize'
  var recalc = function() {
    var clientwidth = docEl.clientWidth
    if (!clientwidth) { return false }
    var fz = 20 * (clientwidth / 1920) + 'px'
    docEl.style.fontSize = fz
  }
  if (!doc.addEventListener) { return false }
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
})(window, document)
