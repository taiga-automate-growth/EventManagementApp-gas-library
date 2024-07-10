/**
 * イベント管理アプリケーション
 */
class EventManagementApp_{

  /**
   * 初期化
   * 
   * @param {String} ssId イベント情報が記録されるスプレッドシートのID
   * @param {String} eventSheetName イベント情報が記録されるシートの名前
   */
  constructor(ssId, eventSheetName){
    this.ssId = ssId;
    this.eventSheetName = eventSheetName;
  }

  /**
   * 申し込みを受け付ける
   * 
   * @param {EventObject} formSubmitEvent フォームの回答送信イベントオブジェクト
   * @param {String} nameQuestionTitle Googleフォームの名前を求める質問文
   * @param {String} emailQuestionTitle Googleフォームのメールアドレスを求める質問文
   * @param {String} participantDateQuestionTitle Googleフォームのイベント参加日時選択を求める質問文
   * @param {String} formId GoogleフォームのID
   * @param {String} choicesType 参加日時を求める質問の選択肢のタイプ checkbox or radio
   * @param {String} folderId QRコードを保存しておくGoogle Drive上のフォルダーID
   * @param {String} subject メールの件名
   * @param {String} body メールの本文
   * @param {String} fromAddress 送信元アドレス
   * @param {String} fromName 送信元表示名
   * @param {String} cc CC
   * @param {String} bcc BCC
   * 
   */
  acceptApplication(e, nameQuestionTitle, emailQuestionTitle, participantDateQuestionTitle, formId, choicesType, folderId, subject, body, fromAddress, fromName, cc, bcc){

    // イベントテーブルの上書きを防止するため、コンテナされているスプレッドシートをロック
    const lock = LockService.getDocumentLock();
    if(lock.tryLock(20 * 2000)){

      // 回答インスタンスを生成
      const answer = new Answer_(e);

      // 申請者をインスタンス化
      const name = answer.getByQuestionTitle(nameQuestionTitle)[0];
      const email = answer.getByQuestionTitle(emailQuestionTitle)[0];
      let participantDates = answer.getByQuestionTitle(participantDateQuestionTitle)[0].split(', ');
      participantDates = participantDates.map(participantDate => {
        return new ParticipantDate_(participantDate);
      });
      const applicant = new Applicant_(name, email, participantDates);

      // 主催者をインスタンス化
      const eventRepository = new EventRepository_(this.ssId,this.eventSheetName);
      const events = eventRepository.selectAll();
      const organizer = new Organizer_(events);
      
      // 主催者が申し込みを受け付ける
      organizer.receiveApplication(applicant);

      // イベントリポジトリが更新されたイベント情報をテーブルに保存
      eventRepository.saveAll(organizer.getEventAsArray());

      // 主催者がフォームの選択肢を更新
      const participantQuestion = new ParticipantDateQuestion_(formId, participantDateQuestionTitle, choicesType);
      organizer.refreshChoices(participantQuestion);

      // 主催者がQRコードを発行
      organizer.createQR(applicant, folderId);

      // 主催者が参加者に返信
      body += applicant.getRequestResult();
      const mail = new Mail_(applicant.email, subject, body, fromAddress, fromName, cc, bcc, applicant.qrcodes);
      mail.attachmentToZip(`${applicant.name} 様 QRコード`);
      organizer.reply(mail, answer);
    }
  }

  /**
   * 出席情報を管理する
   * 
   * @param {EventObject} sheetChangeEventObject スプレッドシート変更イベントオブジェクト
   * @param {String} attendanceSheetName 
   */
  managedAttendance(sheetChangeEventObject, attendanceSheetName){

    // シート編集イベントをインスタンス化
    const sheetChangeEvent = new SheetChangeEvent_(sheetChangeEventObject);
    if(!sheetChangeEvent.isBelongToTargetSheet(attendanceSheetName) || !sheetChangeEvent.isValueExsist()) return false;

    // 参加者をインスタンス化
    const participantDatas = sheetChangeEvent.getScanData();
    const participant = new Participant_(participantDatas);

    // 主催者は出席を受け付ける
    const eventRepository = new EventRepository_(this.ssId,this.eventSheetName);
    const event = eventRepository.findByDateAndTime(participant.getDate());
    console.log(event);
    const organizer = new Organizer_();
    organizer.receiveAttendance(event);
    eventRepository.save(event);
  }

  /**
   * フォームの選択肢を初期化する
   * 
   * @param {String} formId GoogleフォームのID
   * @param {String} participantDateQuestionTitle Googleフォームのイベント参加日時選択を求める質問文
   * @param {String} choicesType 参加日時を求める質問の選択肢のタイプ checkbox or radio
   * 
   */
  initializeChoices(formId, participantDateQuestionTitle, choicesType){
    
    // 主催者をインスタンス化
    const eventRepository = new EventRepository_(this.ssId,this.eventSheetName);
    const events = eventRepository.selectAll();
    const organizer = new Organizer_(events);

    // 主催者がフォームの参加日時選択肢を更新
    const participantQuestion = new ParticipantDateQuestion_(formId, participantDateQuestionTitle, choicesType);
    organizer.refreshChoices(participantQuestion);

  }
}

/**
 * ビルドメソッド
 * 
 * @param {String} ssId イベント情報が記録されるスプレッドシートのID
 * @param {String} eventSheetName イベント情報が記録されるシートの名前
 * @return {EventManagementApp}
 */
function build(ssId, eventSheetName){
  return new EventManagementApp_(ssId, eventSheetName);
}

/**
 * 申し込みを受け付ける
 * 
 * @param {EventObject} formSubmitEvent フォームの回答送信イベントオブジェクト
 * @param {String} nameQuestionTitle Googleフォームの名前を求める質問文
 * @param {String} emailQuestionTitle Googleフォームのメールアドレスを求める質問文
 * @param {String} selectParticipantDateQuestionTitle Googleフォームのイベント参加日時選択を求める質問文
 * @param {String} formId GoogleフォームのID
 * @param {String} choicesType 参加日時を求める質問の選択肢のタイプ checkbox or radio
 * @param {String} folderId QRコードを保存しておくGoogle Drive上のフォルダーID
 * @param {String} subject メールの件名
 * @param {String} body メールの本文
 * @param {String} fromAddress 送信元アドレス
 * @param {String} fromName 送信元表示名
 * @param {String} cc CC
 * @param {String} bcc BCC
 * 
 */
function acceptApplication(e, nameQuestionTitle, emailQuestionTitle, selectParticipantDateQuestionTitle, formId, choicesType, folderId, subject, body, fromAddress, fromName, cc, bcc){
  throw new Error('EventManagementAppのインスタンスメソッドのため呼び出せません');
}

/**
 * 出席情報を管理する
 * 
 * @param {EventObject} sheetChangeEvent スプレッドシート変更イベントオブジェクト
 * @param {String} attendanceSheetName 
 */
function managedAttendance(e, attendanceSheetName){
  throw new Error('EventManagementAppのインスタンスメソッドのため呼び出せません');
}

/**
 * フォームの選択肢を初期化する
 * 
 * @param {String} formId GoogleフォームのID
 * @param {String} selectParticipantDateQuestionTitle Googleフォームのイベント参加日時選択を求める質問文
 * @param {String} choicesType 参加日時を求める質問の選択肢のタイプ checkbox or radio
 * 
 */
function initializeChoices(formId, selectParticipantDateQuestionTitle, choicesType){
  throw new Error('EventManagementAppのインスタンスメソッドのため呼び出せません');
}