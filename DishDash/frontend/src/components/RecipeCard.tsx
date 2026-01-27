import styled from "styled-components";
import type {Recipe} from "../types/recipe"

const Card = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
`;

const Meta = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card>
      <h2>{recipe.name}</h2>
      <Meta>
        {recipe.mealType} · {recipe.mainType} · {recipe.country}
      </Meta>
    </Card>
  );
}
