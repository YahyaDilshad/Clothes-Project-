const { Parser } = require('json2csv');

/**
 * Converts an array of plain objects to CSV and streams it as a
 * file download attachment on the given response object.
 */
const sendCsv = (res, filename, rows, fields) => {
  const parser = new Parser(fields ? { fields } : {});
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment(filename);
  return res.send(csv);
};

module.exports = { sendCsv };
