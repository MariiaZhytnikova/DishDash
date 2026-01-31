import { useEffect, useState } from "react";
import styled from "styled-components";
import { getFridge, addIngredient, deleteIngredient, increaseIngredient, type Fridge } from "../api/api";
import { AddIngredientModal, type AddIngredientPayload } from "../components/AddIngredientModal";

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
`;
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
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  &:hover button {
    opacity: 1;
  }
`;

const IngredientInfo = styled.div`
  flex: 1;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 0;
  background-color: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;

  &:hover {
    background-color: #cc0000;
  }
`;

export function Ingredients() {
  const [fridge, setFridge] = useState<Fridge>({fresh: [], pantry: [], rare: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  
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

  const handleAddIngredient = async (payload: AddIngredientPayload) => {
    try {
      setModalError(null);
      await addIngredient(payload);
      // Refresh fridge data after adding
      const updatedFridge = await getFridge();
      setFridge(updatedFridge);
      setIsModalOpen(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add ingredient";
      // If ingredient already exists, increase quantity instead
      if (errorMsg.includes("400")) {
        try {
          await increaseIngredient(payload.ingredient.name, payload.ingredient.quantity);
          // Refresh fridge data after increasing
          const updatedFridge = await getFridge();
          setFridge(updatedFridge);
          setIsModalOpen(false);
        } catch (increaseErr) {
          const increaseErrorMsg = increaseErr instanceof Error ? increaseErr.message : "Failed to increase quantity";
          setModalError(increaseErrorMsg);
        }
      } else {
        setModalError(errorMsg);
      }
    }
  };

  const handleDeleteIngredient = async (name: string) => {
    try {
      await deleteIngredient(name);
      // Refresh fridge data after deleting
      const updatedFridge = await getFridge();
      setFridge(updatedFridge);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete ingredient");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <Grid>
      <AddContainer>
        <h2>Add Ingredient</h2>
        <AddButton onClick={() => setIsModalOpen(true)}>+ Add ingredient</AddButton>
      </AddContainer>
      <Container>
          {fridge.fresh.length > 0 && (
            <Category>
              <CategoryTitle>Fresh</CategoryTitle>
              <IngredientList>
                {fridge.fresh.map((ing, i) => (
                  <IngredientCard key={i}>
                    <IngredientInfo>
                      <div>{ing.name}</div>
                      <div>{ing.quantity} {ing.unit}</div>
                    </IngredientInfo>
                    <DeleteButton onClick={() => handleDeleteIngredient(ing.name)}>×</DeleteButton>
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
                    <IngredientInfo>
                      <div>{ing.name}</div>
                      <div>{ing.quantity} {ing.unit}</div>
                    </IngredientInfo>
                    <DeleteButton onClick={() => handleDeleteIngredient(ing.name)}>×</DeleteButton>
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
                    <IngredientInfo>
                      <div>{ing.name}</div>
                      <div>{ing.quantity} {ing.unit}</div>
                    </IngredientInfo>
                    <DeleteButton onClick={() => handleDeleteIngredient(ing.name)}>×</DeleteButton>
                  </IngredientCard>
                ))}
              </IngredientList>
            </Category>
          )}
      </Container>
      <AddIngredientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError(null);
        }}
        onSubmit={handleAddIngredient}
        error={modalError}
      />
    </Grid>
  );
}
