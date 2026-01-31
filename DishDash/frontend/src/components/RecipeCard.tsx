import styled from "styled-components";
import type {Recipe} from "../types/recipe"
import { getMealTypeColors } from "../utils/colors";

const Card = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  
`;

const HeartButton = styled.button`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(121, 121, 121, 0.8);
  border: none;
  border-radius: 20%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.125rem;
  transition: background 0.2s, transform 0.2s;
  
  // &:hover {
  //   background: rgba(255, 255, 255, 1);
  //   transform: scale(1.1);
  // }
`;

const CardContent = styled.div`
 margin: 0 16px 16px 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Tag = styled.span<{ $bgColor: string; $textColor: string }>`
  background: ${props => props.$bgColor};
  color: ${props => props.$textColor};
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const DietTypeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;
const CountryTag = styled.span`
  color: #000000;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #e5e5e5;
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
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  onClick?: () => void;
}

export function RecipeCard({ recipe, availableIngredients = 0, onFavoriteToggle, isFavorite = false, onClick }: RecipeCardProps) {
  const totalIngredients = recipe.ingredients.length;
  const available = Math.min(availableIngredients, totalIngredients);
  const percentage = totalIngredients > 0 ? Math.round((available / totalIngredients) * 100) : 0;
  const mealTypeColors = getMealTypeColors(recipe.mealType);
  // const imageUrl = recipe.imageUrl || `/small/${recipe.id}.jpg`;
  const imageUrl = recipe.imageUrl || `${import.meta.env.BASE_URL}small/${recipe.id}.jpg`;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if user clicked the heart button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onClick?.();
  };

  return (
    <Card onClick={handleCardClick}>
      <ImageContainer>
        <RecipeImage src={imageUrl} alt={recipe.name} onError={(e) => {
          e.currentTarget.src = `${import.meta.env.BASE_URL}small/0.png`; // Fallback image
        }} />
        <HeartButton onClick={onFavoriteToggle} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
          {isFavorite ? '❤️' : '🩶'}
        </HeartButton>
      </ImageContainer>
      <CardContent>
      <Header>
        <Tag $bgColor={mealTypeColors.bgColor} $textColor={mealTypeColors.textColor}>
          {recipe.mealType}
        </Tag>
        <CountryTag>{recipe.country}</CountryTag>
      </Header>  
        <RecipeName>{recipe.name}</RecipeName>
        {recipe.dietType && recipe.dietType.length > 0 && (
          <DietTypeContainer>
            {recipe.dietType.map((diet, index) => (
              <Tag key={index} $bgColor="#dcfce7" $textColor="#016630">
                {diet}
              </Tag>
            ))}
          </DietTypeContainer>
        )}
        <IngredientsText>{totalIngredients} ingredients</IngredientsText>
        <AvailabilityInfo>
          <AvailabilityText>{available} of {totalIngredients} available</AvailabilityText>
          <PercentageText>{percentage}%</PercentageText>
        </AvailabilityInfo>
        <ProgressBar>
          <ProgressFill percentage={percentage} />
        </ProgressBar>
      </CardContent>
    </Card>
  );
}
