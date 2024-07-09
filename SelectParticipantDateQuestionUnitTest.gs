const selectParticipantDateQuestion = new SelectParticipantDateQuestion_(formId, selectParticipantDateQuestionTitle, choicesType);

function testCreate_(){
  console.log(selectParticipantDateQuestion)
  selectParticipantDateQuestion.create();
  console.log(selectParticipantDateQuestion)
}

function testrefreshedChoices_(){
  selectParticipantDateQuestion.refreshedChoices(['a','b','c'])
}