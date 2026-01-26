export async function status() {
  const res = await fetch("http://localhost:8080/health");

  if (!res.ok) {
    throw new Error(`healthcheck failed with ${res.status}`);
  }

  return res.json();
}