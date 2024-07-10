/**
 * メールを表すクラス
 */
class Mail_{

  /**
   * 初期化
   * 
   * @param {String} subject メールの件名
   * @param {String} body メールの本文
   * @param {String} fromAddress 送信元アドレス
   * @param {String} fromName 送信元表示名
   * @param {String} cc CC
   * @param {String} bcc BCC
   * @param {Array<Blob>} attachments 添付ファイルの配列
   */
  constructor(recipient, subject, body, fromAddress, fromName, cc, bcc, attachments){
    this.recipient = recipient;
    this.subject = subject;
    this.body = body;
    this.options = {};
    if(fromAddress !== undefined){
      if(!fromAddress in this.getAilias()) throw new Error('エイリアスとして設定されていないアドレスからは送信できません');
      this.options['from'] = fromAddress;
    }
    fromName !== undefined ? this.options['name'] = fromName: "";
    cc !== undefined ? this.options['cc'] = cc: "";
    bcc !== undefined ? this.options['bcc'] = bcc: "";
    attachments !== undefined ? this.options['attachments'] = attachments: "";
  }

  /**
   * 送信された
   */
  sent(){
    GmailApp.sendEmail(this.recipient, this.subject, this.body, this.options);
  }

  /**
   * 件名と本文の質問を回答に置換
   * 
   * @param {Object} questionsWithAnswer 質問とそれに対する回答のオブジェクト
   */
  replaceSubjectAndBody(questionsWithAnswer){
    Object.keys(questionsWithAnswer).forEach(question => {
      this.subject = this.subject.split(`{{${question}}}`).join(questionsWithAnswer[question]);
      this.body = this.body.split(`{{${question}}}`).join(questionsWithAnswer[question]);
    });
  }

  /**
   * 添付ファイルをZipにまとめる
   * 
   * @param {String} zipFileName Zipファイルの名前
   */
  attachmentToZip(zipFileName){
    if('attachments' in this.options){
      console.log(this.options['attachments']);
     this.options['attachments'] = [Utilities.zip(this.options['attachments'], `${zipFileName}.zip`)];
    }
  }

  /**
   * エイリアスを取得する
   */
  getAilias(){
    return GmailApp.getAliases();
  }
}