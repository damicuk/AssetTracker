/**
 * Creates the open summary report if it doesn't already exist.
 * No data is writen to this sheet.
 * It contains formulas that pull data from other sheets.
 * @param {string} [sheetName] - The name of the sheet.
 */
AssetTracker.prototype.openSummaryReport = function (sheetName = this.openSummaryReportName) {

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {

    sheet = ss.insertSheet(sheetName);

    this.trimColumns(sheet, 19);

    const referenceRangeName = this.openRangeName;

    let headers = [
      [
        '',
        'Wallet',
        'Asset Type',
        'Asset',
        'Holding Period',
        'Balance',
        'Cost Price',
        'Current Price',
        'Cost Basis',
        'Current Value',
        'Unrealized P/L',
        'Unrealized P/L %'
      ]
    ];

    sheet.getRange('A1:L1').setValues(headers).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.setFrozenRows(1);

    sheet.getRange('A2:E').setNumberFormat('@');
    sheet.getRange('F2:F').setNumberFormat('#,##0.00000000;(#,##0.00000000)');
    sheet.getRange('G2:H').setNumberFormat('#,##0.0000;(#,##0.0000)');
    sheet.getRange('I2:J').setNumberFormat('#,##0.00;(#,##0.00)');
    sheet.getRange('K2:K').setNumberFormat('[color50]#,##0.00_);[color3](#,##0.00);[blue]#,##0.00_)');
    sheet.getRange('L2:L').setNumberFormat('[color50]0% ▲;[color3]-0% ▼;[blue]0% ▬');

    sheet.getRange('A2:A').setFontColor('#1155cc');

    this.addLongShortCondition(sheet, 'E3:E');

    const formula =
      `IF(COUNT(QUERY(${referenceRangeName}, "SELECT L"))=0,,
{
IF(COUNT(QUERY(${referenceRangeName}, "SELECT N"))=0,
QUERY({QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT 'TOTAL', ' ', '  ', '   ', '    ', '     ', '      ', '       ', SUM(Col5), '        ', '         ', '          ' LABEL 'TOTAL' '', ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', '       ' '', SUM(Col5) '', '        ' '', '         ' '', '          ' ''"),
QUERY({QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT 'TOTAL', ' ', '  ', '   ', '    ', '     ', '      ', '       ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) LABEL 'TOTAL' '', ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', '       ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''"));
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET TYPE", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', '  ', Col2, '   ', '    ', '     ', '      ', '       ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2 ORDER BY Col2 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', '       ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', '  ', Col2, Col1, '   ', SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2, Col1 ORDER BY Col2, Col1 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', Col3, '  ', '   ', '    ', '     ', '      ', '       ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3 ORDER BY Col3 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', '       ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET AND ASSET TYPE", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', Col3, Col2, '  ', '   ', '    ', '     ', '      ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col2 ORDER BY Col3, Col2 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET AND ASSET", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', Col3, Col2, Col1, '  ', SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col2, Col1 ORDER BY Col3, Col2, Col1  OFFSET 1 LABEL ' ' '', '  ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");

IF(COUNT(QUERY(${referenceRangeName}, "SELECT N"))=0,{"", "", "", "", "", "", "", "", "", "", "", ""},
{
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET, ASSET AND PROFIT/LOSS", "", "", "", "", "", "", "", "", "", "", ""};QUERY({
IF(COUNT(QUERY(${referenceRangeName}, "SELECT L WHERE Q>=0"))=0,{"", "", "", "", "", 0, 0, 0, 0, 0, 0, 0},QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S WHERE Q>=0")}, "SELECT ' ', Col3, Col2, Col1, '  ', SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col2, Col1 ORDER BY Col3, Col2, Col1  OFFSET 1 LABEL ' ' '', '  ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''"));
IF(COUNT(QUERY(${referenceRangeName}, "SELECT L WHERE Q<0"))=0,{"", "", "", "", "", 0, 0, 0, 0, 0, 0, 0},QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S WHERE Q<0")}, "SELECT ' ', Col3, Col2, Col1, '  ', SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col2, Col1 ORDER BY Col3, Col2, Col1  OFFSET 1 LABEL ' ' '', '  ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''"))
}, "SELECT * WHERE Col6<>0 ORDER BY Col2, Col3, Col4, Col11 DESC")
});

{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY HOLDING PERIOD", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', '  ', '   ', '    ', Col8, '     ', '      ', '       ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col8 ORDER BY Col8 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', '       ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET TYPE AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', '  ', Col2, '   ', Col8, '    ', '     ', '      ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2, Col8 ORDER BY Col2, Col8 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY ASSET AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', '  ', Col2, Col1, Col8, SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2, Col1, Col8 ORDER BY Col2, Col1, Col8 OFFSET 1 LABEL ' ' '', '  ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', Col3, '  ', '   ', Col8, '    ', '     ', '      ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col8 ORDER BY Col3, Col8 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', '      ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET, ASSET TYPE AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', Col3, Col2, '  ', Col8, '   ', '    ', '     ', SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col2, Col3, Col8 ORDER BY Col3, Col2, Col8 OFFSET 1 LABEL ' ' '', '  ' '', '   ' '', '    ' '', '     ' '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");
{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET, ASSET AND HOLDING PERIOD", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S")}, "SELECT ' ', Col3, Col2, Col1, Col8, SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col2, Col1, Col8 ORDER BY Col3, Col2, Col1, Col8 OFFSET 1 LABEL ' ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''");

IF(COUNT(QUERY(${referenceRangeName}, "SELECT N"))=0,{"", "", "", "", "", "", "", "", "", "", "", ""},
{{"", "", "", "", "", "", "", "", "", "", "", ""};
{"BY WALLET, ASSET, HOLDING PERIOD AND PROFIT/LOSS", "", "", "", "", "", "", "", "", "", "", ""};
QUERY({
IF(COUNT(QUERY(${referenceRangeName}, "SELECT L WHERE Q>=0"))=0,{"", "", "", "", "", 0, 0, 0, 0, 0, 0, 0},QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S WHERE Q>=0")}, "SELECT ' ', Col3, Col2, Col1, Col8, SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col2, Col1, Col8 ORDER BY Col3, Col2, Col1, Col8 OFFSET 1 LABEL ' ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''"));
IF(COUNT(QUERY(${referenceRangeName}, "SELECT L WHERE Q<0"))=0,{"", "", "", "", "", 0, 0, 0, 0, 0, 0, 0},QUERY({{"", "", "", 0, 0, 0, 0, ""};QUERY(${referenceRangeName}, "SELECT G, H, K, L, O, P, Q, S WHERE Q<0")}, "SELECT ' ', Col3, Col2, Col1, Col8, SUM(Col4), SUM(Col5) / SUM(Col4), SUM(Col6) / SUM(Col4), SUM(Col5), SUM(Col6), SUM(Col7), SUM(Col7) / SUM(Col5) GROUP BY Col3, Col2, Col1, Col8 ORDER BY Col3, Col2, Col1, Col8 OFFSET 1 LABEL ' ' '', SUM(Col4) '', SUM(Col5) / SUM(Col4) '', SUM(Col6) / SUM(Col4) '', SUM(Col5) '', SUM(Col6) '', SUM(Col7) '', SUM(Col7) / SUM(Col5) ''"))
}, "SELECT * WHERE Col6<>0 ORDER BY Col2, Col3, Col4, Col5, Col11 DESC")
})
})`;

    sheet.getRange('A2').setFormula(formula);

    let chartRange1 = ss.getRangeByName(this.chartRange1Name);
    let chartRange2 = ss.getRangeByName(this.chartRange2Name);

    let assetTypeValueChart = sheet.newChart().asPieChart()
      .addRange(chartRange1)
      .setNumHeaders(1)
      .setTitle('Asset Type Value')
      .setLegendPosition(Charts.Position.RIGHT)
      .setOption('pieSliceText', 'percentage')
      .setOption('pieSliceBorderColor', 'white')
      .setPosition(1, 16, 30, 30)
      .build();

    sheet.insertChart(assetTypeValueChart);

    let assetValueChart = sheet.newChart().asPieChart()
      .addRange(chartRange2.offset(0, 1, chartRange1.getHeight(), 2))
      .setNumHeaders(1)
      .setTitle('Asset Value')
      .setLegendPosition(Charts.Position.RIGHT)
      .setOption('pieSliceText', 'percentage')
      .setOption('pieSliceBorderColor', 'white')
      .setPosition(21, 16, 30, 30)
      .build();

    sheet.insertChart(assetValueChart);

    let assetTypePLChart = sheet.newChart().asColumnChart()
      .addRange(chartRange1.offset(0, 0, chartRange1.getHeight(), 1))
      .addRange(chartRange1.offset(0, 2, chartRange1.getHeight(), 1))
      .setNumHeaders(1)
      .setTitle('Asset Type Unrealized P/L %')
      .setPosition(40, 16, 30, 30)
      .build();

    sheet.insertChart(assetTypePLChart);

    let assetPLChart = sheet.newChart().asColumnChart()
      .addRange(chartRange2.offset(0, 1, chartRange2.getHeight(), 1))
      .addRange(chartRange2.offset(0, 3, chartRange2.getHeight(), 1))
      .setNumHeaders(1)
      .setTitle('Asset Unrealized P/L %')
      .setPosition(59, 16, 30, 30)
      .build();

    sheet.insertChart(assetPLChart);

    this.setSheetVersion(sheet, this.reportsVersion);
  }

  SpreadsheetApp.flush();
  sheet.autoResizeColumns(2, 11);
};