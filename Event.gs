/**
 * イベントを表すクラス
 */
class Event_{
  /**
   * 初期化
   * 
   * @param {String} eventDate 開催日
   * @param {String} day 曜日
   * @param {String} startTime 開催時刻
   * @param {String} endTime 終了時刻
   * @param {Number} limit 定員数　最低1人以上
   * @param {Number} filled すでに申し込まれた人数
   * @param {Number} attendance 出席人数
   */
  constructor(eventDate, day, startTime, endTime , limit = 1, filled = 0, attendance = 0){
    const convertedDate = new Date(eventDate);
    const year = convertedDate.getFullYear();
    const month = convertedDate.getMonth() + 1;
    const date = convertedDate.getDate();
    this.eventDate = `${year}/${month}/${date}`;
    this.day = day;
    this.startTime = Utilities.formatDate(startTime, 'Asia/Tokyo', 'HH:mm');
    this.endTime = Utilities.formatDate(endTime, 'Asia/Tokyo', 'HH:mm');
    this.limit = limit;
    this.filled = filled;
    this.attendance = attendance;
  }

  /**
   * 残りの応募可能枠を算出する
   * 
   * @return {Number} 残りの応募可能枠
   */
  calculateRemained(){
    return this.limit - this.filled;
  }

  /**
   * 申し込まれた
   */
  requested(){
    this.filled++;
  }

  /**
   * 参加された
   */
  joined(){
    this.attendance++
  }

  /**
   * 定員を超過しているか判定する
   * 
   * @return {Boolean} 超過している場合はtrueそれ以外はfalse
   */
  isOverLimit(){
    if(this.limit > this.filled) return false;
    return true;
  }

  /**
   * 配列として取得する
   * 
   * @return {Array} 配列のイベント情報
   */
  getAsArray(){
    return [this.eventDate, this.day, this.startTime, this.endTime, this.limit, this.filled, this.attendance];
  }

  /**
   * 等価判定
   * 
   * @return {Boolean} 開催日、開始時刻、終了時刻の全てが同じ場合はtrue、それ以外はfalse
   */
  equals(event){
    if(this.eventDate === event.eventDate && this.startTime === event.startTime && this.endTime === event.endTime) return true;
    return false;
  }

  /**
   * フォームの選択肢タイトルとして取得する
   * 
   * @return {String} 
   */
  getAsFormChoicesTitle(){
    return `${this.eventDate} (${this.day}) ${this.startTime} ～ ${this.endTime}（残り${this.calculateRemained()}名）`;
  }

  /**
   * 参加日時のみのテキストとして取得する
   * 
   * @return {String} 
   */
  getDateAndTime(){
    return `${this.eventDate} (${this.day}) ${this.startTime} ～ ${this.endTime}`;
  }
}