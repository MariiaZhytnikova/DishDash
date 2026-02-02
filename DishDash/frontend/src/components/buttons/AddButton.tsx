import styled from "styled-components";

const StyledButton = styled.button`
  padding: 8px 24px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 500;

  &:hover {
      background-color: var(--color-primary-hover);
  }
`;

interface AddButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function AddButton({ onClick, children = "+ Add", disabled = false }: AddButtonProps) {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}



