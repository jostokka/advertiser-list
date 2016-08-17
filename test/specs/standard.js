var assert = require('assert');

describe('page title', () => {
   it('has the correct page title', () => {
      return browser
         .url('/')
         .getTitle().then((title) => {
            assert.equal(title, 'Advertiser List');
         });
   });
   it('has a code element', () => {
      return browser
         .url('/')
         .selectorExecute('//code', function(inputs, message) {
            return inputs.length;
         }).then(function(res) {
            assert.equal(res, '1');
         });
   });
   it('loads response.json/xml from api and sets correct content-type', () => {
      return browser
         .url('/')
         .pause(1000)
         .getText('.content-type').then(function(text) {
            assert(text.indexOf('application/json') > -1, true);
         }).execute(function() {
            advertiserListApp.fetchFromApi(advertiserListApp.getType(1));
         }).getText('.content-type').then(function(text) {
            assert(text.indexOf('application/xml') > -1, true);
         })
   });
});
