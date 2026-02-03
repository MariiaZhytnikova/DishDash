import styled from "styled-components";
import type { Ingredient } from "../../api/types";
import { DeleteButton } from "../buttons/DeleteButton";

interface IngredientCardProps {
  ingredient: Ingredient;
  onDelete: (name: string) => void;
  onQuantityChange: (name: string, newQuantity: number) => void;
}

// Calculate expiration status
function getExpirationStatus(expiresAt?: string): {
  status: "fresh" | "use-soon" | "expiring-soon" | "expired" | "no-expiry";
  label: string;
  daysLeft: number | null;
} {
  if (!expiresAt || expiresAt === "") {
	return { status: "no-expiry", label: "No shelf life set", daysLeft: null };
  }

  const expiration = new Date(expiresAt);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
	return { status: "expired", label: "Expired", daysLeft: 0 };
  } else if (daysLeft <= 3) {
	return { status: "expiring-soon", label: "Expiring soon", daysLeft };
  } else if (daysLeft <= 7) {
	return { status: "use-soon", label: "Use soon", daysLeft };
  } else {
	return { status: "fresh", label: "Fresh", daysLeft };
  }
}

const Card = styled.div<{ $status: string }>`
  /*border: 2px solid rgba(31, 169, 228, 0.3);*/
  border: 1px solid #d2d2d2ff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $status }) => {
	switch ($status) {
	  case "expired":
	  case "expiring-soon":
		return "#dc2626";
	  case "use-soon":
		return "#ea580c";
	  case "no-expiry":
		return "#6b7280";
	  default:
		return "#16a34a";
	}
  }};
  padding-bottom: 12px;
  border-bottom: 1px dashed ${({ $status }) => {
	switch ($status) {
	  case "expired":
	  case "expiring-soon":
		return "#fca5a5";
	  case "use-soon":
		return "#fdba74";
	  case "no-expiry":
		return "#d1d5db";
	  default:
		return "#86efac";
	}
  }};
`;

const StatusLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIcon = styled.div<{ $status: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $status }) => {
	switch ($status) {
	  case "expired":
	  case "expiring-soon":
		return "#fee2e2";
	  case "use-soon":
		return "#ffedd5";
	  case "no-expiry":
		return "#e5e7eb";
	  default:
		return "#dcfce7";
	}
  }};
`;

// Helper function to get the icon path based on status
function getStatusIcon(status: string): string {
  switch (status) {
    case "fresh":
      return `${import.meta.env.BASE_URL}icons/green.svg`; // You need to add this file
    case "warning":
      return `${import.meta.env.BASE_URL}icons/green.svg`; // You need to add this file
    case "no-expiry":
      return `${import.meta.env.BASE_URL}icons/grey.svg`; // You need to add this file
    default:
      return `${import.meta.env.BASE_URL}icons/red.svg`; // You need to add this file
  }
}

const IngredientHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const StyledDeleteButton = styled(DeleteButton)`
  opacity: 0;
  transition: opacity 0.2s;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const IngredientName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--color-cardtext);
`;

const QuantityText = styled.p`
  font-size: 16px;
  color: var(--color-text-muted);
  margin: 4px 0;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
`;

const QuantityLabel = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  color: #666;
  transition: all 0.2s;

  &:hover {
	background: #f3f4f6;
	border-color: #1fa9e4;
	color: #1fa9e4;
  }

  &:active {
	transform: scale(0.95);
  }

  &:disabled {
	opacity: 0.5;
	cursor: not-allowed;
	&:hover {
	  background: white;
	  border-color: #ddd;
	  color: #666;
	}
  }
`;

export function IngredientCard({ ingredient, onDelete, onQuantityChange }: IngredientCardProps) {
  console.log("IngredientCard rendered:", ingredient.name, ingredient);
  const { status, label, daysLeft } = getExpirationStatus(ingredient.expires_at);

  const handleIncrease = () => {
	onQuantityChange(ingredient.name, ingredient.quantity + 1);
  };

  const handleDecrease = () => {
	if (ingredient.quantity > 1) {
	  onQuantityChange(ingredient.name, ingredient.quantity - 1);
	}
  };

  return (
	<Card $status={status}>
		<StatusBadge $status={status}>
			<StatusLeft>
			  <StatusIcon $status={status}>
			    <img src={getStatusIcon(status)} alt={label} />
			  </StatusIcon>
			  <span>{label}</span>
			</StatusLeft>
			{daysLeft !== null && (
	  <span>{daysLeft === 1 ? "1 day left" : `${daysLeft} days left`}</span>
		)}
	</StatusBadge>

	<IngredientHeader>
	  <IngredientName>{ingredient.name}</IngredientName>
	  <StyledDeleteButton onClick={() => onDelete(ingredient.name)} />
	</IngredientHeader>

	<QuantityText>
	  {ingredient.quantity} {ingredient.unit}
	</QuantityText>	
	<QuantityControls>
			<QuantityButton onClick={handleDecrease} disabled={ingredient.quantity <= 1}>
				−
			</QuantityButton>
			<QuantityLabel>Adjust Quantity</QuantityLabel>
			<QuantityButton onClick={handleIncrease}>
				+
			</QuantityButton>
	  </QuantityControls>
	</Card>
  );
}
