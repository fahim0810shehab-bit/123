import fetch from 'node-fetch';

async function test() {
  const res = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parts: [{ text: "Hello" }] })
  });
  const text = await res.text();
  console.log(res.status, text);
}
test();
