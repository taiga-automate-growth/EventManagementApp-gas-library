/**
 * フォームの回答を表すクラス
 */
class Answer_{
  /**
   * 初期化
   * 
   * @param {String} e フォームの回答送信イベントオブジェクト
   */
  constructor(e){
    this.values = e.namedValues;
  }

  /**
   * 質問文から回答を取得する
   * 
   * @param {String} questionTitle 取得したい回答の質問文
   * @return {Array<String>} ある一つの質問に対する回答の配列（複数回答でない場合も配列として返却される）
   */
  getByQuestionTitle(questionTitle){
    if(!questionTitle in this.values) throw new Error(`${questionTitle}という質問文はフォームに存在しません`);
    return this.values[questionTitle];
  }

  /**
   * 全質問とその回答を取得する
   */
  getAllQuestionWithAnswer(){
    return this.values;
  }
}