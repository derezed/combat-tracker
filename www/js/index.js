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
      //setTimeout( this.testData,500 );
  },

  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
      $(document).on('deviceready',this.onDeviceReady);
      $('nav').on('click','.btn-add-player',this.addPlayer);
      $('#cardContainer').on('click','i.cancel-btn',this.removePlayer);
      $('#cardContainer').on('click','i.edit-btn',this.editPlayer);
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

    var steps = [
      {
        title: 'Player or Creature Name:',
        input: 'text',
        focusCancel: true,
        onOpen: () => {
          app.preventFocus()
        }
      },
      {
        title: 'Initiative Roll:',
        input: 'number',
        focusCancel: true,
        onOpen: () => {
          app.preventFocus()
        }
      }
    ];

    swal.queue(steps).then((result) => {
      if(!result.dismiss){
        var context = 'addPlayer';
        var card = 'null';
        app.verifyResults(card,result,context);
      }
    });
  },

  verifyResults: function(card,result,context){
      var alphaNumeric = new RegExp("^[a-zA-Z0-9]+$");
      var numeric = new RegExp("^[0-9]*$");
      var nameCheck = false;
      var iniCheck = false;

      if(alphaNumeric.test(result.value[0])){
        nameCheck = true;
      }

      if(numeric.test(result.value[1])){
        iniCheck = true;
      }

      if(!nameCheck){
       app.throwError(error='name'); 
      }

      if(nameCheck && !iniCheck){
        app.throwError(error='initiatve');
      }

      if(nameCheck && iniCheck){
        if(context == 'addPlayer'){
          app.createPlayerCard(result);
        }else if(context == 'editPlayer'){
          app.updatePlayerInfo(card,result);
        }
      }
  },

  preventFocus: function(){
    $('.swal2-container .swal2-modal').focus();
  },

  createPlayerCard: function(result){

    var playerCard = '<div class="col s12 m6">\
        <div class="card blue-grey darken-1">\
          <div class="card-content white-text">\
            <div class="card-content-info">\
              <span class="card-title">'+result.value[0]+'</span>\
              <p>Initiative: <span class="totalIni">'+parseInt(result.value[1])+'</span></p>\
            </div>\
            <div class="card-content-controls">\
              <i class="material-icons edit-btn">edit</i>\
              <i class="material-icons cancel-btn">cancel</i>\
            </div>\
          </div>\
        </div>\
      </div>';

    var $div = $("<div>", {'class': 'row hidden','data-initiative': parseInt(result.value[1])});
    $div.append(playerCard);

    app.addCard($div);
  },

  shuffleCards: function(){
    var cardsToShuffle = $('.row');
    if(cardsToShuffle.length > 1){
      var cards = [];
      for (var i = 0; i < cardsToShuffle.length; i++){
        cards.push(cardsToShuffle[i]);
      }
      cards.sort(function(a,b){
        return b.getAttribute('data-initiative') - a.getAttribute('data-initiative');
      });

      var container = $('#cardContainer');
      container.empty();

      cards.forEach(function(el){
        container.append(el);
      });

    }
  },

  addCard: function(elementToAdd){
    var container = $('#cardContainer');
    container.append(elementToAdd);
    elementToAdd.slideDown(500).removeClass('hidden');
    app.shuffleCards();
  },

  removePlayer: function(){
    var playerCard = $(this).closest('.row');
    playerCard.slideUp(500, function(){
      $(this).remove();
    });
  },

  editPlayer: function(){
    var card = $(this).closest('.row');
    var cardContentInfo = card.find('.card-content-info');
    var player = cardContentInfo.find('.card-title').text();
    var initiative = cardContentInfo.find('.totalIni').text();

    var steps = [
      {
        title: 'Player or Creature Name:',
        input: 'text',
        inputValue: player,
        focusConfirm: 'true',
        onOpen: () => {
          app.preventFocus()
        }
      },
      {
        title: 'Initiative Roll:',
        input: 'number',
        inputValue: initiative,
        focusConfirm: 'true',
        onOpen: () => {
          app.preventFocus()
        }
      }
    ];

    swal.queue(steps).then((result) => {
      swal.resetDefaults();
      var context = 'editPlayer';
      app.verifyResults(card,result,context);
    });
  },

  updatePlayerInfo: function(card,result){
    var totalIni = parseInt(result.value[1]);
    var cardContent = card.find('.card-content-info');
    card.attr('data-initiative',totalIni);
    cardContent.find('.card-title').text(result.value[0]);
    cardContent.find('.totalIni').text(totalIni);

    app.shuffleCards();
  },

  throwError: function(error){
    if(error == 'initiatve'){
      swal(
        'Oops...',
        'Looks like the players initiative is incorrect. Please try adding or editing the player again.',
        'error'
      );
    }else if(error == 'name'){
      swal(
        'Oops...',
        'Looks like the players name is incorrect. Please try adding or editing the player again.',
        'error'
      );
    }
  }
};
