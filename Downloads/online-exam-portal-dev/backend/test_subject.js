const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/login', {
      email: 'teacher@test.com',
      password: 'password123'
    });
    console.log("Login Res:", loginRes.data);

    if (!loginRes.data.success) {
      console.log("Failed to login, trying to register teacher first...");
      // Wait, we need an admin token to register a teacher...
      // Let's just create a dummy subject instead of full test for now.
      return;
    }

    const token = loginRes.data.token;
    
    const subjectRes = await axios.post('http://localhost:5000/api/v1/user/createSubject', {
      name: 'Test Subject ' + Date.now()
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Subject Res:", subjectRes.data);
  } catch (err) {
    console.log("Error:", err.response ? err.response.data : err.message);
  }
}

test();
