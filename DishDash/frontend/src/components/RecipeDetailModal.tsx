import styled from "styled-components";
import { useState } from "react";
import type { RecipeDetails } from "../api";
import { addToShopping } from "../api";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  position: relative;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #000;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
`;

const StepsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const StepsList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  counter-reset: step-counter;

  li {
    counter-increment: step-counter;
    margin-bottom: 12px;
    padding-left: 32px;
    position: relative;
    color: #333;
    line-height: 1.5;

    &::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      top: 0;
      background: #4caf50;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875rem;
      font-weight: 600;
    }
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RecipeHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RecipeName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const MealTypeTag = styled.span`
  background: #4caf50;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  width: fit-content;
`;

const Description = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
`;

const IngredientsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const IngredientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const IngredientItem = styled.div<{ $missing: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: ${(props) => (props.$missing ? "#fee2e2" : "#dcfce7")};
  border-left: 4px solid ${(props) => (props.$missing ? "#ef4444" : "#22c55e")};
`;

const IngredientName = styled.span<{ $missing: boolean }>`
  font-weight: 500;
  color: ${(props) => (props.$missing ? "#991b1b" : "#166534")};
`;

const IngredientQuantity = styled.span<{ $missing: boolean }>`
  color: ${(props) => (props.$missing ? "#7f1d1d" : "#15803d")};
  font-size: 0.875rem;
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e5e5;
`;

const SummaryItem = styled.div<{ $type: "available" | "missing" }>`
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: ${(props) => (props.$type === "available" ? "#dcfce7" : "#fee2e2")};
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 4px;
`;

const SummaryCount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) =>
    props.style?.color || "#1a1a1a"};
`;

const AddToShoppingButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #21c6e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0f6ca8;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

interface RecipeDetailModalProps {
  recipe: RecipeDetails;
  onClose: () => void;
}

export function RecipeDetailModal({
  recipe,
  onClose,
}: RecipeDetailModalProps) {
  const imageUrl = `${import.meta.env.BASE_URL}small/${recipe.id}.jpg`;
  const steps = recipe.steps || [];
  const [loading, setLoading] = useState(false);

  const missingIngredients = recipe.ingredients.filter((ing) => ing.missing);

  const handleAddToShopping = async () => {
    try {
      setLoading(true);
      await addToShopping(missingIngredients);
      alert("Missing ingredients added to shopping list!");
      onClose();
    } catch (e) {
      console.error("Failed to add to shopping:", e);
      alert("Failed to add ingredients to shopping list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✕</CloseButton>

        <LeftColumn>
          <RecipeImage
            src={imageUrl}
            alt={recipe.name}
            onError={(e) => {
              e.currentTarget.src = `${import.meta.env.BASE_URL}small/0.png`;
            }}
          />
          {steps.length > 0 && (
            <StepsSection>
              <StepTitle>Instructions</StepTitle>
              <StepsList>
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </StepsList>
            </StepsSection>
          )}
        </LeftColumn>

        <RightColumn>
          <RecipeHeader>
            <RecipeName>{recipe.name}</RecipeName>
            <MealTypeTag>{recipe.mealType}</MealTypeTag>
            {recipe.description && (
              <Description>{recipe.description}</Description>
            )}
          </RecipeHeader>

          <IngredientsSection>
            <SectionTitle>Ingredients</SectionTitle>
            <IngredientsList>
              {recipe.ingredients.map((ingredient, index) => (
                <IngredientItem key={index} $missing={ingredient.missing}>
                  <IngredientName $missing={ingredient.missing}>
                    {ingredient.name}
                  </IngredientName>
                  <IngredientQuantity $missing={ingredient.missing}>
                    {ingredient.quantity} {ingredient.unit}
                  </IngredientQuantity>
                </IngredientItem>
              ))}
            </IngredientsList>

            <SummarySection>
              <SummaryItem $type="available">
                <SummaryLabel>Available</SummaryLabel>
                <SummaryCount style={{ color: "#16a34a" }}>
                  {recipe.available}
                </SummaryCount>
              </SummaryItem>
              <SummaryItem $type="missing">
                <SummaryLabel>Missing</SummaryLabel>
                <SummaryCount style={{ color: "#dc2626" }}>
                  {recipe.missing}
                </SummaryCount>
              </SummaryItem>
            </SummarySection>

            {missingIngredients.length > 0 && (
              <AddToShoppingButton
                onClick={handleAddToShopping}
                disabled={loading}
              >
                {loading
                  ? "Adding..."
                  : "Add Missing Ingredients to Shopping List"}
              </AddToShoppingButton>
            )}
          </IngredientsSection>
        </RightColumn>
      </ModalContent>
    </ModalOverlay>
  );
}
