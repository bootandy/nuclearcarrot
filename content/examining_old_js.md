+++
title = "Examinging my old Javascript code"
date = 2018-03-06
+++

I went through the code to my old Javascript game [Cat and mouse](https://www.nuclearcarrot.co.uk/html5/cat-and-mouse/) . I recall as I wrote this game many years ago that I had just discovered how javascript functions could act like objects and was enjoying putting functions in functions.

There was a bug. Calls to [getImageData](https://www.w3schools.com/tags/canvas_getimagedata.asp) would occasionally slow down the Javascript rendering engine massively. This didn't happen to browsers ~ 7 years ago when I first wrote this code so I suspect this is a side effect of stricter security principles.

I was calling getImageData to find out if a point was inside a polygon. This seemed like a very easy solution as the polygon was colored differently to the rest of the game - therefore I can look at the color of a point and determine if a point is inside the polygon.

I needed an alternative to find out if a point was in a polygon. I knew about the ray casting method; cast a ray in one direction from the point and if it crosses an even number of lines then it is outside the polygon, if it crosses an odd number it is inside. Intuatively this made sense to me, I drew some points and polygons on paper and I could see the principle holding true.
There are [many SO answers](https://stackoverflow.com/questions/22521982/js-check-if-point-inside-a-polygon) about how to find if a point is inside a polygon. [This page](https://wrf.ecse.rpi.edu//Research/Short_Notes/pnpoly.html) nicely sums up the history of the function. But as I read the code it didn't make intuitive sense to me, I had to spend some time with a pen and paper stepping through the function to see how it worked. When I was happy I added a function and fixed the code.

An amusing side note is that the internals of the game refer to Rats and Cats, this is to differentiate from the 'mouse' which is the mouse pointer.


