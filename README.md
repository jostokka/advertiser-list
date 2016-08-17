# advertiser-list

Getting started
-------
You require a local webserver to run the project. There is a node script included for a simple webserver.

Type in terminal:

```
npm install
npm run devserver
```

Open a browser and goto: http://localhost:9005/
A demo version is available at http://www.hyzer.no/advertiser-list/


Selenium tests
-------
Type in terminal:
```
npm test
```


Future improvements / scaling
-------

If I got it right, this is very similar to a standard swagger rest-documentation service.
http://www.mohammedovich.com/content/images/2015/10/swaggerui-example1.png

The next step would probably be to load a config from the api, containing set of api methods with parameter descriptions - and let the user test them with custom data.
In index.html, "<div class="section">" would have to be refactored as a template to be iterated over (the set of api methods).
