import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { UNITS, SECTIONS } from "../../utils/constants";

export type AddIngredientPayload = {
	section: "fresh" | "pantry" | "rare";
	ingredient: {
		name: string;
		quantity: number;
		unit: string;
		expires_at?: string;  // Optional: ISO date string
	};
};

// Internal form state uses string for quantity to handle decimal input properly
// (e.g., "0.5" displays correctly instead of showing ".5")
// We convert to number when submitting to parent
type InternalFormState = {
	section: "fresh" | "pantry" | "rare";
	ingredient: {
		name: string;
		quantity: string;  // string internally for input handling
		unit: string;
		expires_at?: string;  // Optional: date string
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

const Text = styled.p`
	font-weight: 400;
	color: var(--color-primary-grey);
	margin: 0;
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
	cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
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
	const [payload, setPayload] = useState<InternalFormState>({
		section: "fresh",
		ingredient: {
			name: "",
			quantity: "",  // Empty string allows typing decimals like "0.5"
			unit: "pcs",
		},
	});
	const [error, setError] = useState<string | null>(null);
	const nameInputRef = useRef<HTMLInputElement>(null);

	const displayError = externalError || error;

	// Auto-focus name input when modal opens for better UX
	useEffect(() => {
		if (isOpen && nameInputRef.current) {
			nameInputRef.current.focus();
		}
	}, [isOpen]);

	const handleClose = () => {
		onClose();
		setPayload({
			section: "fresh",
			ingredient: {
				name: "",
				quantity: "",
				unit: "pcs",
			},
		});
		setError(null);
	};

	const isValid = payload.ingredient.name.trim() !== "" && payload.ingredient.quantity !== "" && Number(payload.ingredient.quantity) > 0;

	const handleSubmit = () => {
		if (!payload.ingredient.name.trim()) {
			setError("Please enter ingredient name");
			return;
		}
		if (!payload.ingredient.quantity || isNaN(Number(payload.ingredient.quantity)) || Number(payload.ingredient.quantity) <= 0) {
			setError("Quantity must be greater than 0");
			return;
		}
		setError(null);
		
		// Calculate expiration date if shelf life is provided
		let expiresAt: string | undefined;
		if (payload.ingredient.expires_at && payload.ingredient.expires_at.trim() !== "") {
			const days = Number(payload.ingredient.expires_at);
			if (!isNaN(days) && days > 0) {
				const expirationDate = new Date();
				expirationDate.setDate(expirationDate.getDate() + days);
				expiresAt = expirationDate.toISOString().split('T')[0]; // Format: "2026-02-10"
				console.log(`Converting ${days} days to expiration date: ${expiresAt}`);
			}
		}
		
		// Convert string quantity to number for API submission
		const submitPayload: AddIngredientPayload = {
			section: payload.section,
			ingredient: {
				name: payload.ingredient.name,
				quantity: Number(payload.ingredient.quantity),
				unit: payload.ingredient.unit,
				...(expiresAt && { expires_at: expiresAt }), // Only include if defined
			},
		};
		console.log("Submitting payload to backend:", submitPayload);
		onSubmit(submitPayload);
		// Reset form after submit - don't close here, let parent handle it
		setPayload({
			section: "fresh",
			ingredient: {
				name: "",
				quantity: "",
				unit: "pcs",
			},
		});
		setError(null);
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
						ref={nameInputRef}
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
						type="text"  //ext type allows "0.5"
						min={0}
						step="1"
						placeholder="e.g., 0.5, 2, 100"
						value={payload.ingredient.quantity} 
						onChange={(e) => {
						const val = e.target.value;
						// Only allow empty or valid numbers (allows typing decimals)
						if (val === "" || !isNaN(Number(val))) {
							setPayload({
								...payload,
								ingredient: { ...payload.ingredient, quantity: val },
							});
						}
					}}
						required
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
				
				<FormGroup>
					<Label htmlFor="shelfLife">Shelf Life (days)</Label>
					<Input
						id="shelfLife"
						type="text"
						min={0}
						step="1"
						placeholder="e.g., 3, 7, 14"
						value={payload.ingredient.expires_at || ""} 
						onChange={(e) => {
							const val = e.target.value;
							// Only allow empty or valid numbers
							if (val === "" || !isNaN(Number(val))) {
								setPayload({
									...payload,
									ingredient: { ...payload.ingredient, expires_at: val },
								});
							}
						}}
					/>
					<Text>Leave empty if not applicable</Text>
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
