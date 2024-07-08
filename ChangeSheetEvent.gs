/**
 * シート変更イベント
 */
class ChangeSheetEvent_{
  /**
   * 初期化
   * 
   * @param {EventObject} e スプレッドシート変更イベントオブジェクト
   */
  constructor(e){
    this.activeCell = e.source.getActiveCell();
    this.type = e.changeType;
  }

  /**
   * 処理対象のシートに属するか判定する
   * 
   * @param {String} targetSheetName 処理対象となるシートの名前
   * @return {Boolean} 対象のシートの場合はtrue、それ以外はfalse
   */
  isBelongToTargetSheet(targetSheetName){
    if(this.activeCell.getSheet().getName() === targetSheetName) return true;
    return false;
  }
  
  /**
   * 値が書き加えられたあるいは変更されたイベントか判定する
   * 
   * @return {Boolean} 書き加えられたあるいは変更された場合はtrue、それ以外はfalse
   */
  isValueExsist(){
    if(this.activeCell.getValue() !== "") return true;
    return false;
  }

  /**
   * QRスキャンしたデータを取得する
   * 
   * @return {String} QRスキャンしたデータ
   */
  getScanData(){
    return this.activeCell.getValue();
  }
}