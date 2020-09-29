/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const jwt = require('jsonwebtoken');

module.exports = async () => {
  try {
    console.log('Creating ITV Tasks');
    const payLoad = {
      iss: 'Hackney',
      name: 'Scheduled Task',
      groups: process.env.ALLOWED_GROUPS.split(','),
    };
    const token = jwt.sign(payLoad, process.env.JWT_SECRET);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_PATH}/tasks/syncItvTasks`,
        {},
        { headers: { Cookie: `hackneyToken=${token}` } }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log('Finished creating ITV Tasks');
  } catch (e) {
    console.log(e);
  }
};
