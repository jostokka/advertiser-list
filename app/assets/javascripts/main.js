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
}

addEventListener('load', function() {
   var ulmenu = document.querySelector('.dropdown-menu ul');
   var first = true;
   for (var i in types) {
      if (first) {
         fetchFromApi(types[i]);
         first = false;
      }
      ulmenu.innerHTML = ulmenu.innerHTML + '<li><a data-content-type="' + i + '">' + types[i].name + '</a></li>'
   }

   [].forEach.call(document.querySelectorAll('.dropdown-menu-wrapper a'), function(a) {
      a.addEventListener("click", function() {
         fetchFromApi(types[this.getAttribute('data-content-type')]);
      });
   });
});

function injectResult(xmlhttp, type) {
   console.log(type, xmlhttp, xmlhttp.getAllResponseHeaders());
   var block = document.getElementById('code');
   block.className = type.name;
   document.querySelector(".dropdown .txt").innerHTML = type.name;
   document.querySelector(".response-headers .status").innerHTML = 'HTTP ' + xmlhttp.status + ' ' + statusCodes[xmlhttp.status];
   document.querySelector(".response-headers .vary").innerHTML = '<strong>Vary:</strong> ' + (xmlhttp.getResponseHeader('Vary') != null ? xmlhttp.getResponseHeader('Vary') : '');
   document.querySelector(".response-headers .allow").innerHTML = '<strong>Allow:</strong> ' + (xmlhttp.getResponseHeader('Allow') != null ? xmlhttp.getResponseHeader('Allow') : '');
   document.querySelector(".response-headers .content-type").innerHTML = '<strong>Content-Type:</strong> ' + xmlhttp.getResponseHeader('Content-Type');
   if (xmlhttp.status === 200) {
      if (xmlhttp.responseText.length > 0) { // Injecting result
         block.innerHTML = types[xmlhttp.getResponseHeader('Content-Type')].marshall(xmlhttp.responseText);
      }
   } else if (xmlhttp.status === 204) {
      loading.style.display = "none";
   } else {
      console.log("There was an error trying to fetch data from api. ( ERROR : " + xmlhttp.status + ")");
   }
   hljs.highlightBlock(block);
}

function fetchFromApi(type) {
   var xmlhttp = new XMLHttpRequest();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
         injectResult(xmlhttp, type);
      }
   };
   xmlhttp.open("GET", apiUrl + 'response.' + type.name, true);
   xmlhttp.setRequestHeader('Accept', 'application/json');
   xmlhttp.send();
}
