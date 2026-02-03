import styled from "styled-components";
import { useEffect, useState } from "react";
import { getFridge, addIngredient, deleteIngredient, increaseIngredient, type Fridge, type Ingredient } from "../api";
import { AddIngredientModal, type AddIngredientPayload } from "../components/Ingredients/AddIngredientModal";
import { SuccessModal } from "../components/SuccessModal";
import { AddButton } from "../components/buttons/AddButton";
import { IngredientCard } from "../components/Ingredients/IngredientCard";

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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

// Group ingredients by name AND expiration date, combining quantities
function groupIngredients(ingredients: Ingredient[]): Ingredient[] {
  const grouped = new Map<string, Ingredient>();
  
  for (const ing of ingredients) {
    // Create a unique key: name + expires_at (or name + "no-expiry" if no date)
    const key = `${ing.name.toLowerCase()}_${ing.expires_at || 'no-expiry'}`;
    
    if (grouped.has(key)) {
      // Add quantity to existing group
      const existing = grouped.get(key)!;
      existing.quantity += ing.quantity;
    } else {
      // Create new group (clone to avoid mutation)
      grouped.set(key, { ...ing });
    }
  }
  
  return Array.from(grouped.values());
}

export function Ingredients() {
  const [fridge, setFridge] = useState<Fridge>({fresh: [], pantry: [], rare: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
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
      setSuccessMessage("Ingredient added successfully!");
      setShowSuccessModal(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to add ingredient";
      setModalError(errorMsg);
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

  const handleQuantityChange = async (name: string, newQuantity: number) => {
    try {
      // Find the current ingredient
      const allIngredients = [...fridge.fresh, ...fridge.pantry, ...fridge.rare];
      const ingredient = allIngredients.find(ing => ing.name === name);
      
      if (!ingredient) return;
      
      const quantityDiff = newQuantity - ingredient.quantity;
      
      if (quantityDiff !== 0) {
        await increaseIngredient(name, quantityDiff);
        // Refresh fridge data
        const updatedFridge = await getFridge();
        setFridge(updatedFridge);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update quantity");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  // Group ingredients before rendering
  const groupedFresh = groupIngredients(fridge.fresh);
  const groupedPantry = groupIngredients(fridge.pantry);
  const groupedRare = groupIngredients(fridge.rare);

  return (
    <Grid>
      <AddContainer>
        <h2>Add Ingredient</h2>
        <AddButton onClick={() => setIsModalOpen(true)}>+ Add</AddButton>
      </AddContainer>
      <Container>
          {groupedFresh.length > 0 && (
            <Category>
              <CategoryTitle>Fresh</CategoryTitle>
              <IngredientList>
                {groupedFresh.map((ing, i) => (
                  <IngredientCard
                    key={`${ing.name}-${ing.expires_at || 'no-expiry'}-${i}`}
                    ingredient={ing}
                    onDelete={handleDeleteIngredient}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </IngredientList>
            </Category>
          )}
          {groupedPantry.length > 0 && (
            <Category>
              <CategoryTitle>Pantry</CategoryTitle>
              <IngredientList>
                {groupedPantry.map((ing, i) => (
                  <IngredientCard
                    key={`${ing.name}-${ing.expires_at || 'no-expiry'}-${i}`}
                    ingredient={ing}
                    onDelete={handleDeleteIngredient}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </IngredientList>
            </Category>
          )}
          {groupedRare.length > 0 && (
            <Category>
              <CategoryTitle>Rare</CategoryTitle>
              <IngredientList>
                {groupedRare.map((ing, i) => (
                  <IngredientCard
                    key={`${ing.name}-${ing.expires_at || 'no-expiry'}-${i}`}
                    ingredient={ing}
                    onDelete={handleDeleteIngredient}
                    onQuantityChange={handleQuantityChange}
                  />
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
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </Grid>
  );
}
