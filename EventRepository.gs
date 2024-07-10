/**
 * イベントのリポジトリを表すクラス
 */
class EventRepository_{
  /**
   * 初期化
   * 
   * @param {String} ssId イベント情報が記録されるスプレッドシートのID
   * @param {String} eventSheetName イベント情報が記録されるシートの名前
   * 
   */
  constructor(ssId, eventSheetName){
    this.ssId = ssId;
    this.eventSheetName = eventSheetName;
    console.log(this.ssId);
    this.ss = SpreadsheetApp.openById(this.ssId);
    this.sh = this.ss.getSheetByName(this.eventSheetName);
  }

  /**
   * イベントを一括で生成する
   * 
   * @return {Array<Event_>} すべてのイベントオブジェクトを含む配列
   */
  selectAll(){
    const eventDatas = this.sh.getRange(2, 1, this.sh.getLastRow() - 1, this.sh.getLastColumn()).getValues();
    return eventDatas.map(eventData => {
      const eventName = eventData[0];
      const day = eventData[1];
      const startTime = eventData[2];
      const endTime = eventData[3];
      const limit = eventData[4];
      const filled = eventData[5];
      const attendance = eventData[6];
      return new Event_(eventName, day, startTime, endTime, limit, filled, attendance);
    });
  }

  /**
   * イベントを一括で保存する
   * 
   * @param {EventCollection_} eventCollection イベントコレクションオブジェクト
   */
  saveAll(eventCollection){
    const rows = this.sh.getLastRow() - 1;
    const cols = this.sh.getLastColumn();
    this.sh.getRange(2, 1, rows, cols).clearContent();
    const events = eventCollection.getAsArray();
    this.sh.getRange(2, 1, events.length, events[0].length).setValues(events);
  }

  /**
   * 開催日からイベントを取得する
   * 
   * @param {String} date 開催日＋曜日＋開始時刻＋終了時刻
   */
  findByDateAndTime(date){
    const trimedDate = date.replace(/[～()]/g, '');
    const dateAsArray = trimedDate.split(' ');
    const eventDatas = this.sh.getRange(2, 1, this.sh.getLastRow() - 1, this.sh.getLastColumn()).getValues();
    const matchEventData = eventDatas.filter(eventData => {
      const eventDate = new Date(dateAsArray[0]);
      const day = dateAsArray[1];

      let startTime = dateAsArray[2].split(':');
      const startHours = startTime[0];
      const startMinutes = startTime[1];
      startTime = new Date(1899,11,30,startHours,startMinutes);

      let endTime = dateAsArray[4].split(':');
      const endHours = endTime[0];
      const endMinutes = endTime[1];
      endTime = new Date(1899,11,30,endHours,endMinutes);

      return eventData[0].getTime() == eventDate.getTime() && eventData[1] === day && eventData[2].getTime() == startTime.getTime() && eventData[3].getTime() == endTime.getTime();
    });
    if(matchEventData.length === 0) throw new Error('該当するイベントが見つかりませんでした');
    if(matchEventData.length > 1) throw new Error('同じ開催時刻のイベントが複数存在します');
    
    return new Event_(
      matchEventData[0][0], 
      matchEventData[0][1], 
      matchEventData[0][2],
      matchEventData[0][3], 
      matchEventData[0][4], 
      matchEventData[0][5], 
      matchEventData[0][6]
    );
  }

  /**
   * イベントを保存する
   * 
   * @param {Event_} event イベントオブジェクト
   */
  save(event){
    const eventDatas = this.sh.getRange(2, 1, this.sh.getLastRow() - 1, this.sh.getLastColumn()).getValues();
    const matchEventData = eventDatas.reduce((previous, eventData, index) => {
      const eventDate = new Date(event.eventDate);

      let startTime = event.startTime.split(':');
      const startHours = startTime[0];
      const startMinutes = startTime[1];
      startTime = new Date(1899,11,30,startHours,startMinutes);

      let endTime = event.endTime.split(':');
      const endHours = endTime[0];
      const endMinutes = endTime[1];
      endTime = new Date(1899,11,30,endHours,endMinutes);

      if(eventData[0].getTime() === eventDate.getTime() && eventData[1] === event.day && eventData[2].getTime() === startTime.getTime() && eventData[3].getTime() === endTime.getTime()){
        previous.push(index + 2);
      }
      return previous;
    },[]);
    console.log('matcheventdata', matchEventData);
    if(matchEventData.length > 1) throw new Error('同じ開催時刻のイベントが複数存在します');
    const values = event.getAsArray();
    console.log(values);
    if(matchEventData.length === 0){
      this.sh.appendRow(values);
    }else{
      this.sh.getRange(matchEventData[0], 1, 1, this.sh.getLastColumn()).setValues([values]);
    }
  }
}