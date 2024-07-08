class Participant_{

  /**
   * 初期化
   * 
   * @param {String} scanData QRコードでスキャンしたデータ
   */
  constructor(scanData){
    this.scanData = scanData;
  }

  /**
   * 名前を取得する
   * 
   * @return {String} 参加者氏名
   */
  getName(){
    const splitIndex = this.scanData.indexOf("*");
    return scanData.substring(0,splitIndex);
  }

  /**
   * 参加日時を取得する
   * 
   * @return {String} 参加日時
   */
  getDate(){
    const splitIndex = this.scanData.indexOf("*");
    return this.scanData.substring(splitIndex + 1, this.scanData.length);
  }
}