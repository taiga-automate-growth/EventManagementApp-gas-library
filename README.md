# EventManagementApp　Googleフォームでイベントを簡単に管理する

## 概要
Google Apps Scriptのライブラリ。Googleフォームにイベント管理機能を簡単に設定できます。
複雑なコーディングは不要で、パラメータの設定によって直感的に利用できます。

```
// イベント管理アプリをビルド
const ssId = "1PjfeHR2LK6FuUU2DyjY1PHoJsDoQwm3JdeN_yQUALg8";
const eventSheetName = "events";
const eventManagementApp = EventManagementApp.build(ssId, eventSheetName);

const formId = "1kxTsMNpYX36Q3RKPCvaeOnkqCAvz5L3AOHzYfaGHe90";
const choicesType = "multiple";
const selectParticipantDateQuestionTitle = "希望参加日時";

// フォームのイベント選択肢を初期化する
function initializeChoices(){
  eventManagementApp.initializeChoices(formId, selectParticipantDateQuestionTitle, choicesType);
}
```


## インストール
Google Apps Scriptでこのライブラリを使用するためのインストール手順です。

1.[Apps Scriptを立ち上げる](https://github.com/taiga-automate-growth/EventManagementApp-gas-library/edit/main/README.md#1%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E3%83%93%E3%83%AB%E3%83%89%E3%81%99%E3%82%8B)

2.[ライブラリをインストールする](https://github.com/taiga-automate-growth/EventManagementApp-gas-library/edit/main/README.md#%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%82%92%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB%E3%81%99%E3%82%8B)

尚、このライブラリの利用にあたり、下記が事前に設定されている前提です。

- Googleフォーム
- Googleスプレッドシート（フォームとリンクして回答を収集）
- App Sheet（オプションでQRコードリーダーを使う場合）

このライブラリとは直接関係がないため説明を省略しますが、ご不明の場合は[こちら](https://note.com/tiger_oshima/n/n01ae223a0a3a)の記事を参考にしてください。

### Apps Scriptを立ち上げる

> [!CAUTION]
> 必ずイベント管理機能を設定したいGoogleフォームの回答が集計されるスプレッドシートから立ち上げてください。

![image](https://github.com/taiga-automate-growth/EventManagementApp-gas-library/assets/172698714/3b282278-6b89-4daa-ab68-25e651aa95f5)

### ライブラリをインストールする


ライブラリタブの＋ボタンを押し↓のスクリプトIDで検索します。

スクリプトID：1GPAvWkkyiqFUiJJmRTmN41rAsi8e2Mk1Z9nwBc6qedxWA_go8fWcsPgo

![image](https://github.com/taiga-automate-growth/EventManagementApp-gas-library/assets/172698714/77f1a0f3-9fec-493b-bf58-7a1dc52b3ec8)

## 利用手順
ライブラリを利用する手順です。

### 1.アプリケーションをビルドする
EventManegementAppをインスタンスを生成します。
このインスタンスからメソッドを呼び出して機能を利用します。

```
// パラメータを設定
const ssId = "スプレッドシートID";
const eventSheetName = "イベント情報シート名";

// インスタンスを生成
const eventManagementApp = EventManagementApp.build(ssId, eventSheetName);
```
|パラメータ名|データ型|説明|例|
|---|---|---|---|
|ssId|String|回答を収集するスプレッドシートのID|1PjfeHR2LK6FuUU2DyjY1PHoJsDoQwm3JdeN_yQUALg8|
|eventSheetName|String|イベント情報を設定するシートの名前[^1]|events|

[^1]:スプレッドシートファイルの名前ではなくシートの名前です。

### 2.フォームの選択肢を初期化する

フォームの選択肢をGoogleスプレッドシートで設定したイベントの初期状態に設定します。

```
function initializeChoices(){
  // パラメータを設定
  const formId = "GoogleフォームのID";
  const selectParticipantDateQuestionTitle = "参加日時を求める質問文";
  const choicesType = "選択肢のタイプ";
  
  // フォーム選択肢初期化メソッドを実行
  eventManagementApp.initializeChoices(formId, selectParticipantDateQuestionTitle, choicesType);
}
```
|パラメータ名|データ型|説明|例|
|---|---|---|---|
|formId|String|GoogleフォームのID|1kxTsMNpYX36Q3RKPCvaeOnkqCAvz5L3AOHzYfaGHe90|
|selectParticipantDateQuestionTitle|String|イベントの参加希望日時を求める質問文|希望参加日時|
|choicesType|String|イベント情報の選択肢の形式|single or multiple[^2]|

このメソッドを

[^2]:ラジオボタンの場合はsingle、チェックボックスの場合はmultipleです。

### 3.回答者の申し込みを受け付ける
ユーザーからの回答を以下の順序で処理します。

- 申し込み判定（定員超過の場合は拒否）
- Googleフォームの選択肢更新
- QRコード作成（受理されたもののみ）
- 回答者に自動で返信

```
function onFormSubmit(e) {
  
  const nameQuestionTitle = "名前を求める質問文";
  const emailQuestionTitle = "メールアドレスを求める質問文";
  const selectParticipantDateQuestionTitle = "参加日時を求める質問文";
  const folderId = "GoogleDriveのフォルダーID";
  const formId = "GoogleフォームのID";
  const choicesType = "選択肢のタイプ";
  const subject = "メールの件名";
  const body = `メールの本文`;
  const fromAddress = "メールの送信元アドレス";
  const fromName = "送信者の表示名";
  const cc = "CCアドレス";
  const bcc = "BCCアドレス";

  eventManagementApp.acceptApplication(e, nameQuestionTitle, emailQuestionTitle, selectParticipantDateQuestionTitle, formId, choicesType, folderId, subject, body, fromAddress, fromName, cc, bcc);

}
```

|パラメータ名|データ型|説明|例|
|---|---|---|---|
|formSubmitEvent|Object|フォーム送信オブジェクト|e[^3]|
|nameQuestionTitle|String|名前を求める質問文|名前|
|emailQuestionTitle|String|メールアドレスを求める質問文|メールアドレス|
|selectParticipantDateQuestionTitle|String|イベントの参加希望日時を求める質問文|希望参加日時|
|formId|String|GoogleフォームのID|1kxTsMNpYX36Q3RKPCvaeOnkqCAvz5L3AOHzYfaGHe90|
|choicesType|String|イベント情報の選択肢の形式|single or multiple[^2]|
|folderId|String|QRコードを保存するGoogleDriveフォルダーのID|1Kfi8xnINuf_ctCatPTZhexvhcutFaCsp|
|subject|String|メールの件名|この度はお申込みいただきまして誠にありがとうございます[^4]|
|body|String|メールの本文|{{名前}} 様この度は当社主催のイベントにお申込みいただきまして誠にありがとうございました。[^4]|
|fromAddress|String|メールの送信元アドレス|sample@example.com[^5]|
|fromName|String|送信者の表示名|TAIGA OSHIMA|
|cc|String|CCアドレス|sample1@example.com,sample2@example.com[^6]|
|bcc|String|BCCアドレス|sample1@example.com,sample2@example.com[^6]|

[^3]:こちらの[公式リファレンス](https://developers.google.com/apps-script/guides/triggers/events?hl=ja)を参照してください。
[^4]:メールの件名と本文の中で、二重の波括弧で質問を囲うとその質問に対する回答に置き換えられます。例）{{メールアドレス}} → sample3@example.com
[^5]:ここに設定できるのはGmailエイリアスに登録しているアドレスのみです。
[^6]:CCとBCCのアドレスはカンマで区切れば複数指定できます。

> [!Caution]
> 回答受信時に実行されるようにトリガーの設定が必ず必要です。

![image](https://github.com/taiga-automate-growth/EventManagementApp-gas-library/assets/172698714/99cb1577-6238-4ceb-ad8d-9e153a65649b)

### 出席を管理する
QRコードを読み込んだ時に実行され、出席者をカウントします。

```
function managedAttendance(e){
  const attendanceSheetName = "attendances";
  eventManagementApp.managedAttendance(e, attendanceSheetName);
}
```

|パラメータ名|データ型|説明|例|
|---|---|---|---|
|sheetChangeEvent|Object|シート変更イベントオブジェクト|e[^3]|
|attendanceSheetName|String|出席情報を記録するシートの名前|attendances|

## 依存関係
本システムは13個のクラスで構築されています。

それぞれのクラスの依存関係を示します。

```mermaid
classDiagram
Answer 

```
