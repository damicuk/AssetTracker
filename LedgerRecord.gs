/**
 * Represents a row in the ledger sheet.
 */
var LedgerRecord = class LedgerRecord {

  /**
   * Assigns each column value to a property.
   * @param {Date} date - The date the action occurred.
   * @param {string} action - Donation, Gift, Income, Stop, Trade, Transfer.
   * @param {string} debitAsset - The ticker of the asset debited from the account.
   * @param {number} debitExRate - The debit asset to fiat base exchange rate, 0 if the debit asset is fiat base.
   * @param {number} debitAmount - The amount of asset debited from the account.
   * @param {number} debitFee - The fee in debit asset units.
   * @param {string} debitWalletName - The name of the wallet (or exchange) from which the asset is debited.
   * @param {string} creditAsset - The ticker of the asset credited to the account.
   * @param {number} creditExRate - The credit asset to fiat base exchange rate, 0 if the credit asset is fiat base.
   * @param {number} creditAmount - The amount of asset credited to the account.
   * @param {number} creditFee - The fee in credit asset units.
   * @param {string} creditWalletName - The name of the wallet (or exchange) to which the asset is credited.
   * @param {string} otherAsset - The ticker of the other asset.
   * @param {number} otherExRate - The other asset to fiat base exchange rate, 0 if the other asset is fiat base.
   * @param {number} otherFee - The fee in other asset units.
   * @param {string} lotMatching - Sets the lot matching method to use from this point onwards - FIFO, LIFO, HIFO, LOFO.
   */
  constructor(
    date,
    action,
    debitAsset,
    debitExRate,
    debitAmount,
    debitFee,
    debitWalletName,
    creditAsset,
    creditExRate,
    creditAmount,
    creditFee,
    creditWalletName,
    otherAsset,
    otherExRate,
    otherFee,
    lotMatching) {

    /**
     * The date the action occurred.
     * @type {Date}
     */
    this.date = new Date(date);

    /**
     * The action - Donation, Gift, Income, Stop, Trade, Transfer.
     * @type {string}
     */
    this.action = action;

    /**
     * The ticker of the asset debited from the account.
     * @type {string}
     */
    this.debitAsset = debitAsset;

    /**
     * The debit asset to fiat base exchange rate, 0 if the debit asset is fiat base.
     * @type {number}
     */
    this.debitExRate = debitExRate;

    /**
    * The amount of asset debited from the account.
    * @type {number}
    */
    this.debitAmount = debitAmount;

    /**
     * The fee in debit asset units.
     * @type {number}
     */
    this.debitFee = debitFee;

    /**
     * The name of the wallet (or exchange) from which the asset is debited.
     * @type {number}
     */
    this.debitWalletName = debitWalletName;

    /**
     * The ticker of the asset credited to the account.
     * @type {string}
     */
    this.creditAsset = creditAsset;

    /**
     * The credit asset to fiat base exchange rate, 0 if the credit asset is fiat base.
     * @type {number}
     */
    this.creditExRate = creditExRate;

    /**
     * The amount of asset credited to the account.
     * @type {number}
     */
    this.creditAmount = creditAmount;

    /**
     * The fee in credit asset units.
     * @type {number}
     */
    this.creditFee = creditFee;

    /**
     *  The name of the wallet (or exchange) to which the asset is credited.
     * @type {number}
     */
    this.creditWalletName = creditWalletName;

    /**
     * The ticker of the other asset.
     * @type {string}
     */
    this.otherAsset = otherAsset;

    /**
     * The other asset to fiat base exchange rate, 0 if the other asset is fiat base.
     * @type {number}
     */
    this.otherExRate = otherExRate;

    /**
     * The fee in other asset units.
     * @type {number}
     */
    this.otherFee = otherFee;

    /**
     * The lot matching method to use from this point onwards - FIFO, LIFO, HIFO, LOFO.
     * @type {string}
     */
    this.lotMatching = lotMatching;
  }

  /**
   * Returns the index of the column given its assigned name.
   * Avoids hard coding column numbers.
   * @param {string} columnName - the name assigned to the column in the ledger sheet.
   * @return {number} The index of the named column or -1 if column name not found.
   * @static
   */
  static getColumnIndex(columnName) {

    let columns = [
      'date',
      'action',
      'debitAsset',
      'debitExRate',
      'debitAmount',
      'debitFee',
      'debitWalletName',
      'creditAsset',
      'creditExRate',
      'creditAmount',
      'creditFee',
      'creditWalletName',
      'otherAsset',
      'otherExRate',
      'otherFee',
      'lotMatching'
    ];

    let index = columns.indexOf(columnName);

    return index === -1 ? index : index + 1;
  }

  /**
   * Determines whether the ledger records are intended to be in reverse chronological order.
   * @param {LedgerRecord[]} ledgerRecords - The collection of ledger records.
   * @return {boolean} Whether the ledger records are intended to be in reverse chronological order.
   * @static
   */
  static inReverseOrder(ledgerRecords) {

    return ledgerRecords.length > 1 && ledgerRecords[ledgerRecords.length - 1].date < ledgerRecords[0].date;
  }
};

/**
 * Retrieves the ledger records from the ledger sheet.
 * @return {LedgerRecord[]} The collection of ledger records.
 */
AssetTracker.prototype.getLedgerRecords = function () {

  let ledgerRange = this.getLedgerRange();
  let ledgerData = ledgerRange.getValues();

  //convert raw data to object array
  let ledgerRecords = [];
  for (let row of ledgerData) {

    let ledgerRecord = new LedgerRecord(
      row[0],
      row[1],
      row[2],
      row[3],
      row[4],
      row[5],
      row[6],
      row[7],
      row[8],
      row[9],
      row[10],
      row[11],
      row[12],
      row[13],
      row[14],
      row[15]
    );

    ledgerRecords.push(ledgerRecord);
  }
  return ledgerRecords;
};