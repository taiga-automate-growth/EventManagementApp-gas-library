const event = new Event_('2024/8/11', '日', new Date('2024/8/11 11:00'), new Date('2024/8/11 12:00'), 10, 0, 0);

function testGetAsArray_(){
  const converArrayEvent = event.getAsArray();
  console.log(converArrayEvent);
}

function testIsOverLimit_(){
  console.log(event.filled, event.limit);
  event.isOverLimit();
}

function testRequested_(){
  console.log(event);
  event.requested();
  console.log(event);
}

function testJoined_(){
  console.log(event);
  event.joined();
  console.log(event);
}

function testCalculateRemained_(){
  console.log(event);
  console.log(event.calculateRemained());
}

function testEquals_(){
  const prepareEvent = new Event_('2024/8/11', '日', new Date('2024/8/11 11:00'), new Date('2024/8/11 12:00'), 10, 0, 0);
  console.log(event);
  console.log(event.equals(prepareEvent));
}

function testGetAsFormChoicesTitle_(){
  console.log(event);
  console.log(event.getAsFormChoicesTitle());
}

function testGetDateAndTime_(){
  console.log(event);
  console.log(event.getDateAndTime());
}
