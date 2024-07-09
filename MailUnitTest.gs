const applicant = new Applicant_('', '', new ParticipantDateCollection_([new ParticipantDate_('2024/8/11 (日) 11:00 ～ 12:00 （残り10名）')]));
const qrcode = DriveApp.getFileById('').getBlob();
applicant.addQR(qrcode);
const subject = 'この度はお申込みいただきまして誠にありがとうございます';
const body = `{{名前}} 様
この度はお申込みいただきまして誠にありがとうございます。下記日程でご応募承っております。
{{希望参加日時}}
`;
const fromAddress = '';
const fromName = '';
const cc = '';
const bcc = '';

const mail = new Mail_(applicant.email, subject, body, fromAddress, fromName, cc, bcc, applicant.qrcodes);

const answer = new Answer_({
  namedValues:{
    'メールアドレス':[''],
    '名前': [''],
    '希望参加日時': ['2024/8/11 (日) 11:00 ～ 12:00 （残り10名）']
  }
})

function testReplace_(){
  console.log(mail);
  mail.replaceSubjectAndBody(answer);
  console.log(mail);
}

function testAttachmentToZip_(){
  mail.attachmentToZip(' 様 QRコード');
}

function testSent_(){
  mail.replaceSubjectAndBody(answer);
  mail.attachmentToZip(' 様 QRコード');
  mail.sent();
}

function testGetAilias_(){
  mail.getAilias();
}