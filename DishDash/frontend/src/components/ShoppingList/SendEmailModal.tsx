import styled from "styled-components";

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
  background: var(--color-white);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-sm);
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  color: var(--color-text);
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.95rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background-color: var(--color-primary-hover);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: default;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background-color: var(--color-bg);
  color: var(--color-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const EmailModalContent = styled(ModalContent)``;

const EmailInput = styled(Input)``;


interface SendEmailModalProps {
  isOpen: boolean;
  isSending: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function SendEmailModal({
  isOpen,
  isSending,
  email,
  onEmailChange,
  onSubmit,
  onClose,
  inputRef,
}: SendEmailModalProps) {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <EmailModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Send Shopping List to Email</ModalTitle>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
            <EmailInput
              ref={inputRef}
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </FormGroup>

          <ButtonRow>
            <SubmitButton type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Email"}
            </SubmitButton>
            <CancelButton type="button" onClick={onClose} disabled={isSending}>
              Cancel
            </CancelButton>
          </ButtonRow>
        </form>
      </EmailModalContent>
    </ModalOverlay>
  );
}
