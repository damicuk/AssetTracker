/**
 * Represents an amount of asset that has been sold or exchanged.
 * Calculations are done in integer amounts of subunits to avoid computational rounding errors.
 */
var ClosedLot = class ClosedLot {

  /**
   * Initializes the class with the properties set to the parameters.
   * @param {Lot} lot - An amount of asset purchased together.
   * @param {Date} date - The date of the sale or exchange.
   * @param {Asset} creditAsset - The asset credited.
   * @param {number} creditAmount - The amount of asset credited.
   * @param {number} creditFee - The fee in credit asset units.
   * @param {string} walletName - The name of the wallet (or exchange) in which the transaction took place.
   * @param {string} action - The action in the ledger sheet that closed the lot.
   * @param {number} rowIndex - The index of the row in the ledger sheet that gave rise to the closed lot.
   */
  constructor(lot, date, creditAsset, creditAmount, creditFee, walletName, action, rowIndex) {

    /**
     * An amount of asset purchased together.
     * @type {Lot}
     */
    this.lot = lot;

    /**
     * The date of the sale or exchange.
     * @type {Date}
     */
    this.date = date;

    /**
     * The asset credited.
     * @type {Asset}
     */
    this.creditAsset = creditAsset;

    /**
     * The amount of asset subunits credited.
     * @type {number}
     */
    this.creditAmountSubunits = AssetTracker.round(creditAmount * this.creditAsset.subunits);

    /**
     * The fee in credit asset subunits.
     * @type {number}
     */
    this.creditFeeSubunits = AssetTracker.round(creditFee * this.creditAsset.subunits);

    /**
     * The name of the wallet (or exchange) in which the transaction took place.
     * @type {string}
     */
    this.walletName = walletName;

    /**
     * The action in the ledger sheet that closed the lot.
     * @type {string}
     */
    this.action = action;

    /**
     * The index of the row in the ledger sheet that gave rise to the closed lot.
     * @type {number}
     */
    this.rowIndex = rowIndex;
  }

  /**
   * The amount of asset credited.
   * @type {number}
   */
  get creditAmount() {

    return this.creditAmountSubunits / this.creditAsset.subunits;
  }

  /**
   * The fee in credit asset units.
   * @type {number}
   */
  get creditFee() {

    return this.creditFeeSubunits / this.creditAsset.subunits;
  }
};