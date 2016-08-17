(function() {
   var apiUrl = 'api/';
   var types = {
      'application/json': {
         name: 'json',
         marshall: function(text) {
            return JSON.stringify(JSON.parse(text), null, 2);
         }
      },
      'application/xml': {
         name: 'xml',
         marshall: function(text) {
            return vkbeautify.xml(text).replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
         }
      }
   };
   var statusCodes = {
      "200": "OK",
      "400": "BAD REQUEST"
   };

   this.AdvertiserListApp = function() {
      var self = this;
      addEventListener('load', function() {
         // update select with elments
         var ulmenu = document.querySelector('.dropdown-menu ul');
         var first = true;
         for (var i in types) {
            if (first) {
               self.fetchFromApi(types[i]);
               first = false;
            }
            ulmenu.innerHTML = ulmenu.innerHTML + '<li><a data-content-type="' + i + '">' + types[i].name + '</a></li>'
         }

         // make'em clickable
         [].forEach.call(document.querySelectorAll('.dropdown-menu-wrapper a'), function(a) {
            a.addEventListener("click", function() {
               // a little whiggeling to make the drop-down-menu disappear
               Utils.removeClass(document.querySelector('.dropdown-menu'), 'display-menu');
               //setTimeout('Utils.removeClass(document.querySelector(\'.dropdown-menu\'), \'display-none\')', 1000);
               // trigger api request
               self.fetchFromApi(types[this.getAttribute('data-content-type')]);
               //
            });
         });

         document.querySelector('.dropdown button').addEventListener("click", function() {
             var ddm = document.querySelector('.dropdown-menu');
             if (Utils.hasClass(ddm, 'display-menu')) {
                 Utils.removeClass(ddm, 'display-menu');
             } else {
                 Utils.addClass(ddm, 'display-menu');
             }

         });
      });
   };

   AdvertiserListApp.prototype.getType = function(index) {
      return types[Object.keys(types)[index]];
   };


   AdvertiserListApp.prototype.fetchFromApi = function(type) {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
         if (xmlhttp.readyState === 4) {
            // update page elements with new data
            var block = document.getElementById('code');
            block.className = type.name; // tell highlight what to highlight
            document.querySelector(".dropdown .txt").innerHTML = type.name;
            document.querySelector(".response-headers .status").innerHTML = 'HTTP ' + xmlhttp.status + ' ' + statusCodes[xmlhttp.status];
            document.querySelector(".response-headers .vary").innerHTML = '<strong>Vary:</strong> ' + (xmlhttp.getResponseHeader('Vary') != null ? xmlhttp.getResponseHeader('Vary') : '');
            document.querySelector(".response-headers .allow").innerHTML = '<strong>Allow:</strong> ' + (xmlhttp.getResponseHeader('Allow') != null ? xmlhttp.getResponseHeader('Allow') : '');
            document.querySelector(".response-headers .content-type").innerHTML = '<strong>Content-Type:</strong> ' + xmlhttp.getResponseHeader('Content-Type');
            block.innerHTML = ''; // reset code block
            if (xmlhttp.status === 200) {
               if (xmlhttp.responseText.length > 0) {
                  // Injecting result in code element
                  block.innerHTML = types[xmlhttp.getResponseHeader('Content-Type')].marshall(xmlhttp.responseText);
               }
            } else if (xmlhttp.status === 204) {
               console.log("Api responded with no content. ( ERROR : " + xmlhttp.status + ")");
            } else {
               console.log("There was an error trying to fetch data from api. ( ERROR : " + xmlhttp.status + ")");
            }
            hljs.highlightBlock(block);
         }
      };
      xmlhttp.open("GET", apiUrl + 'response.' + type.name, true);
      xmlhttp.setRequestHeader('Accept', 'application/json');
      xmlhttp.send();
   };
}());
var advertiserListApp = new AdvertiserListApp();
