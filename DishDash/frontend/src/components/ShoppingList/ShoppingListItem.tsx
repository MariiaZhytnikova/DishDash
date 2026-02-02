import styled from "styled-components";
import type { Ingredient } from "../../api";

const ListItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  justify-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--color-bg-light);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const ItemName = styled.span`
  font-weight: 500;
  color: var(--color-text);
  justify-self: start;
  text-align: left;
`;

const ItemQuantity = styled.span`
  color: var(--color-text-muted);
  font-size: 0.95rem;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background-color: transparent;
  color: var(--color-danger-text);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: #fecaca;
    border-color: #f87171;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const BinIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-primary-light);
    border-color: var(--color-primary);
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: var(--color-text);
  font-size: 1rem;
`;

interface ShoppingListItemProps {
  item: Ingredient;
  index: number;
  isRemoving: boolean;
  onRemove: (name: string) => void;
  onQuantityIncrease: (index: number) => void;
  onQuantityDecrease: (index: number) => void;
}

export function ShoppingListItemComponent({
  item,
  index,
  isRemoving,
  onRemove,
  onQuantityIncrease,
  onQuantityDecrease,
}: ShoppingListItemProps) {
  return (
    <ListItem>
      <ItemName>{item.name}</ItemName>
      <QuantityControl>
        <QuantityButton onClick={() => onQuantityDecrease(index)}>−</QuantityButton>
        <QuantityDisplay>{item.quantity}</QuantityDisplay>
        <QuantityButton onClick={() => onQuantityIncrease(index)}>+</QuantityButton>
      </QuantityControl>
      <ItemQuantity>{item.unit}</ItemQuantity>
      {/* <RemoveButton onClick={() => onRemove(item.name)} disabled={isRemoving}>
        {isRemoving ? "Removing..." : "Remove"}
      </RemoveButton> */}
      <RemoveButton onClick={() => onRemove(item.name)} disabled={isRemoving}>
        <BinIcon 
            src={`${import.meta.env.BASE_URL}icons/bin.svg`} 
            alt={isRemoving ? "Removing..." : "Remove"} 
          />
      </RemoveButton>
    </ListItem>
  );
}
