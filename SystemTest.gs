// イベント管理アプリをビルド
const ssId = "";
const eventSheetName = "events";
const eventManagementApp = new EventManagementApp_(ssId, eventSheetName);


const formId = "";
const choicesType = "multiple";
const selectParticipantDateQuestionTitle = "希望参加日時";

/**
 * フォームのイベント選択肢を初期化する
 */
function formInit_(){
  eventManagementApp.initializeChoices(formId, selectParticipantDateQuestionTitle, choicesType);
}

/**
 * フォームから回答されたときの処理
 */
function onFormSubmit_() {
  const e = {
    namedValues:{
      'メールアドレス':[''],
      '名前': ['大島大河'],
      '希望参加日時': ['2024/8/11 (日) 11:00 ～ 12:00 （残り10名）, 2024/8/11 (日) 12:00 ～ 13:00（残り10名）']
    }
  }
  const nameQuestionTitle = "名前";
  const emailQuestionTitle = "メールアドレス";
  const folderId = "";
  const subject = "この度はお申込みいただきまして誠にありがとうございます";
  const body = `{{名前}} 様
  この度は当社主催のイベントにお申込みいただきまして誠にありがとうございました。`;
  const fromAddress = "";
  const fromName = "";
  const cc = "";
  const bcc = "";

  eventManagementApp.acceptApplication(e, nameQuestionTitle, emailQuestionTitle, selectParticipantDateQuestionTitle, formId, choicesType, folderId, subject, body, fromAddress, fromName, cc, bcc);

}

/**
 * 出席情報が記録されたとき
 */
function onEdit_(){
  const e = {
    range:SpreadsheetApp.openById(ssId).getSheetByName(eventSheetName).getRange(1,1)
  }
  eventManagementApp.managedAttendance(e, 'attendances');
}
