import styled from "styled-components";
import type {Recipe} from "../types/recipe"

const Card = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const MealTypeTag = styled.span`
  background: #d4f4dd;
  color: #2d6a3e;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  
  &:hover {
    color: #dc2626;
  }
`;

const RecipeName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 12px 0 8px 0;
`;

const IngredientsText = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 8px;
`;

const AvailabilityInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const AvailabilityText = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const PercentageText = styled.span`
  color: #1a1a1a;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: #4ade80;
  border-radius: 4px;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

interface RecipeCardProps {
  recipe: Recipe;
  availableIngredients?: number;
  onDelete?: () => void;
}

export function RecipeCard({ recipe, availableIngredients = 0, onDelete }: RecipeCardProps) {
  const totalIngredients = recipe.ingredients.length;
  const available = Math.min(availableIngredients, totalIngredients);
  const percentage = totalIngredients > 0 ? Math.round((available / totalIngredients) * 100) : 0;

  return (
    <Card>
      <Header>
        <MealTypeTag>{recipe.mealType}</MealTypeTag>
        {onDelete && (
          <DeleteButton onClick={onDelete} aria-label="Delete recipe">
            🗑️
          </DeleteButton>
        )}
      </Header>
      
      <RecipeName>{recipe.name}</RecipeName>
      
      <IngredientsText>{totalIngredients} ingredients</IngredientsText>
      
      <AvailabilityInfo>
        <AvailabilityText>{available} of {totalIngredients} available</AvailabilityText>
        <PercentageText>{percentage}%</PercentageText>
      </AvailabilityInfo>
      
      <ProgressBar>
        <ProgressFill percentage={percentage} />
      </ProgressBar>
    </Card>
  );
}
