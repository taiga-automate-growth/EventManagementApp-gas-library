/**
 * 希望参加日時を表すクラス
 */
class ParticipantDate_{
  /**
   * 初期化
   * 
   * @param {String} title 参加日時　＋（残り〇名）
   */
  constructor(title){
    this.title = title;
    this.acceptFlag = false;
  }

  /**
   * 承認された
   */
  accepted(){
    this.acceptFlag = true;
  }

  /**
   * 承認されているか判定
   * 
   * @return {Boolean} 申し込まれている場合はtrue、それ以外はfalse
   */
  isAccept(){
    return this.acceptFlag;
  }

  /**
   * '(残り〇名)'を取り除き、参加日時のみ取得
   * 
   * @return {String} 参加日時＋曜日＋開始時刻＋終了時刻
   */
  getDateAndTime(){
    const index = this.title.indexOf('（残り');
    if(index === -1) throw new Error('参加日時のデータがありません');
    return this.title.substring(0, index);
  }

  /**
   * 配列で取得する
   */
  getAsArray(){
    return [this.title, this.acceptFlag];
  }

  /**
   * 等価判定
   * 
   * @param {ParticipantDate_} participantDate 参加日時リクエスト
   */
  equals(participantDate){
    if(this.title === participantDate.title) return true;
    return false;
  }

}