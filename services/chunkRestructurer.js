/**
 * @param {import('http').IncomingMessage} req
 */
function constructChunks(req) {
    return new Promise((resolve, reject) => {
      let chunks = [];
      req.on('data', (data) => {
        chunks.push(data);
      });
      req.on('end', () => {
        const payload = Buffer.concat(chunks).toString()
        resolve(payload);
      });
      req.on('error', reject);
    });
}

module.exports = { constructChunks }