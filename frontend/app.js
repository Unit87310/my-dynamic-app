document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('https://your-backend-api.com/data');
  const data = await response.json();
  document.getElementById('content').innerHTML = 
    `<p>Dynamic data: ${data.message}</p>`;
});