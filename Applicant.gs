/**
 * イベント参加申請者（フォーム回答者）を表すクラス
 */
class Applicant_{
  /**
   * 初期化
   * 
   * @param {String} name 参加者氏名
   * @param {String} email メールアドレス
   * @param {Array<ParticipantDate_>} participantDates 参加日時情報の配列
   * 
   */
  constructor(name, email, participantDates = []){
    this.name = name.replace(/\s+/g, '');
    this.email = email;
    this.participantDates = participantDates;
    this.qrcodes = [];
  }

  /**
   * 申込が承認された
   * 
   * @param {ParticipantDate_} acceptedParticipantDate 承認された参加日時申し込み
   */
  accepted(acceptedParticipantDate){
    for (const pariticipantDate of this.participantDates){
      if(!pariticipantDate.equals(acceptedParticipantDate)) continue;
      pariticipantDate.accepted();
      return;
    }
  }

  /**
   * すべての参加日時申し込みを配列で取得する
   * 
   * @return {Array<ParticipantDate_>} すべてのイベントの配列データ
   */
  getParticipantDatesAsArray(){
    return this.participantDates.map(participantDate => {
      return participantDate.getAsArray();
    })
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
    const result = {
      success:[],
      failed:[]
    };

    for (const pariticipantDate of this.participantDates){
      if(pariticipantDate.isAccept()){
        result.success.push(pariticipantDate.getDateAndTime());
      }else{
        result.failed.push(pariticipantDate.getDateAndTime());
      }
    }

    let text = "\n\n";
    result.success.length > 0 ? text += "【お申込み日時】\n\n・" + result.success.join("\n・") + "\n\n":"";
    result.failed.length > 0 ? text += "【お申込み失敗日時】\n\n・" + result.failed.join("\n・") + "\n\n大変申し訳ございませんが定員超過によりご予約できませんでした。":"";
    return text;
  }
}