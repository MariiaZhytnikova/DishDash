import styled from "styled-components";

// ========================================================================
// Success Modal Styled Components
// ========================================================================

const SuccessModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const SuccessModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const SuccessIcon = styled.div<{ $type?: "success" | "error" }>`
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: ${(props) => (props.$type === "error" ? "#ef4444" : "#22c55e")};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
`;

const SuccessTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
`;

const SuccessMessage = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 24px 0;
`;

const SuccessButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
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
`;

// ========================================================================
// Success Modal Component
// ========================================================================

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
  type?: "success" | "error";
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  buttonText = "OK",
  type = "success",
}: SuccessModalProps) {
  if (!isOpen) return null;

  const defaultTitle = type === "error" ? "Error" : "Success!";
  const icon = type === "error" ? "✕" : "✓";

  return (
    <SuccessModalOverlay onClick={onClose}>
      <SuccessModalContent onClick={(e) => e.stopPropagation()}>
        <SuccessIcon $type={type}>{icon}</SuccessIcon>
        <SuccessTitle>{title || defaultTitle}</SuccessTitle>
        <SuccessMessage>{message}</SuccessMessage>
        <SuccessButton onClick={onClose}>{buttonText}</SuccessButton>
      </SuccessModalContent>
    </SuccessModalOverlay>
  );
}
