const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET_KEY });

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  try {
    if (httpMethod === 'GET') {
      const result = await client.query(
        q.Get(q.Ref(q.Collection('choreData'), '1'))
      );
      return {
        statusCode: 200,
        body: JSON.stringify(result.data),
      };
    } else if (httpMethod === 'POST') {
      const data = JSON.parse(body);
      await client.query(
        q.Replace(q.Ref(q.Collection('choreData'), '1'), { data })
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to perform operation' }),
    };
  }
};