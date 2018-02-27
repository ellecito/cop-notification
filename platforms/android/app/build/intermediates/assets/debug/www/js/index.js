/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false)
    },
    /**
     * 
     */
    onDeviceReady: function () {
        window.plugins.speechRecognition.requestPermission()
        window.plugins.speechRecognition.isRecognitionAvailable(status => {
            console.log('isRecognitionAvailable:', status)
        }, error => {
            console.error(error)
        })
    },
    /**
     * 
     */
    startRecording: function () {
        window.plugins.speechRecognition.startListening(text => {
            console.log(text)
            text.forEach(txt => {
                var words = txt.split(" ")
                var alert = new Alert()
                words.forEach(word => {
                    if (app.cops.indexOf(word.toLowerCase()) != -1) {
                        alert.type = 'cop'
                    }

                    if (Number.isInteger(parseInt(word))) {
                        alert.distance = parseInt(word)
                    }

                    if (app.kms.indexOf(word.toLowerCase()) != -1) {
                        console.log("KM: " + word)
                        alert.distance = alert.distance * 1000
                    }

                    if (app.ms.indexOf(word.toLowerCase()) != -1) {
                        console.log("M: " + word)
                        //alert.distance = alert.distance
                    }

                    if (app.orientation.indexOf(word) != -1) {
                        alert.orientation = app.trueorientation[app.orientation.indexOf(word)]
                    }
                })

                if (alert.orientation != null) {
                    var here = new google.maps.LatLng(window.localStorage.getItem("latitud"), window.localStorage.getItem("longitud"))
                    var there = google.maps.geometry.spherical.computeOffset(here, alert.distance, alert.orientation)
                    var marker = new google.maps.Marker({
                        position: there,
                        map: google_maps.map,
                        title: alert.type,
                        animation: google.maps.Animation.DROP
                    })

                    google.maps.event.addListener(marker, 'click', function () {
                        google_maps.InfoWindow.close()
                        var info = 'Type: ' + alert.type + '<br>'
                            + 'Distance: ' + alert.distance + '<br>'
                            + 'Orientation: ' + alert.orientation
                        google_maps.InfoWindow.setContent(info)
                        google_maps.InfoWindow.open(google_maps.map, marker)
                    })
                }

                // var p = document.createElement('p')
                // p.innerHTML = txt
                // document.getElementById('input').appendChild(p)
            })
        }, error => {
            console.error(error)
        }, {
                language: 'es-CL',
                matches: 1
            }
        )
    },
    /**
     * 
     */
    cops: new Array('policía', 'policia', 'policías', 'policias', 'carabinero', 'carabineros', 'paco', 'pacos'),
    kms: new Array('kilómetro', 'kilometro', 'kilómetros', 'kilometros', 'km', 'kms'),
    ms: new Array('metro', 'metros', 'ms'),
    orientation: new Array('norte', 'sur', 'este', 'oeste'),
    trueorientation: new Array(0, 180, 90, -90)
}

function Alert() {
    this.type = null
    this.distance = 0
    this.orientation = null
}

app.initialize()