/**
 * イベント参加申請者（フォーム回答者）を表すクラス
 */
class Applicant_{
  /**
   * 初期化
   * 
   * @param {String} name 参加者氏名
   * @param {String} email メールアドレス
   * @param {ParticipantDateCollection_} participantDateCollection 参加日時のコレクションオブジェクト
   */
  constructor(name, email, participantDateCollection){
    this.name = name;
    this.email = email;
    this.participantDateCollection = participantDateCollection;
    this.qrcodes = [];
  }

  /**
   * 申込が承認された
   * 
   * @param {ParticipantDate_} acceptedParticipantDate 承認された参加日時申し込み
   */
  accepted(acceptedParticipantDate){
    this.participantDateCollection.accepted(acceptedParticipantDate);
  }

  /**
   * QRコードを追加する
   * 
   * @param {Blob} qrcode QRコードのBlobデータ
   */
  addQR(qrcode){
    this.qrcodes.push(qrcode);
  }

  /**
   * メール本文に出力する申し込み結果を取得する
   * 
   * @param {String} 申し込みの成否のテキスト
   */
  getRequestResult(){
    return this.participantDateCollection.getRequestResult();
  }
}