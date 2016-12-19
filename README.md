# point-of-sale-widget-example

## Description:
This widget was thought to be used on touch cash systems that can open a webpage and to works on IE 8 too.
It gets the availablities from the resmio API, as well as the possible number of people for the booking group, and makes a reservation for the current day.
It's also possible to insert the name and the email of the guest for marketing purposes.

## Setup:
In **js** → **script.js** replace *the-fish* with your resmio ID:
```javascript
var resmio_id = 'the-fish';
```
Add your logo in the **img** folder and then in **index.html** replace *logo.png* with the name of your logo file:
```css
<a href="index.html"><img id="logo" class="img-responsive" src="img/logo.png" alt="logo"/></a>
```
