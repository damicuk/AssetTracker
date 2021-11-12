/**
 * Pool deposit.
 * Represents a deposit in the asset pool.
 */
var PoolDeposit = class PoolDeposit extends PoolTransaction {

  /**
   * Initializes the class by calling and passing the parameters to super.
   * @param {Date} date - The date of the transaction.
   * @param {Asset} debitAsset - The asset debited.
   * @param {number} debitAmount - The amount of asset debited.
   * @param {number} debitFee - The fee in asset units debited.
   * @param {Asset} creditAsset - The asset credited.
   * @param {number} creditAmount - The amount of asset credited.
   * @param {number} creditFee - The fee in asset units credited.
   */
  constructor(date, debitAsset, debitAmount, debitFee, creditAsset, creditAmount, creditFee) {

    super(date, debitAsset, debitAmount, debitFee, creditAsset, creditAmount, creditFee);
  }

  /**
   * The balance in subunits.
   * @type {number}
   */
  get subunits() {

    return this.creditAmountSubunits - this.creditFeeSubunits;
  }

  /**
   * The cost basis in subunits.
   * @type {number}
   */
  get costBasisSubunits() {

    return this.debitAmountSubunits + this.debitFeeSubunits;
  }

  /**
   * Splits the pool deposit into two.
   * Used when matching with pool withdrawal in an asset account.
   * The fees are assigned in proportion to the balances of the returned pool deposits.
   * @param {number} subunits - The balance in subunits required in the first pool deposit of the returned pool deposits.
   * @return {Array<PoolDeposit>} Array of two pool deposits, the first having the requested balance in subunits, the second with the remainder.
   */
  split(subunits) {

    let poolDeposits = [];

    let debitAmountSubunits = Math.round((subunits / this.subunits) * this.debitAmountSubunits);
    let debitFeeSubunits = Math.round((subunits / this.subunits) * this.debitFeeSubunits);

    let creditAmountSubunits = Math.round((subunits / this.subunits) * this.creditAmountSubunits);
    let creditFeeSubunits = creditAmountSubunits - subunits;

    let poolDeposit1 = new PoolDeposit(
      this.date,
      this.debitAsset,
      debitAmountSubunits / this.debitAsset.subunits,
      debitFeeSubunits / this.debitAsset.subunits,
      this.creditAsset,
      creditAmountSubunits / this.creditAsset.subunits,
      creditFeeSubunits / this.creditAsset.subunits);

    poolDeposits.push(poolDeposit1);

    let poolDeposit2 = new PoolDeposit(
      this.date,
      this.debitAsset,
      (this.debitAmountSubunits - poolDeposit1.debitAmountSubunits) / this.debitAsset.subunits,
      (this.debitFeeSubunits - poolDeposit1.debitFeeSubunits) / this.debitAsset.subunits,
      this.creditAsset,
      (this.creditAmountSubunits - poolDeposit1.creditAmountSubunits) / this.creditAsset.subunits,
      (this.creditFeeSubunits - poolDeposit1.creditFeeSubunits) / this.creditAsset.subunits);

    poolDeposits.push(poolDeposit2);

    return poolDeposits;
  }
};