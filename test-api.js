// Test script để kiểm tra API auth
const fetch = require('node-fetch');

async function testAuth() {
  try {
    console.log('Testing API auth...');
    
    const response = await fetch('http://localhost:3000/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456'
      })
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Chờ server khởi động
setTimeout(testAuth, 5000);
