/**
 * Creates a sample assets sheet.
 * Renames any existing assets sheet so as not to overwrite it.
 */
AssetTracker.prototype.sampleAssets = function () {

  const sheetName = this.assetsSheetName;

  this.renameSheet(sheetName);

  let ss = SpreadsheetApp.getActive();
  sheet = ss.insertSheet(sheetName);

  let headers = [
    [
      'Asset',
      'Asset Type',
      'Decimal Places',
      'Current Price',
      'URL',
      'XPATH'
    ]
  ];

  sheet.getRange('A1:F1').setValues(headers).setFontWeight('bold').setHorizontalAlignment("center");
  sheet.setFrozenRows(1);

  sheet.getRange('A2:B').setNumberFormat('@');
  sheet.getRange('C2:C').setNumberFormat('0');
  sheet.getRange('D2:D').setNumberFormat('#,##0.0000;(#,##0.0000)');
  sheet.getRange('E2:F').setNumberFormat('@');

  let assetFormula = `=REGEXMATCH(TO_TEXT(A2), "^\\w{2,9}$")`;
  let assetHelpText = `Input must be between 2 and 9 alphanumeric characters [A-Za-z0-9_].`;
  this.setValidation(sheet, 'A2:A', assetFormula, false, assetHelpText);

  let decimalPlacesFormula = `=REGEXMATCH(TO_TEXT(C2), "^[012345678]$")`;
  let decimalPlacesHelpText = `Input must be an integer between 0 and 8`;
  this.setValidation(sheet, 'C2:C', decimalPlacesFormula, false, decimalPlacesHelpText);

  let assetTypes = Asset.defaultAssetTypes;
  this.setValidation(sheet, 'B2:B', assetTypes, true, 'New asset types will be added to the data validation dropdown when write reports is run.');

  let dataTable = [
    ['USD', 'Fiat Base', '2', '1',],
    ['ADA', 'Crypto', '6', '=GOOGLEFINANCE(CONCAT(CONCAT("CURRENCY:", A3), "USD"))',],
    ['ALGO', 'Crypto', '8', ,],
    ['BTC', 'Crypto', '8', '=GOOGLEFINANCE(CONCAT(CONCAT("CURRENCY:", A5), "USD"))',],
    ['SOL', 'Crypto', '8', ,],
    [, , , ,]
  ];

  this.writeTable(ss, sheet, dataTable, this.assetsRangeName, 1, 4, 2);

  if (!sheet.getFilter()) {
    sheet.getRange('A1:F').createFilter();
  }

  sheet.hideColumns(5, 2);

  this.trimSheet(sheet, 7, 6);

  sheet.autoResizeColumns(1, 4);
};

AssetTracker.prototype.updateAssetsSheet = function () {

  const sheetName = this.assetsSheetName;

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return;
  }

  this.updateAssetsAssetTypes(sheet);
};

AssetTracker.prototype.updateAssetsAssetTypes = function (sheet) {

  let userDefinedAssetTypes = Array.from(this.userDefinedAssetTypes).sort(AssetTracker.abcComparator);
  let assetTypes = Asset.defaultAssetTypes.concat(userDefinedAssetTypes);

  this.setValidation(sheet, 'B2:B', assetTypes, true, 'New asset types will be added to the data validation dropdown when write reports is run.');
};

/**
 * Returns the range in the asset sheet that contains the data excluding header rows.
 * If there is no asset sheet it creates a sample asset sheet and returns the range from that.
 * Throws a ValidationError if the ledger sheet contains insufficient columns or no data rows.
 * @return {Range} The range in the asset sheet that contains the data excluding header rows.
 */
AssetTracker.prototype.getAssetsRange = function () {

  let ss = SpreadsheetApp.getActive();
  let assetsSheet = ss.getSheetByName(this.assetsSheetName);

  if (!assetsSheet) {

    assetSheet = this.sampleAssetSheet();
  }

  if (assetsSheet.getMaxColumns() < this.assetsDataColumns) {
    throw new ValidationError('Asset sheet has insufficient columns.');
  }

  let assetsRange = assetsSheet.getDataRange();

  if (assetsRange.getHeight() < this.assetsHeaderRows + 1) {
    throw new ValidationError('Asset sheet contains no data rows.');
  }

  assetsRange = assetsRange.offset(this.assetsHeaderRows, 0, assetsRange.getHeight() - this.assetsHeaderRows, this.assetsDataColumns);

  return assetsRange;
};