require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID
  });
  return ticket.getPayload();
}

module.exports = (google_token) => {
  try {
    return verify(google_token) 
  } catch(error) {
    console.log(error)
  }
}