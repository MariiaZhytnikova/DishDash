import { useEffect, useState } from "react";
import { hello } from "./api/api";

export default function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    hello().then((data) => setMsg(data.message));
  }, []);

  return <div>{msg || "Loading..."}</div>;
}
