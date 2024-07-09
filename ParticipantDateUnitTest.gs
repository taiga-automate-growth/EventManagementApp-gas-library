const participantDate = new ParticipantDate_('2024/8/11 (日) 11:00 ～ 12:00 （残り10名）');

function testAccepted_(){
  console.log(participantDate);
  participantDate.accepted();
  console.log(participantDate);
}

function testIsAccept_(){
  console.log(participantDate);
  console.log(participantDate.isAccept());
}

function testParticipantDateEqualstTrue_(){
  console.log(participantDate);
  const anotherParticipantDate = new ParticipantDate_('2024/8/11 (日) 11:00 ～ 12:00 （残り10名）');
  console.log(participantDate.equals(anotherParticipantDate));
}

function testParticipantDateEqualstFalse_(){
  console.log(participantDate);
  const anotherParticipantDate = new ParticipantDate_('2024/8/10 (日) 11:00 ～ 12:00 （残り10名）');
  console.log(participantDate.equals(anotherParticipantDate));
}

function testPariticipantDateGetAsArray_(){
  console.log(participantDate);
  console.log(participantDate.getAsArray());
}

function testPariticipantDateGetDataAndTime_(){
  console.log(participantDate);
  console.log(participantDate.getDateAndTime());
}