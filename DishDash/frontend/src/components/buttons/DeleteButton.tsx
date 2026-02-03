import styled from "styled-components";

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isRemoving?: boolean;
  size?: "small" | "medium";
}

const StyledButton = styled.button<{ $size: "small" | "medium" }>`
  padding: ${({ $size }) => ($size === "small" ? "4px 8px" : "6px 12px")};
  background-color: transparent;
  color: var(--color-danger-text);
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: ${({ $size }) => ($size === "small" ? "16px" : "18px")};
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => ($size === "small" ? "24px" : "28px")};
  height: ${({ $size }) => ($size === "small" ? "24px" : "28px")};

  &:hover {
    background-color: #fecaca;
    border-color: #f87171;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BinIcon = styled.img<{ $size: "small" | "medium" }>`
  width: ${({ $size }) => ($size === "small" ? "14px" : "18px")};
  height: ${({ $size }) => ($size === "small" ? "14px" : "18px")};
`;

export function DeleteButton({ 
  onClick, 
  disabled = false, 
  isRemoving = false,
  size = "medium" 
}: DeleteButtonProps) {
  return (
    <StyledButton 
      onClick={onClick} 
      disabled={disabled || isRemoving}
      title={isRemoving ? "Removing..." : "Delete"}
      $size={size}
    >
      <BinIcon 
        src={`${import.meta.env.BASE_URL}icons/bin.svg`} 
        alt={isRemoving ? "Removing..." : "Delete"} 
        $size={size}
      />
    </StyledButton>
  );
}
