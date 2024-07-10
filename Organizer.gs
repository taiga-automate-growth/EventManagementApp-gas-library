/**
 * イベント主催者（フォーム製作者）を表すクラス
 */
class Organizer_{

  /**
   * 初期化
   * 
   * @param {EventCollection_} eventCollection イベントコレクションオブジェクト
   */
  constructor(eventCollection){
    this.eventCollection = eventCollection;
  }
  
  /**
   * 申し込みを受け付ける
   * 
   * @param {Applicant_} applicant 参加者オブジェクト
   */
  receiveApplication(applicant){

    // 参加者の申し込み参加日時をループ
    const participantDates = applicant.participantDateCollection.getAllParticipantDates();

    for(const participantDate of participantDates){

      // 申し込み可能かどうか判定する
      const acceptance = this.eventCollection.canAccept(participantDate);
      // 申し込み可能なら参加者が申し込まれたことにする
      if(acceptance) applicant.accepted(participantDate);
    }
  }

  /**
   * 選択肢を更新する
   * 
   * @params {ParticipantDateQuestion_} question 選択肢を更新する対象になるフォームの質問
   */
  refreshChoices(question){
    const events = this.eventCollection.getAllEvents();

    const titles = events.map(event => {
      return event.getAsFormChoicesTitle();
    })

    question.refreshedChoices(titles);
  }

  /**
   * QRコードを作る
   * 
   * @param {Applicant_} applicant 参加者オブジェクト
   * @param {String} folderId QRを保存するフォルダーのID
   */
  createQR(applicant, folderId){
    const participantDates = applicant.participantDateCollection.getAllParticipantDates();
    console.log(participantDates);
    for (const participantDate of participantDates){
      console.log(participantDate);
      if(!participantDate.isAccept()) continue;
      const convertText = `${applicant.name}*${participantDate.getDateAndTime()}`;
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${convertText}&size=200x200`;
      const option = {
        method:'GET',
        muteHttpExceptions:true
      }
      const response = UrlFetchApp.fetch(url,option);
      const statusCode = response.getResponseCode();
      if(statusCode !== 200){
        console.log(response.getContentText());
        return;
      }
      const qrcode = response.getBlob().setName(`${convertText}.png`);
      console.log(qrcode);
      DriveApp.getFolderById(folderId).createFile(qrcode);
      applicant.addQR(qrcode);
    }
  }

  /**
   * 返信する
   * 
   * @param {Mail_} mail メールオブジェクト
   * @param {Answer_} answer 回答オブジェクト
   */
  reply(mail, answer){
    mail.replaceSubjectAndBody(answer);
    mail.sent();
  }

  /**
   * 出席を受け付ける
   * 
   * @param {Event_} event イベントオブジェクト
   */
  receiveAttendance(event){
    event.joined();
  }
}