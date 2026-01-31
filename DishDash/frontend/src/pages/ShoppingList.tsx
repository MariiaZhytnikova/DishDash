import { useEffect, useState } from "react";
import styled from "styled-components";
import { getShoppingList, removeFromShopping, clearShopping, addToShopping, sendShoppingListToEmail, createWoltOrder } from "../api";
import type { Ingredient } from "../api";

const Container = styled.div`
  width: 100%;
  padding: 24px;
`;

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

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  padding: 8px 16px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: #dc2626;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ShoppingListTable = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px;
  gap: 16px;
  padding: 16px;
  background: #f5f5f5;
  font-weight: 600;
  border-bottom: 1px solid #e5e5e5;

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const ListItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 100px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
`;

const ItemName = styled.span`
  font-weight: 500;
  color: #1a1a1a;
`;

const ItemQuantity = styled.span`
  color: #666;
  font-size: 0.95rem;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 16px;
  color: #999;

  p {
    font-size: 1.1rem;
    margin: 0;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 32px;
  color: #666;
`;

const ErrorState = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

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
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  color: #1a1a1a;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1a1a1a;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  background-color: #e5e5e5;
  color: #1a1a1a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background-color: #d0d0d0;
  }
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
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #e8f5e9;
    border-color: #4caf50;
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
  color: #1a1a1a;
  font-size: 1rem;
`;

const FooterSection = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e5e5;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SendEmailButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const WoltButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;

  &:hover {
    background-color: #4f46e5;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const EmailModalContent = styled(ModalContent)``;

const EmailInput = styled(Input)``;

export function ShoppingList() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", quantity: 1, unit: "pcs" });
  const [adding, setAdding] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWolt, setSendingWolt] = useState(false);

  // Load shopping list on mount
  useEffect(() => {
    loadShoppingList();
  }, []);

  const loadShoppingList = async () => {
    try {
      setError(null);
      const list = await getShoppingList();
      setItems(list);
    } catch (e) {
      console.error("Load shopping list error:", e);
      setError((e as Error).message ?? "Failed to load shopping list");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (name: string) => {
    try {
      setRemovingItem(name);
      await removeFromShopping(name);
      setItems(items.filter(item => item.name.toLowerCase() !== name.toLowerCase()));
    } catch (e) {
      console.error("Remove item error:", e);
      setError((e as Error).message ?? "Failed to remove item");
    } finally {
      setRemovingItem(null);
    }
  };

  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 0.1) return; // Prevent quantity from going below 0.1
    
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity,
    };
    setItems(updatedItems);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Please enter an ingredient name");
      return;
    }

    try {
      setAdding(true);
      setError(null);
      await addToShopping([{
        name: formData.name.trim(),
        quantity: formData.quantity,
        unit: formData.unit,
      }]);
      
      // Add to local state
      setItems([
        ...items,
        {
          name: formData.name.trim(),
          quantity: formData.quantity,
          unit: formData.unit,
        },
      ]);
      
      // Reset form and close modal
      setFormData({ name: "", quantity: 1, unit: "pcs" });
      setShowAddModal(false);
    } catch (e) {
      console.error("Add item error:", e);
      setError((e as Error).message ?? "Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      setSendingEmail(true);
      setError(null);
      await sendShoppingListToEmail(email, items);
      alert("Shopping list sent to " + email);
      setShowEmailModal(false);
      setEmail("");
    } catch (e) {
      console.error("Send email error:", e);
      setError((e as Error).message ?? "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleWoltOrder = async () => {
    try {
      setSendingWolt(true);
      setError(null);
      const result = await createWoltOrder(items);
      // Open Wolt order in new tab
      window.open(result.url, "_blank");
      alert("Order created! Check Wolt for details.");
    } catch (e) {
      console.error("Create Wolt order error:", e);
      setError((e as Error).message ?? "Failed to create Wolt order");
    } finally {
      setSendingWolt(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear the entire shopping list?")) {
      return;
    }

    try {
      setClearing(true);
      await clearShopping();
      setItems([]);
    } catch (e) {
      console.error("Clear shopping list error:", e);
      setError((e as Error).message ?? "Failed to clear shopping list");
    } finally {
      setClearing(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>Shopping List</h1>
        <ButtonGroup>
          <AddButton onClick={() => setShowAddModal(true)}>
            + Add
          </AddButton>
          {items.length > 0 && (
            <ClearButton onClick={handleClearAll} disabled={clearing}>
              {clearing ? "Clearing..." : "Clear All"}
            </ClearButton>
          )}
        </ButtonGroup>
      </Header>

      {error && <ErrorState>{error}</ErrorState>}

      {loading ? (
        <LoadingState>Loading shopping list...</LoadingState>
      ) : items.length === 0 ? (
        <EmptyState>
          <p>Your shopping list is empty</p>
        </EmptyState>
      ) : (
        <ShoppingListTable>
          <ListHeader>
            <span>Item</span>
            <span>Quantity</span>
            <span>Unit</span>
            <span>Action</span>
          </ListHeader>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ItemName>{item.name}</ItemName>
              <QuantityControl>
                <QuantityButton
                  onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                >
                  −
                </QuantityButton>
                <QuantityDisplay>{item.quantity}</QuantityDisplay>
                <QuantityButton
                  onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                >
                  +
                </QuantityButton>
              </QuantityControl>
              <ItemQuantity>{item.unit}</ItemQuantity>
              <RemoveButton
                onClick={() => handleRemoveItem(item.name)}
                disabled={removingItem === item.name}
              >
                {removingItem === item.name ? "Removing..." : "Remove"}
              </RemoveButton>
            </ListItem>
          ))}
        </ShoppingListTable>
      )}

      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Add Item to Shopping List</ModalTitle>
            <form onSubmit={handleAddItem}>
              <FormGroup>
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Tomato, Milk, Butter"
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseFloat(e.target.value) || 1,
                      })
                    }
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    type="text"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    placeholder="e.g., pcs, kg, L"
                  />
                </FormGroup>
              </FormRow>

              <ButtonRow>
                <SubmitButton type="submit" disabled={adding}>
                  {adding ? "Adding..." : "Add Item"}
                </SubmitButton>
                <CancelButton
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={adding}
                >
                  Cancel
                </CancelButton>
              </ButtonRow>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {items.length > 0 && (
        <FooterSection>
          <SendEmailButton
            onClick={() => setShowEmailModal(true)}
            disabled={sendingEmail}
          >
            📧 Send to Email
          </SendEmailButton>
          <WoltButton
            onClick={handleWoltOrder}
            disabled={sendingWolt}
          >
            {sendingWolt ? "Creating Order..." : "🛒 Create Wolt Order"}
          </WoltButton>
        </FooterSection>
      )}

      {showEmailModal && (
        <ModalOverlay onClick={() => setShowEmailModal(false)}>
          <EmailModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Send Shopping List to Email</ModalTitle>
            <form onSubmit={handleSendEmail}>
              <FormGroup>
                <Label htmlFor="email">Email Address *</Label>
                <EmailInput
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </FormGroup>

              <ButtonRow>
                <SubmitButton type="submit" disabled={sendingEmail}>
                  {sendingEmail ? "Sending..." : "Send Email"}
                </SubmitButton>
                <CancelButton
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  disabled={sendingEmail}
                >
                  Cancel
                </CancelButton>
              </ButtonRow>
            </form>
          </EmailModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
