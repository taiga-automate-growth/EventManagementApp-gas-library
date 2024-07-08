/**
 * 複数のイベントをまとめて管理するクラス
 */
class EventCollection_{
  /**
   * 初期化
   * 
   * @param {Array<Event_>} イベントオブジェクトの配列
   */
  constructor(events = []){
    this.events = events;
  }

  /**
   * すべてのイベントを配列で取得する
   * 
   * @return {Array<Event_>} イベントの配列
   */
  getAsArray(){
    return this.events.map(event => {
      return event.getAsArray();
    });
  }

  /**
   * すべてのイベントを取得する
   * 
   * @return {Array<Event_>} すべてのイベント
   */
  getAllEvents(){
    return this.events;
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