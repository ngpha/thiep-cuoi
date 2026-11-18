/**
 * Nhận xác nhận tham dự từ thiệp cưới và ghi vào tab "RSVP".
 * Thứ tự cột khớp với tab hiện có:
 * A Dấu thời gian | B Họ và tên | C Có đến không | D Số người | E Khách mời của | F Lời chúc
 */
var SHEET_NAME = 'RSVP';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // tránh hai khách gửi cùng lúc ghi đè lên nhau
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    sheet.appendRow([
      new Date(),
      clean_(data.name, 100),
      clean_(data.attend, 50),
      Number(data.count) || 0,
      clean_(data.guestOf, 50),
      clean_(data.wish, 1000)
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Mở URL Web App trên trình duyệt để kiểm tra script đã chạy
function doGet() {
  return json_({ ok: true, message: 'RSVP endpoint đang hoạt động' });
}

// Cắt độ dài và chặn công thức (khách gõ "=..." không biến thành công thức trong Sheet)
function clean_(value, max) {
  var s = String(value || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
