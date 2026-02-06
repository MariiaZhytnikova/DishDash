import styled from "styled-components";
import { AddButton } from "../buttons/AddButton";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h1 {
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const ClearButton = styled.button`
  padding: 8px 16px;
  background-color: var(--color-danger);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: var(--color-danger-hover);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: default;
  }
`;

interface ShoppingListHeaderProps {
  itemsCount: number;
  onAddClick: () => void;
  onClearClick: () => void;
  isClearing: boolean;
}

export function ShoppingListHeader({
  itemsCount,
  onAddClick,
  onClearClick,
  isClearing,
}: ShoppingListHeaderProps) {
  return (
    <Header>
      <h2>Shopping List</h2>
      <ButtonGroup>
        <AddButton onClick={onAddClick}>+ Add</AddButton>
        {itemsCount > 0 && (
          <ClearButton onClick={onClearClick} disabled={isClearing}>
            {isClearing ? "Clearing..." : "Clear All"}
          </ClearButton>
        
          
        )}
      </ButtonGroup>
    </Header>
  );
}
