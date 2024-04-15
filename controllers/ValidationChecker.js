class ValidationChecker {
  checkNumber(number, idName) {
    if (isNaN(Number(number))) {
      throw new Error(`Wrong Type of ${idName}`);
    }
  }
  checkStringFromParams(string, strName) {
    if (!string || !string.length) {
      throw new Error(`${strName} required`);
    }
  }
  checkStringFromBody(string, strName) {
    if (typeof string !== "string") {
      throw new Error(`${strName} must be string`);
    }
    if (!string.length) {
      throw new Error(`${strName} required`);
    }
  }
  checkArray(array, arrName) {
    if (!array.length) {
      throw new Error(`${arrName} require at least one data.`);
    }
  }
}

module.exports = ValidationChecker;
