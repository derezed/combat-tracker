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
        setTimeout( this.testData,500 );
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        $(document).on('deviceready',this.onDeviceReady);
        $('nav').on('click','.btn-add-player',this.addPlayer);
        $('#cardContainer').on('click','i.cancel-btn',this.removePlayer);
    },

    testData: function(){
      var result = {
        value: ['Trevor','10','5']
      };

      app.createPlayerCard(result);

      var result2 = {
        value: ['Kevin','15','5']
      };

      app.createPlayerCard(result2);

      var result3 = {
        value: ['Matt','20','5']
      };

      app.createPlayerCard(result3);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {

    },

    addPlayer: function(){
      swal.setDefaults({
        input: 'text',
        confirmButtonText: 'Next &rarr;',
        showCancelButton: true,
        progressSteps: ['1', '2', '3']
      });

      var steps = [
        {
          title: 'Player or Creature Name:',
          input: 'text',
          focusConfirm: 'false'
        },
        {
          title: 'Initiative Roll:',
          input: 'number',
          focusConfirm: 'false'
        },
        {
          title: 'Modifier:',
          input: 'number',
          focusConfirm: 'false'
        }
      ]

      swal.queue(steps).then((result) => {
        swal.resetDefaults()
        app.createPlayerCard(result);
      });
    },

    createPlayerCard: function(result){
      var totalIni = parseInt(result.value[1]) + parseInt(result.value[2]);

      var playerCard = '<div class="col s12 m6">\
          <div class="card blue-grey darken-1">\
            <div class="card-content white-text">\
              <div class="card-content-info">\
                <span class="card-title">'+result.value[0]+'</span>\
                <p>Total: '+totalIni+', Roll: '+result.value[1]+', Mod: '+result.value[2]+'</p>\
              </div>\
              <div class="card-content-controls">\
                <i class="material-icons cancel-btn">cancel</i>\
              </div>\
            </div>\
          </div>\
        </div>';

      var div = document.createElement('div');
      div.className = 'row';
      div.setAttribute('data-initiative',totalIni);
      div.innerHTML = playerCard;


      var container = document.getElementById('cardContainer');
      container.appendChild(div);

      //app.addRemoveListeners();
      app.shuffleCards();
    },
    shuffleCards: function(){
      var cardsToShuffle = document.getElementsByClassName('row');
      if(cardsToShuffle.length > 1){
        var cards = [];
        for (var i = 0; i < cardsToShuffle.length; i++){
          cards.push(cardsToShuffle[i]);
        }
        cards.sort(function(a,b){
          return b.getAttribute('data-initiative') - a.getAttribute('data-initiative');
        });

        var container = document.getElementById('cardContainer')
        container.innerHTML = '';

        cards.forEach(function(el){
          container.appendChild(el);
        });

      }
    },

    removePlayer: function(){
      console.log('clicked');
    },
};
