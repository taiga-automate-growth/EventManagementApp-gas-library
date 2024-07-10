/**
 * イベント主催者（フォーム製作者）を表すクラス
 */
class Organizer_{

  /**
   * 初期化
   * 
   * @param {Array<Event_>} events イベントの配列
   */
  constructor(events = []){
    this.events = events;
  }
  
  /**
   * 申し込みを受け付ける
   * 
   * @param {Applicant_} applicant 参加者オブジェクト
   */
  receiveApplication(applicant){

    // 参加者の申し込み参加日時をループ
    const participantDates = applicant.participantDates;

    for(const participantDate of participantDates){

      // 申し込み可能かどうか判定する
      const acceptance = this.canAccept(participantDate);
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

    const titles = this.events.map(event => {
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
    const participantDates = applicant.participantDates;
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
   * @param {Object} questionsWithAnswer 質問とそれに対する回答のオブジェクト
   */
  reply(mail, questionsWithAnswer){
    mail.replaceSubjectAndBody(questionsWithAnswer);
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

  /**
   * すべてのイベントを配列で取得する
   * 
   * @return {Array<Event_>} イベントの配列
   */
  getEventAsArray(){
    return this.events.map(event => {
      return event.getAsArray();
    });
  }

  
  /**
   * ある申し込み参加日時が承認可能か判定する
   * 
   * @param {ParticipantDate_} participantDate 申込参加日時 
   * @return {Boolean} 申し込み可能な場合はtrue、それ以外はfalse
   */
  canAccept(participantDate){
    for(const event of this.events){
      if(participantDate.getDateAndTime() !== event.getDateAndTime()) continue;
      if(event.isOverLimit()){
        return false;
      }else{
        event.requested();
        return true;
      }
    }
  }

}