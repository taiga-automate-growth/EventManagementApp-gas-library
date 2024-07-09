const organizer = new Organizer_(new EventCollection_(new EventRepository_(ssId, eventSheetName).selectAll()));


function testReceriveApplication_(){
  const applicant = new Applicant_('', 'rugbyhanazono02@gmail.com', new ParticipantDateCollection_([new ParticipantDate_('2024/8/11 (日) 11:00 ～ 12:00 （残り10名）')]));
  organizer.receiveApplication(applicant);
}

function testCreateQR_(){
  const participantDate = new ParticipantDate_('2024/8/11 (日) 11:00 ～ 12:00 （残り10名）');
  const applicant = new Applicant_('', 'rugbyhanazono02@gmail.com', new ParticipantDateCollection_([participantDate]));
  applicant.accepted(participantDate);
  organizer.createQR(applicant, '');
}
