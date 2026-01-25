import { useEffect, useState } from "react";
import { GetIngredients, AddIngredient } from "../wailsjs/go/main/App";
import type { models } from "../wailsjs/go/models";

function App() {
  const [ingredients, setIngredients] = useState<models.Ingredient[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");

  async function loadIngredients() {
    const data = await GetIngredients();
    setIngredients(data);
  }

  async function addIngredient() {
    await AddIngredient(name, quantity, unit);
    setName("");
    setQuantity(1);
    await loadIngredients();
  }

  useEffect(() => {
    loadIngredients();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>DishDash 🥕</h1>

      <input
        placeholder="Ingredient"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <input
        placeholder="Unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />

      <button onClick={addIngredient}>Add</button>

      <ul>
        {ingredients.map((i, idx) => (
          <li key={idx}>
            {i.name} – {i.quantity} {i.unit}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
