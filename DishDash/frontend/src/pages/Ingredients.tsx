import { useEffect, useState } from "react";
import styled from "styled-components";
import { getFridge, type Fridge } from "../api/api";

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const AddContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  `
const AddButton = styled.button`
  padding: 8px 24px;
  background-color: #1FA9E4;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    background-color: #138ec3;
  }
`;

const Container = styled.div`
  padding: 20px;
`;

const Category = styled.div`
  margin-bottom: 32px;
`;

const CategoryTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
`;

const IngredientList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`;

const IngredientCard = styled.div`
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
`;

export function Ingredients() {
  const [fridge, setFridge] = useState<Fridge>({fresh: [], pantry: [], rare: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getFridge();
        setFridge(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load fridge");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  {loading && <p>Loading...</p>}
  {error && <p role="alert">Error: {error}</p>}

  return (
    <Grid>
    <AddContainer>
      <h2>Add Ingredient</h2>
      <AddButton>+  Add ingredient</AddButton>
    </AddContainer>
    <Container>
          {fridge.fresh.length > 0 && (
            <Category>
              <CategoryTitle>Fresh</CategoryTitle>
              <IngredientList>
                {fridge.fresh.map((ing, i) => (
                  <IngredientCard key={i}>
                    <div>{ing.name}</div>
                    <div>{ing.quantity} {ing.unit}</div>
                  </IngredientCard>
                ))}
              </IngredientList>
            </Category>
          )}
          {fridge.pantry.length > 0 && (
            <Category>
              <CategoryTitle>Pantry</CategoryTitle>
              <IngredientList>
                {fridge.pantry.map((ing, i) => (
                  <IngredientCard key={i}>
                    <div>{ing.name}</div>
                    <div>{ing.quantity} {ing.unit}</div>
                  </IngredientCard>
                ))}
              </IngredientList>
            </Category>
          )}
          {fridge.rare.length > 0 && (
            <Category>
              <CategoryTitle>Rare</CategoryTitle>
              <IngredientList>
                {fridge.rare.map((ing, i) => (
                  <IngredientCard key={i}>
                    <div>{ing.name}</div>
                    <div>{ing.quantity} {ing.unit}</div>
                  </IngredientCard>
                ))}
              </IngredientList>
            </Category>
          )}
        </Container>
    </Grid>
   
  );
}
