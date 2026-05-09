function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('題目');
  var data = sheet.getDataRange().getValues();
  
  // 第一列為標題
  var headers = data[0];
  var questions = [];
  
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[0] !== '') {
      questions.push({
        id: row[0],
        question: row[1],
        options: {
          A: row[2],
          B: row[3],
          C: row[4],
          D: row[5]
        },
        answer: row[6] // 如果為了安全，可以考慮不回傳 answer，而是由後端批改。但這裡先回傳方便前端直接對答案。
        // 若要後端批改，這裡就不帶 answer。依照需求描述「不包含解答欄位」，因此這裡刪除 answer。
      });
    }
  }
  
  // 移除解答欄位
  questions.forEach(q => delete q.answer);
  
  // 隨機挑選 N 題
  var count = parseInt(e.parameter.count) || 10;
  var shuffled = questions.sort(() => 0.5 - Math.random());
  var selected = shuffled.slice(0, count);
  
  return ContentService.createTextOutput(JSON.stringify(selected))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var userId = body.id;
    var score = body.score;
    var passThreshold = body.passThreshold;
    var isPass = score >= passThreshold;
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('回答');
    var data = sheet.getDataRange().getValues();
    
    var rowIndex = -1;
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == userId) {
        rowIndex = i + 1; // 1-based index
        break;
      }
    }
    
    var now = new Date();
    
    if (rowIndex > -1) {
      // 已存在玩家
      var currentPlayCount = data[rowIndex-1][1] || 0;
      var currentTotalScore = data[rowIndex-1][2] || 0;
      var highestScore = data[rowIndex-1][3] || 0;
      var firstPassScore = data[rowIndex-1][4];
      var attemptsToPass = data[rowIndex-1][5];
      
      var newPlayCount = currentPlayCount + 1;
      var newTotalScore = currentTotalScore + score;
      var newHighestScore = Math.max(highestScore, score);
      
      sheet.getRange(rowIndex, 2).setValue(newPlayCount);
      sheet.getRange(rowIndex, 3).setValue(newTotalScore);
      sheet.getRange(rowIndex, 4).setValue(newHighestScore);
      
      // 判斷是否第一次通關
      if (isPass && (!firstPassScore || firstPassScore === "")) {
        sheet.getRange(rowIndex, 5).setValue(score);
        sheet.getRange(rowIndex, 6).setValue(newPlayCount); // 花了幾次通關
      }
      
      sheet.getRange(rowIndex, 7).setValue(now);
      
    } else {
      // 新玩家
      var newRow = [
        userId,
        1, // 闖關次數
        score, // 總分
        score, // 最高分
        isPass ? score : "", // 第一次通關分數
        isPass ? 1 : "", // 花了幾次通關
        now // 最近遊玩時間
      ];
      sheet.appendRow(newRow);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
