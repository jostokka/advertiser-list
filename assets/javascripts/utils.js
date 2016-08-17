Utils = {
   regClassCache : {},
   hasClass: function(ele, cls) {
      if (!Utils.regClassCache[cls]) {
         Utils.regClassCache[cls] = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      }
      return Utils.regClassCache[cls].test(ele.className) && Utils.regClassCache[cls];
   },
   addClass: function(el, className) {
      if (el.classList) {
         el.classList.add(className);
      } else {
         el.className += ' ' + className;
      }
   },

   removeClass: function(el, className) {
      if (typeof el == 'object') {
         if (el.classList) {
            el.classList.remove(className);
         } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
         }
      }
   }
};
