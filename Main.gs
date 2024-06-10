/**
* Runs when the add-on is installed.
* This method is only used by the regular add-on, and is never called by the mobile add-on version.
* @param {Object} e The event parameter for a simple onInstall trigger.
*/
function onInstall(e) {
  onOpen(e);
}

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by the mobile add-on version.
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
    .createMenu('WealthLedger')
    .addItem('Step 1: Create sample sheets', 'createSampleSheets')
    .addSeparator()
    .addItem('Step 2: Validate', 'validate')
    .addSeparator()
    .addItem('Step 3: Write reports', 'writeReports')
    .addSeparator()
    .addItem('Delete reports', 'deleteReports')
    .addSeparator()
    .addItem('Copy ledger', 'copyLedger')
    .addSeparator()
    .addItem('Settings', 'showSettingsDialog')
    .addToUi();
}

/**
 * Calls the corresponding method of a new instance of AssetTracker
 */
function createSampleSheets() {

  new AssetTracker().createSampleSheets();

}

/**
 * Calls the corresponding method of a new instance of AssetTracker
 */
function validate() {

  new AssetTracker().validate();

}

/**
 * Calls the corresponding method of a new instance of AssetTracker
 */
function writeReports() {

  new AssetTracker().writeReports();
}

/**
 * Calls the corresponding method of a new instance of AssetTracker
 */
function deleteReports() {

  new AssetTracker().deleteReports();

}

/**
 * Calls the corresponding method of a new instance of AssetTracker
 */
function copyLedger() {

  new AssetTracker().copyLedger();

}

/**
 * Displays the settings dialog
 */
function showSettingsDialog() {

  new AssetTracker().showSettingsDialog();

}

/**
 * Calls the corresponding method of a new instance of AssetTracker
 */
function saveSettings(userSettings) {

  new AssetTracker().saveSettings(userSettings);

}

/**
 * Deletes all the user and document properties
 * Not intended for use by the end user
 * Useful in development and testing
 */
function deleteSettings() {

  let userProperties = PropertiesService.getUserProperties();
  userProperties.deleteAllProperties();

  let documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteAllProperties();

}