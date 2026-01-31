import { useState } from "react";
import styled from "styled-components";
import { UNITS, SECTIONS } from "../utils/constants";

export type AddIngredientPayload = {
  section: "fresh" | "pantry" | "rare";
  ingredient: {
    name: string;
    quantity: number;
    unit: string;
  };
};

type AddIngredientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddIngredientPayload) => void;
  error?: string | null;
};

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: min(420px, 90vw);
`;

const Title = styled.h2`
  margin: 0 0 16px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1fa9e4;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #1fa9e4;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
`;

const PrimaryButton = styled.button<{ $disabled?: boolean }>`
  padding: 8px 16px;
  background-color: ${(props) => (props.$disabled ? "#ccc" : "#1fa9e4")};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  font-weight: 600;

  &:hover {
    background-color: ${(props) => (props.$disabled ? "#ccc" : "#138ec3")};
  }
`;

const GhostButton = styled.button`
  padding: 8px 16px;
  background-color: #f2f2f2;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #e6e6e6;
  }
`;

const ErrorMessage = styled.p`
  color: #cc0000;
  font-size: 14px;
  margin: 0;
`;

export function AddIngredientModal({ isOpen, onClose, onSubmit, error: externalError }: AddIngredientModalProps) {
  const [payload, setPayload] = useState<AddIngredientPayload>({
    section: "fresh",
    ingredient: {
      name: "",
      quantity: 0,
      unit: "pcs",
    },
  });
  const [error, setError] = useState<string | null>(null);

  const displayError = externalError || error;

  const handleClose = () => {
    onClose();
    setPayload({
      section: "fresh",
      ingredient: {
        name: "",
        quantity: 0,
        unit: "pcs",
      },
    });
    setError(null);
  };

  const isValid = payload.ingredient.name.trim() !== "" && payload.ingredient.quantity > 0;

  const handleSubmit = () => {
    if (!payload.ingredient.name.trim()) {
      setError("Please enter ingredient name");
      return;
    }
    if (payload.ingredient.quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    setError(null);
    onSubmit(payload);
    handleClose();
  };

  return (
    <Overlay $isOpen={isOpen} onClick={handleClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Add ingredient</Title>

        <FormGroup>
          <Label htmlFor="section">Section</Label>
          <Select
            id="section"
            value={payload.section}
            onChange={(e) => setPayload({ ...payload, section: e.target.value as AddIngredientPayload["section"] })}
          >
            {/* <option value="fresh">Fresh</option>
            <option value="pantry">Pantry</option>
            <option value="rare">Rare</option> */}
            {SECTIONS.map((section) => (
              <option key={section.key} value={section.key}>
                {section.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="name">Ingredient name</Label>
          <Input
            id="name"
            type="text"
            placeholder="egg"
            value={payload.ingredient.name}
            onChange={(e) => setPayload({
              ...payload,
              ingredient: { ...payload.ingredient, name: e.target.value },
            })}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={0}
            step="1"
            placeholder="e.g., 500"
            value={payload.ingredient.quantity || ""}
            onChange={(e) => setPayload({
              ...payload,
              ingredient: { ...payload.ingredient, quantity: e.target.value === "" ? 0 : Number(e.target.value) },
            })}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="unit">Unit</Label>
          <Select
            id="unit"
            value={payload.ingredient.unit}
            onChange={(e) => setPayload({
              ...payload,
              ingredient: { ...payload.ingredient, unit: e.target.value },
            })}
          >
            {UNITS.map((unit) => (
              <option key={unit.key} value={unit.key}>
                {unit.label}
              </option>
            ))}
          </Select>
        </FormGroup>

        {displayError && <ErrorMessage>{displayError}</ErrorMessage>}

        <ButtonRow>
          <GhostButton type="button" onClick={handleClose}>Cancel</GhostButton>
          <PrimaryButton type="button" onClick={handleSubmit} $disabled={!isValid} disabled={!isValid}>Add</PrimaryButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
}
