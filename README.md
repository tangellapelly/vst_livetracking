You can find the demo at [heremaplivetrack](https://heremaplivetrack.tangellapelly.now.sh/)

Custom functions: 

```javascript

    function customAnimatedMove(marker, t, current_lat, current_lng, moveto) {

         /* 
            @Author: tagellapelly@gmail.com
            @dec: custom function to move the marker smoothly
        */

        let lat = current_lat;
        let lng = current_lng;
        let currentLatLng = [current_lat, current_lng];

        let deltalat = (moveto[0] - lat) / 100;
        let deltalng = (moveto[1] - lng) / 100;
        let delay = 10 * t;
        for (let i = 0; i < 100; i++) {
            (function (ind) {
                setTimeout(
                    function () {
                        let lat = marker.getGeometry().lat;
                        let lng = marker.getGeometry().lng;
                        lat += deltalat;
                        lng += deltalng;
                        latlng = new H.geo.Point(lat, lng);
                        //calling calCBearing func to get the angle of the car
                        $('#carDomIcon').css({ 
                            "transform": `rotate(+${calCBearing(currentLatLng, moveto)}deg)`
                        });

                        marker.setPosition(latlng);
                        map.setCenter(latlng, true);
                        

                    }, delay * ind
                );
            })(i)
        }
    }

function calCBearing(currentLatLng, movingToLatLng) {

        /* 
            @Author: tagellapelly@gmail.com
            @dec: custom function to calc the angle of the vehicle
        */

       let startLat = toRadians(currentLatLng[0]);
       let startLng = toRadians(currentLatLng[1]);
       let destLat = toRadians(movingToLatLng[0]);
       let destLng = toRadians(movingToLatLng[1]);

        y = Math.sin(destLng - startLng) * Math.cos(destLat);
        x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
        brng = Math.atan2(y, x);
        brng = toDegrees(brng);
        return (brng + 360) % 360;

    }
     function toRadians(degrees) {
        /* 
            @Author: tagellapelly@gmail.com
            @dec:  Converts from degrees to radians.
        */
        return degrees * Math.PI / 180;
    };

    
    function toDegrees(radians) {
        /* 
            @Author: tagellapelly@gmail.com
            @dec: Converts from radians to degrees.
        */
        return radians * 180 / Math.PI;
    }
```