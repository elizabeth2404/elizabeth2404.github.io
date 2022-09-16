'use strict';
(function() {
  let bedNum = 0;
  let totalRoomArea = 0;
  window.addEventListener('load', init);

  // setup first button
  function init() {
    let propForm = id('prop-form');
    propForm.addEventListener('submit', function(e) {
      e.preventDefault();
      displayBedCards();
    });
  }

  // display bedroom cards based on number given in prop details
  function displayBedCards() {
    bedNum = id('bed-num').value;
    console.log(bedNum);
    // attach bedroom cards to DOM tree
    let parent = id('rooms');
    parent.innerHTML = ''; // reset when clicked
    let header = document.createElement('h2');
    header.textContent = 'Individual Room Details';
    parent.appendChild(header);
    let instruct = document.createElement('h3');
    instruct.textContent = 'For each room, input all required information. If more than one person' +
    ' is sharing a room, update the "number of people in this room" field before calculating.';
    parent.appendChild(instruct);
    let allRoomsForm = document.createElement('form');
    allRoomsForm.setAttribute('id', 'room-form');

    allRoomsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculate();
    });

    parent.appendChild(allRoomsForm);
    for (let totalCards = 0; totalCards < bedNum; totalCards++) {
      let singleCard = generateCard(totalCards + 1); // attach card to section
      singleCard.setAttribute('id', 'card' + (totalCards + 1));
      allRoomsForm.appendChild(singleCard);
    }
    let div = document.createElement('div');
    let btn = document.createElement('button');
    div.appendChild(btn);
    btn.innerHTML = 'Calculate Monthly Rent!';
    btn.setAttribute('id', 'final-btn');
    allRoomsForm.appendChild(div);
  }

  // generate a single bedroom card with necessary inputs
  function generateCard(roomNum) {
    let card = document.createElement('div');
    let roomTitle = document.createElement('p');
    roomTitle.textContent = 'Room ' + roomNum;
    card.appendChild(roomTitle);
    let inputs = document.createElement('div');
    card.appendChild(inputs);

    // name field
    let name = document.createElement('label');
    name.innerHTML = 'Tenant Name(s)';
    inputs.appendChild(name);
    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.setAttribute('id', 'name');
    //nameInput.required = 'required';
    nameInput.placeholder = 'Type here...';
    //nameInput.innerHTML = 'type="text" id="name" required';
    inputs.appendChild(nameInput);

    // roommate number field
    let roommates = document.createElement('label');
    roommates.innerHTML = 'Number of people in this room';
    inputs.appendChild(roommates);
    let shareInput = document.createElement('input');
    shareInput.type = 'number';
    shareInput.setAttribute('class', 'share'); // TODO CSS MAKE SHORTER
    shareInput.value = 1; // default
    shareInput.min = 1;
    shareInput.required = 'required';
    inputs.appendChild(shareInput);


    // sq ft field
    let footage = document.createElement('label');
    footage.innerHTML = 'Room Sq ft';
    inputs.appendChild(footage);
    let footInput = document.createElement('input');
    footInput.setAttribute('class', 'room-ft'); // QUERY LATER TO FIND TOTALS
    footInput.type = 'number';
    footInput.setAttribute('id', 'ft' + roomNum);
    footInput.placeholder = '110.00';
    footInput.step = '0.01';
    footInput.required = 'required';
    //footInput.innerHTML = 'type="number" id="sq-ft" placeholder="110.00" step="0.01" min="0" required';
    inputs.appendChild(footInput);

    // rent result
    let rent = document.createElement('p');
    rent.setAttribute('id', 'rentRes' + roomNum);
    rent.textContent = 'Rent for room ' + roomNum + ': TBD'; // TODO TACK ON FINAL PRICE AFTER
    inputs.appendChild(rent);

    return card;
  }

  // calculate rent for each card
  function calculate() {
    // check tenant number matches
    checkTenant();

    // get total sq ft of rooms
    totalRoomArea = getRoomTotal();
    console.log('roomstotal ' + totalRoomArea);
    // get total shared area
    let propArea = id('sq-ft').value;
    console.log('house area' + propArea);
    let sharedArea = propArea - totalRoomArea;
    console.log('shared ' + sharedArea);
    // CALCULATE FOR EACH BEDROOM CARD
    let rooms = qsa('.room-ft');
    console.log(rooms);
    let totalRent = id('rent').value;
    console.log('totalrent ' + totalRent);
    // QUERY FOR ROOMMATES FIELD
    let roommatesQuery = qsa('.share');
    for (let i = 0; i < rooms.length; i++) {
      let roomNum = i + 1;
      let area = Number(rooms[i].value); //
      console.log('currroomarea ' + area);
      let frac1 = area / Number(propArea); //
      console.log('frac1 ' + frac1);
      let frac2 = sharedArea / Number(propArea);
      console.log('frac2' + frac2);
      let total = (frac1 + (frac2 / bedNum)) * totalRent;
      total = Math.round(total * 100) / 100;
      console.log('total' + total);
      let res = id('rentRes' + roomNum);

      // check if this room is being shared
      if (roommatesQuery[i].value != 1) {
        let split = total / roommatesQuery[i].value;
        split = Math.round(split * 100) / 100;
        res.textContent = 'Rent for room ' + roomNum + ': $' + total + ' total ($' + split +
        ' per person).';
      } else {
        res.textContent = 'Rent for room ' + roomNum + ': $' + total;
      }
      res.classList.add('calculated');
    }

  }

  function checkTenant() {
    let roommatesQuery = qsa('.share');
    let tenants = id('tenant-num').value;
    let total = 0;
    for (let i = 0; i < roommatesQuery.length; i++) {
      total += Number(roommatesQuery[i].value);
    }
    console.log(total + 'ten ' + Number(tenants));
    if (total != tenants) {
      alert('The number of tenants does not match the total roommates for all rooms.' +
      ' Please double check all inputs to ensure accurate calculations!');
    }
  }

  function getRoomTotal() {
    let rooms = qsa('.room-ft');
    let total = 0;
    for (let i = 0; i < rooms.length; i++) {
      total += Number(rooms[i].value); // todo or parseFloat()
    }
    return total;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
   function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} query - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

})();