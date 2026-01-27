import { useEffect, useState } from "react";
import { searchRecipes } from "../api/api";

export function Recipes() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      console.log("Recipes mounted → calling /search");
      try {
        setError(null);
        const res = await searchRecipes();
        console.log("RAW /search parsed JSON:", res);
        console.log("Is array?", Array.isArray(res));
        setData(res);
      } catch (e) {
        console.error("Search error:", e);
        setError((e as Error).message ?? "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1>Recipes </h1>

      {loading && <p>Loading...</p>}
      {error && <p role="alert">Error: {error}</p>}

      {!loading && !error && (
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
