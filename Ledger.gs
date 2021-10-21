/**
 * Returns the range in the ledger sheet that contains the data excluding header rows.
 * If there is no ledger sheet it creates a sample ledger and returns the range from that.
 * Throws a ValidationError if the ledger sheet contains insufficient columns or no data rows
 * @return {Range} The range in the ledger sheet that contains the data excluding header rows.
 */
AssetTracker.prototype.getLedgerRange = function () {

  let ss = SpreadsheetApp.getActive();
  let ledgerSheet = ss.getSheetByName(this.ledgerSheetName);

  if (!ledgerSheet) {

    ledgerSheet = this.sampleLedger();
  }

  if (ledgerSheet.getMaxColumns() < this.ledgerDataColumns) {
    throw new ValidationError('Ledger has insufficient columns.');
  }

  let ledgerRange = ledgerSheet.getDataRange();

  if (ledgerRange.getHeight() < this.ledgerHeaderRows + 1) {
    throw new ValidationError('Ledger contains no data rows.');
  }

  ledgerRange = ledgerRange.offset(this.ledgerHeaderRows, 0, ledgerRange.getHeight() - this.ledgerHeaderRows, this.ledgerDataColumns);

  return ledgerRange;
};

/**
 * Checks the version of the ledger sheet.
 * Sets conditional text color formatting of the action column of the ledger sheet if the version is not current.
 * Sets data validation on the action column of the ledger sheet if the version is not current.
 * Sets data validation on the asset columns in the ledger sheet.
 * Sets data validation on the wallets columns in the ledger sheet.
 */
AssetTracker.prototype.updateLedger = function () {

  const sheetName = this.ledgerSheetName;

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return;
  }

  if (this.getSheetVersion(sheet) !== this.ledgerSheetVersion) {

    //Future updates to the ledger can be inserted here

    this.setSheetVersion(sheet, this.ledgerSheetVersion);
  }

  this.updateLedgerAssets(sheet);
  this.updateLedgerWallets(sheet);
};

/**
 * Sets conditional text color formatting of the action column of the ledger sheet.
 * @param {Sheet} sheet - The ledger sheet.
 */
AssetTracker.prototype.setLedgerConditionalFormatRules = function (sheet) {

  sheet.clearConditionalFormatRules();

  let textColors = [
    ['Donation', '#ff9900', null],
    ['Fee', '#9900ff', null],
    ['Gift', '#ff9900', null],
    ['Income', '#6aa84f', null],
    ['Split', '#ff00ff', null],
    ['Stop', '#ff0000', '#ffbb00'],
    ['Trade', '#1155cc', null],
    ['Transfer', '#ff0000', null],
  ];

  let range = sheet.getRange('B3:B');
  let rules = sheet.getConditionalFormatRules();

  for (let textColor of textColors) {

    let rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(textColor[0])
      .setFontColor(textColor[1])
      .setBackground(textColor[2])
      .setRanges([range])
      .build();

    rules.push(rule);
  }

  sheet.setConditionalFormatRules(rules);
};

/**
 * Sets data validation on the asset columns of the ledger sheet.
 * The list of fiat and asset tickers is collected when the ledger is processed to write the reports.
 * Both fiats and assets are sorted alphabetically.
 * The fiats are listed before the assets.
 * @param {Sheet} sheet - The ledger sheet.
 */
AssetTracker.prototype.updateLedgerAssets = function (sheet) {

  let fiatTickers = Array.from(this.fiatTickers).sort(AssetTracker.abcComparator);
  let assetTickers = Array.from(this.assetTickers).sort(AssetTracker.abcComparator);
  let tickers = fiatTickers.concat(assetTickers);

  this.setAssetValidation(sheet, 'C3:C', tickers);
  this.setAssetValidation(sheet, 'H3:H', tickers);

};

/**
 * Sets data validation on the wallets columns of the ledger sheet.
 * The list of wallet names is collected when the ledger is processed to write the reports.
 * The wallet names are sorted alphabetically.
 * @param {Sheet} sheet - The ledger sheet.
 */
AssetTracker.prototype.updateLedgerWallets = function (sheet) {

  let walletNames = [];
  for (let wallet of this.wallets) {
    walletNames.push(wallet.name);
  }
  walletNames.sort(AssetTracker.abcComparator);

  this.setWalletValidation(sheet, 'G3:G', walletNames);
  this.setWalletValidation(sheet, 'L3:L', walletNames);

};

/**
 * Sets data validation from a list on a range of cells in a sheet.
 * Sets the help text that appears when the user hovers over a cell on which data validation is set.
 * Used specifically to set the data validation on the currency columns in the ledger sheet.
 * @param {Sheet} sheet - The sheet containing the range of cells on which data validation is set.
 * @param {string} a1Notation - The A1 notation used to specify the range of cells on which data validation is set.
 * @param {Array<string>} values - The list of valid values
 */
AssetTracker.prototype.setAssetValidation = function (sheet, a1Notation, values) {

  this.setValidation(sheet, a1Notation, values, true, 'New assets will be added to the data validation dropdown when write reports is run.');

};

/**
 * Sets data validation from a list on a range of cells in a sheet.
 * Sets the help text that appears when the user hovers over a cell on which data validation is set.
 * Used specifically to set the data validation on the wallet columns in the ledger sheet.
 * @param {Sheet} sheet - The sheet containing the range of cells on which data validation is set.
 * @param {string} a1Notation - The A1 notation used to specify the range of cells on which data validation is set.
 * @param {Array<string>} values - The list of valid values
 */
AssetTracker.prototype.setWalletValidation = function (sheet, a1Notation, values) {

  this.setValidation(sheet, a1Notation, values, true, 'New wallets will be added to the data validation dropdown when write reports is run.');

};