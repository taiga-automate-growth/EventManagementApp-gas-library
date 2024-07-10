// const eventRepository = new EventRepository_(ssId, eventSheetName);

function testSelectAll_(){
  const allData = eventRepository.selectAll();
  console.log(allData);
}

function testSaveAll_() {
  const eventCollection = new EventCollection_(eventRepository.selectAll());
  eventRepository.saveAll(eventCollection);
}

function testFindByDateAndTime_(){
  const participant = new Participant_('*2024/8/11 (日) 12:00 ～ 13:00');
  const event = eventRepository.findByDateAndTime(participant.getDate());
  console.log(event);
}
