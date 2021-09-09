AssetTracker.prototype.processAssets = function (assetRecords) {

  for (let assetRecord of assetRecords) {
    let assetType = assetRecord.assetType === 'Base Currency' ? '' : assetRecord.assetType;
    let decimalPlaces = assetRecord.decimalPlaces;
    this.assets.set(assetRecord.ticker, { assetType: assetType, decimalPlaces: decimalPlaces });
  }
}

/**
 * Processes the ledger records.
 * It treats the ledger as a set of instuctions and simulates the actions specified.
 * Stops reading if it encounters the stop action.
 * @param {LedgerRecord[]} ledgerRecords - The collection of ledger records.
 */
AssetTracker.prototype.processLedger = function (ledgerRecords) {

  if (LedgerRecord.inReverseOrder(ledgerRecords)) {

    ledgerRecords = ledgerRecords.slice().reverse();
    let rowIndex = this.ledgerHeaderRows + ledgerRecords.length;
    for (let ledgerRecord of ledgerRecords) {
      if (ledgerRecord.action === 'Stop') {
        break;
      }
      this.processLedgerRecord(ledgerRecord, rowIndex--);
    }
  }
  else {
    let rowIndex = this.ledgerHeaderRows + 1;
    for (let ledgerRecord of ledgerRecords) {
      if (ledgerRecord.action === 'Stop') {
        break;
      }
      this.processLedgerRecord(ledgerRecord, rowIndex++);
    }
  }
};

/**
 * Processes a ledger record.
 * It treats the ledger record as an instuction and simulates the action specified.
 * @param {LedgerRecord} ledgerRecord - The ledger record to process.
 * @param {number} rowIndex - The index of the row in the ledger sheet used to set the current cell in case of an error.
 */
AssetTracker.prototype.processLedgerRecord = function (ledgerRecord, rowIndex) {

  let date = ledgerRecord.date;
  let action = ledgerRecord.action;
  let debitAsset = ledgerRecord.debitAsset;
  let debitExRate = ledgerRecord.debitExRate;
  let debitAmount = ledgerRecord.debitAmount;
  let debitFee = ledgerRecord.debitFee;
  let debitWalletName = ledgerRecord.debitWalletName;
  let creditAsset = ledgerRecord.creditAsset;
  let creditExRate = ledgerRecord.creditExRate;
  let creditAmount = ledgerRecord.creditAmount;
  let creditFee = ledgerRecord.creditFee;
  let creditWalletName = ledgerRecord.creditWalletName;
  let lotMatching = ledgerRecord.lotMatching;

  if (lotMatching) {
    this.lotMatching = lotMatching;
  }

  if (action === 'Transfer') {  //Transfer

    if (Ticker.isBaseCurrency(debitAsset)) { //Base currency transfer

      if (debitWalletName) { //Base currency withdrawal

        this.getWallet(debitWalletName).getFiatAccount(debitAsset).transfer(-debitAmount).transfer(-debitFee);

      }
      else if (creditWalletName) { //Base currency deposit

        this.getWallet(creditWalletName).getFiatAccount(debitAsset).transfer(debitAmount).transfer(-debitFee);

      }
    }
    else if (Ticker.isAsset(debitAsset)) {  //Asset transfer

      let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

      this.getWallet(creditWalletName).getAssetAccount(debitAsset).deposit(lots);

    }
  }
  else if (action === 'Trade') { //Trade

    if (Ticker.isBaseCurrency(debitAsset) && Ticker.isAsset(creditAsset)) {  //Buy asset

      this.getWallet(debitWalletName).getFiatAccount(debitAsset).transfer(-debitAmount).transfer(-debitFee);

      let lot = new Lot(date, debitAsset, debitExRate, debitAmount, debitFee, creditAsset, creditAmount, creditFee, debitWalletName);

      this.getWallet(debitWalletName).getAssetAccount(creditAsset).deposit(lot);

    }
    else if (Ticker.isAsset(debitAsset) && Ticker.isBaseCurrency(creditAsset)) { //Sell asset

      let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

      this.closeLots(lots, date, creditAsset, creditExRate, creditAmount, creditFee, debitWalletName);

      this.getWallet(debitWalletName).getFiatAccount(creditAsset).transfer(creditAmount).transfer(-creditFee);

    }
    else if (Ticker.isAsset(debitAsset) && Ticker.isAsset(creditAsset)) { //Exchange assets

      let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

      this.closeLots(lots, date, creditAsset, creditExRate, creditAmount, creditFee, debitWalletName);

      let lot = new Lot(date, debitAsset, debitExRate, debitAmount, debitFee, creditAsset, creditAmount, creditFee, debitWalletName);

      this.getWallet(debitWalletName).getAssetAccount(creditAsset).deposit(lot);

    }
  }
  else if (action === 'Income') { //Income

    if (Ticker.isBaseCurrency(creditAsset)) { //Base currency income

      this.getWallet(creditWalletName).getFiatAccount(creditAsset).transfer(creditAmount);

    }
    else { // Asset income

      //the cost base is the value of (credit exchange rate x credit amount)
      let lot = new Lot(date, creditAsset, creditExRate, creditAmount, 0, creditAsset, creditAmount, 0, creditWalletName);

      this.getWallet(creditWalletName).getAssetAccount(creditAsset).deposit(lot);

    }

    //keep track of income separately
    this.incomeLots.push({ date: date, sourceAsset: debitAsset, incomeAsset: creditAsset, exRate: creditExRate, amount: creditAmount, walletName: creditWalletName });

  }
  else if (action === 'Donation') { //Donation

    let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

    for (let lot of lots) {
      this.donatedLots.push({ lot: lot, date: date, exRate: debitExRate, walletName: debitWalletName });
    }
  }
  else if (action === 'Gift') { //Gift

    this.getWallet(debitWalletName).getAssetAccount(debitAsset).withdraw(debitAmount, debitFee, this.lotMatching, rowIndex);

  }
  else if (action === 'Fee') { //Fee

    this.getWallet(debitWalletName).getAssetAccount(debitAsset).apportionFee(debitFee, rowIndex);

    let lots = this.getWallet(debitWalletName).getAssetAccount(debitAsset).removeZeroSubunitLots();

    this.closeLots(lots, date, this.accountingCurrency, 0, 0, 0, debitWalletName);

  }
};
