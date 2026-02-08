import styled from "styled-components";

const FooterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SendEmailButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background-color: var(--color-secondary-alt);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;

  &:hover {
    background-color: color-mix(
    in srgb,
    var(--color-secondary-alt) 85%,
    transparent
  );
  }

  &:disabled {
    background-color: var(--color-disabled);
    cursor: default;
  }
`;

const WoltButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;

  &:hover {
    background-color: var(--color-primary-hover);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: default;
  }
`;

const FoodoraButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transform: scale(1);
  opacity: 1;
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out, background-color 0.2s ease;

  &:hover {
    transform: scale(0);
    opacity: 0;
    background-color: var(--color-accent-hover);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: default;
  }
`;

interface ShoppingListFooterProps {
  isSendingEmail: boolean;
  isSendingWolt: boolean;
  onEmailClick: () => void;
  onWoltClick: () => void;
}

export function ShoppingListFooter({
  isSendingEmail,
  isSendingWolt,
  onEmailClick,
  onWoltClick,
}: ShoppingListFooterProps) {
  return (
    <FooterSection>
      <SendEmailButton type="button" onClick={onEmailClick} disabled={isSendingEmail}>
        Send to Email
      </SendEmailButton>
      <WoltButton type="button" onClick={onWoltClick} disabled={isSendingWolt}>
        {isSendingWolt ? "Creating Order..." : "Create Wolt Order"}
      </WoltButton>
      <FoodoraButton type="button">
        Create Foodora Order
      </FoodoraButton>
    </FooterSection>
  );
}
