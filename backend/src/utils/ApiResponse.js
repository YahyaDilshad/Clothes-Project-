/**
 * Sends a consistently-shaped JSON response.
 * { success, message, data, meta }
 */
class ApiResponse {
  constructor(res, statusCode = 200) {
    this.res = res;
    this.statusCode = statusCode;
  }

  send(data = null, message = 'Success', meta = undefined) {
    const body = { success: true, message, data };
    if (meta !== undefined) body.meta = meta;
    return this.res.status(this.statusCode).json(body);
  }
}

const sendResponse = (res, statusCode, data, message, meta) =>
  new ApiResponse(res, statusCode).send(data, message, meta);

module.exports = { sendResponse };
