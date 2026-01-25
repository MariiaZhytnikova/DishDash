export async function hello() {
  const res = await fetch("http://localhost:8080/api/hello");
  return res.json();
}
