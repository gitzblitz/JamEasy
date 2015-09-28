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
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		
		//BACK BUTTON JS
		document.addEventListener("backbutton", function(e){
       if(document.getElementById('#homepage')){
           e.preventDefault();
           navigator.app.exitApp();
       }
       else {
           navigator.app.backHistory();
       }
    }, false);
		
		
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

//SWIPE THROUGH IMAGES

// Pagecreate will fire for each of the pages in this demo
// but we only need to bind once so we use "one()"
$( document ).one( "pagecreate", ".demo-page", function() {
    // Initialize the external persistent header and footer
    $( "#header" ).toolbar({ theme: "b" });
    $( "#footer" ).toolbar({ theme: "b" });
    // Handler for navigating to the next page
    function navnext( next ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", next + ".html", {
            transition: "slide"
        });
    }
    // Handler for navigating to the previous page
    function navprev( prev ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "change", prev + ".html", {
            transition: "slide",
            reverse: true
        });
    }
    // Navigate to the next page on swipeleft
    $( document ).on( "swipeleft", ".ui-page", function( event ) {
        // Get the filename of the next page. We stored that in the data-next
        // attribute in the original markup.
        var next = $( this ).jqmData( "next" );
        // Check if there is a next page and
        // swipes may also happen when the user highlights text, so ignore those.
        // We're only interested in swipes on the page.
        if ( next && ( event.target === $( this )[ 0 ] ) ) {
            navnext( next );
        }
    });
    // Navigate to the next page when the "next" button in the footer is clicked
    $( document ).on( "click", ".next", function() {
        var next = $( ".ui-page-active" ).jqmData( "next" );
        // Check if there is a next page
        if ( next ) {
            navnext( next );
        }
    });
    // The same for the navigating to the previous page
    $( document ).on( "swiperight", ".ui-page", function( event ) {
        var prev = $( this ).jqmData( "prev" );
        if ( prev && ( event.target === $( this )[ 0 ] ) ) {
            navprev( prev );
        }
    });
    $( document ).on( "click", ".prev", function() {
        var prev = $( ".ui-page-active" ).jqmData( "prev" );
        if ( prev ) {
            navprev( prev );
        }
    });
});
$( document ).on( "pageshow", ".demo-page", function() {
    var thePage = $( this ),
        title = thePage.jqmData( "title" ),
        next = thePage.jqmData( "next" ),
        prev = thePage.jqmData( "prev" );
    // Point the "Trivia" button to the popup for the current page.
    $( "#trivia-button" ).attr( "href", "#" + thePage.find( ".trivia" ).attr( "id" ) );
    // We use the same header on each page
    // so we have to update the title
    $( "#header h1" ).text( title );
    // Prefetch the next page
    // We added data-dom-cache="true" to the page so it won't be deleted
    // so there is no need to prefetch it
    if ( next ) {
        $( ":mobile-pagecontainer" ).pagecontainer( "load", next + ".html" );
    }
    // We disable the next or previous buttons in the footer
    // if there is no next or previous page
    // We use the same footer on each page
    // so first we remove the disabled class if it is there
    $( ".next.ui-state-disabled, .prev.ui-state-disabled" ).removeClass( "ui-state-disabled" );
    if ( ! next ) {
        $( ".next" ).addClass( "ui-state-disabled" );
    }
    if ( ! prev ) {
        $( ".prev" ).addClass( "ui-state-disabled" );
    }
});

// END OF PAGE SWIPE THROUG IMAGES-->

//LIGHTBOX IMAGES-->

$( document ).on( "pagecreate", function() {
    $( ".photopopup" ).on({
        popupbeforeposition: function() {
            var maxHeight = $( window ).height() - 60 + "px";
            $( ".photopopup img" ).css( "max-height", maxHeight );
        }
    });
});

$( ".popup").live({
    popupbeforeposition: function(event, ui) {
    $("body").on("touchmove", false);
}
});

$( ".popup" ).live({
    popupafterclose: function(event, ui) {
    $("body").unbind("touchmove");
}
});

// END LIGHTBOX-->

//Create the map then make 'displayDirections' request
$('#page-map').live("pageinit", function() {
    $('#map_canvas').gmap({'center' : mapdata.destination, 
        'mapTypeControl' : true, 
        'navigationControl' : true,
        'navigationControlOptions' : {'position':google.maps.ControlPosition.LEFT_TOP}
        })
    .bind('init', function() {
        $('.refresh').trigger('tap');        
    });
});

$('#page-map').live("pageshow", function() {
    $('#map_canvas').gmap('refresh');
});

// Request display of directions, requires jquery.ui.map.services.js
var toggleval = true; // used for test case: static locations
$('.refresh').live("tap", function() {
    
            // START: Tracking location with device geolocation
            if ( navigator.geolocation ) { 
                fadingMsg('Using device geolocation to get current position.');
                navigator.geolocation.getCurrentPosition ( 
                    function(position) {
                        $('#map_canvas').gmap('displayDirections', 
                        { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
                          'destination' : mapdata.destination, 'travelMode' : google.maps.DirectionsTravelMode.DRIVING},
                        { 'panel' : document.getElementById('dir_panel')},
                              function (result, status) {
                                  if (status === 'OK') {
                                      var center = result.routes[0].bounds.getCenter();
                                      $('#map_canvas').gmap('option', 'center', center);
                                      $('#map_canvas').gmap('refresh');
                                  } else {
                                    alert('Unable to get route');
                                  }
                              }
                           );         
                    }, 
                    function(){ 
                        alert('Unable to get location');
                        $.mobile.changePage($('#page-home'), {}); 
                    }); 
                } else {
                    alert('Unable to get location.');
                }            
            // END: Tracking location with device geolocation

            // START: Tracking location with test lat/long coordinates
            // Toggle between two origins to test refresh, force new route to be calculated
      /*     var position = {};
            if (toggleval) {
                toggleval = false;
                position = { coords: { latitude: 57.6969943, longitude: 11.9865 } }; // Gothenburg
            } else {
                toggleval = true;
                position = { coords: { latitude: 58.5365967, longitude: 15.0373319 } }; // Motala
            }
	*/
            $('#map_canvas').gmap('displayDirections', 
                { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
                  'destination' : mapdata.destination, 
                  'travelMode' : google.maps.DirectionsTravelMode.DRIVING },
                  { 'panel' : document.getElementById('dir_panel') },
                    function (result, status) {
                        if (status === 'OK') {
                            var center = result.routes[0].bounds.getCenter();
                            $('#map_canvas').gmap('option', 'center', center);
                            $('#map_canvas').gmap('refresh');
                        } else {
                            alert('Unable to get route');
                        }
                    }); 
            // END: Tracking location with test lat/long coordinates
    $(this).removeClass($.mobile.activeBtnClass);
    return false;
});



//maps



//maps end

