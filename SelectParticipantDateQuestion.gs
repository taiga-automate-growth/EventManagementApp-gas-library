/**
 * イベント参加日時選択の質問を表すクラス
 */
class SelectParticipantDateQuestion_{
  /**
   * 初期化
   * 
   * @param {String} formId GoogleフォームのID
   * @param {String} title 質問文
   * @param {String} type 選択肢のタイプ　single or multiple
   */
  constructor(formId, title, type){
    this.formId = formId;
    this.title = title;
    this.type = type;
    this.create()
  }

  /**
   * 質問を生成する
   */
  create(){
    // フォームを取得
    const form = FormApp.openById(this.formId);

    // 全質問を取得
    const questions = form.getItems();

    // 全質問から質問文が一致するものを取得
    const question = questions.filter(question => {
      return question.getTitle() === this.title;
    });

    // 選択肢のタイプによって質問を取得
    switch(this.type){
      case "multiple":
        this.question = question[0].asCheckboxItem();
        break;
      case "single":
        this.question = question[0].asMultipleChoiceItem();
        break;
      default:
       break;
    }

  }

  /**
   * 選択肢を更新された
   * 
   * @param {Array<String>} choiceTitles 選択肢のタイトル配列
   */
  refreshedChoices(choiceTitles){
    const choices = choiceTitles.map(title => {
      return this.question.createChoice(title);
    });
    this.question.setChoices(choices);
  }
}