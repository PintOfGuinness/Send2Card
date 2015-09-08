# Send2Card

Clone this project, then using the command prompt call:

1st time just call:
- npm install
Then subsequently call:
- bower install


in the Send2Card root project folder.

Open chrome browser using following command and browse to your page. It will avoid an "No 'Access-Control-Allow-Origin' header is present on the request resource" error.  It allows us to make an XMLHttpRequest to a different domain that our page is on, usually the browser blocks this but an app like Postman will allow it.
chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security

Copy and paste something like the following into your browser:
http://localhost:9000/#/?eccardnum=154871616&couponnum=12345678907499


Have a good day!
