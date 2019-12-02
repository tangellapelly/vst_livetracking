function show_tracking(){

    var lineString = new H.geo.LineString();
    var objImgCar = document.createElement('img');
    objImgCar.setAttribute("id", "carDomIcon")
    objImgCar.setAttribute("width", "12")
    objImgCar.setAttribute("height", "24")
    objImgCar.src = 'assets/img/Car.png';
    var DomCar = new H.map.DomIcon(objImgCar);

    var domElementFather = document.createElement('div');
    domElementFather.appendChild(objImgCar);
    var domIconCar = new H.map.DomIcon(domElementFather, {});

    var position_latitude = window.route_matching_data.response.route[0].waypoint[0].mappedPosition.latitude;
    var position_longitude = window.route_matching_data.response.route[0].waypoint[0].mappedPosition.longitude;

    var marker_location = new H.map.DomMarker({
        lat: position_latitude,
        lng: position_longitude
    }, {
        icon: domIconCar
    });
    let group = new H.map.Group();
    group.addObject(marker_location);
    map.setZoom(18);
    map.addObject(group);
    popFromLocationQueue();

    //Loading the data every 2 sec
    window.setInterval(function () {
        addToLocationQueue();
    }, 2000);


    function addToLocationQueue() {
        const isMapAnimated = true;
        var position_latitude = window.route_matching_data.response.route[0].waypoint[0].originalPosition.latitude;
        var position_longitude = window.route_matching_data.response.route[0].waypoint[0].originalPosition.longitude;
    
       // debugging purpose 
        console.log({
            lat: position_latitude,
            lng: position_longitude
        })
       
        moveTo = [position_latitude, position_longitude]
    
        customAnimatedMove(marker_location, .5, marker_location.getGeometry().lat, marker_location.getGeometry().lng,
            moveTo);
        
        popFromLocationQueue();
    }


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
                        
                        $('#carDomIcon').css({ //calling calCBearing func to get the angle of the car
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

    function popFromLocationQueue() {
        if (window.route_matching_data.response.route[0].waypoint.length > 0) {
            window.route_matching_data.response.route[0].waypoint.shift();
        } else {
            return null
        }

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
    
    function addPolylineToMap(map,moveTo) {
        lineString.pushPoint({lat:moveTo[0], lng:moveTo[1]});
        map.addObject(new H.map.Polyline(
          lineString, { style: { lineWidth: 2 }}
        ));
      }
}

