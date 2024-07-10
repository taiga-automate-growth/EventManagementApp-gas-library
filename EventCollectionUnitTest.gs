// const eventCollection = new EventCollection_(new EventRepository_(ssId, eventSheetName).selectAll());

function testCanAccept_(){
  const participantDate = new ParticipantDate_('2024/8/11 (日) 11:00 ～ 12:00 （残り10名）');
  const acceptance = eventCollection.canAccept(participantDate);
  console.log(acceptance);
}

function testEventCollectionGetAsArray_(){
  const array = eventCollection.getAsArray();
  console.log(array);
}