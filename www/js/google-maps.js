var google_maps = {
    map: false,
    gps: function () {
        cordova.plugins.diagnostic.isLocationAvailable(function (available) {
            if (!available) {
                navigator.notification.confirm(
                    'Se requiere del GPS de su dispositivo para poder usar esta función, ¿desea habilitarlo?',
                    function (button) {
                        if (button === 1) {
                            cordova.plugins.diagnostic.switchToLocationSettings()
                        } else {
                            document.getElementById("bencineras").style.display = "none"
                            location.href = "#emergencia"
                        }
                    },
                    'Habilitar GPS', ['Sí', 'No']
                )
            } else {
                navigator.geolocation.watchPosition(function (position) {
                    'use strict'
                    window.localStorage.setItem('latitud', position.coords.latitude)
                    window.localStorage.setItem('longitud', position.coords.longitude)
                }, function () {
                    shortToast("Error al obtener posición. Revise su configuración de GPS.")
                }, {
                        enableHighAccuracy: false,
                        maximumAge: 60000
                    })

                navigator.geolocation.getCurrentPosition(function (position) {
                    window.localStorage.setItem('latitud', position.coords.latitude)
                    window.localStorage.setItem('longitud', position.coords.longitude)
                }, null, {
                        enableHighAccuracy: false,
                        maximumAge: 60000
                    })
                google_maps.map = google_maps.render()
            }
        })
    },
    bind: function () {
        'use strict'
        document.addEventListener("deviceready", function () {
            google_maps.gps()
        }, false)
    },
    InfoWindow: new google.maps.InfoWindow(),
    render: function () {
        'use strict'
        document.getElementById("map-canvas").style.display = 'block'
        document.getElementById("map-canvas").style.height = (screen.height - 25) + 'px'
        document.getElementById("map-canvas").style.width = '100%'
        var map = new google.maps.Map(document.getElementById("map-canvas"), {
            center: new google.maps.LatLng(window.localStorage.getItem("latitud"), window.localStorage.getItem("longitud")),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy'
        })

        var button_center = document.getElementById('button_center')
        button_center.style.display = 'block'
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(button_center)

        var my_marker = new google.maps.Marker({
            position: new google.maps.LatLng(window.localStorage.getItem("latitud"), window.localStorage.getItem("longitud")),
            map: map,
            title: "Aquí estoy",
            animation: google.maps.Animation.DROP
        })

        google.maps.event.addListener(my_marker, 'click', function () {
            google_maps.InfoWindow.close()
            var info = 'Estoy aquí!'
            google_maps.InfoWindow.setContent(info)
            google_maps.InfoWindow.open(map, my_marker)
        })

        button_center.addEventListener('click', e => {
            e.preventDefault()
            app.startRecording()
        }, false)

        return map
    }
}

google_maps.bind()