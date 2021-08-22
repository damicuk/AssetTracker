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

  if(ledgerSheet.getMaxColumns() < this.ledgerDataColumns) {
    throw new ValidationError('Ledger has insufficient columns.');
  }

  let ledgerRange = ledgerSheet.getDataRange();

  if(ledgerRange.getHeight() < this.ledgerHeaderRows + 1) {
    throw new ValidationError('Ledger contains no data rows.');
  }
  
  ledgerRange = ledgerRange.offset(this.ledgerHeaderRows, 0, ledgerRange.getHeight() - this.ledgerHeaderRows, this.ledgerDataColumns);

  return ledgerRange;
};

/**
 * Sets data validation on the currency columns in the ledger sheet.
 * The list of fiat and cryptocurrency tickers is collected when the ledger is processed to write the reports.
 * Both fiat and cryptocurrencies are sorted alphabetically.
 * The fiat currencies are listed before the cryptocurrencies.
 */
AssetTracker.prototype.updateLedgerCurrencies = function () {

  const sheetName = this.ledgerSheetName;

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return;
  }

  let fiats = Array.from(this.fiats).sort(AssetTracker.abcComparator);
  let cryptos = Array.from(this.cryptos).sort(AssetTracker.abcComparator);
  let currencies = fiats.concat(cryptos);

  this.addCurrencyValidation(sheet, 'C3:C', currencies);
  this.addCurrencyValidation(sheet, 'H3:H', currencies);

};

/**
 * Sets data validation on the wallets columns in the ledger sheet.
 * The list of wallet names is collected when the ledger is processed to write the reports.
 * The wallet names are sorted alphabetically.
 */
AssetTracker.prototype.updateLedgerWallets = function () {

  const sheetName = this.ledgerSheetName;

  let ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return;
  }

  let walletNames = [];
  for (let wallet of this.wallets) {
    walletNames.push(wallet.name);
  }
  walletNames.sort(AssetTracker.abcComparator);

  this.addWalletValidation(sheet, 'G3:G', walletNames);
  this.addWalletValidation(sheet, 'L3:L', walletNames);

};