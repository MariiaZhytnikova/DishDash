import styled from "styled-components";
import { ShoppingListHeader } from "../components/ShoppingList/ShoppingListHeader";
import { StateDisplay } from "../components/ShoppingList/StateDisplay";
import { ShoppingListTableComponent } from "../components/ShoppingList/ShoppingListTable";
import { ShoppingListFooter } from "../components/ShoppingList/ShoppingListFooter";
import { AddItemModal } from "../components/ShoppingList/AddItemModal";
import { ClearConfirmModal } from "../components/ShoppingList/ClearConfirmModal";
import { SendEmailModal } from "../components/ShoppingList/SendEmailModal";
import { SuccessModal } from "../components/ShoppingList/SuccessModal";
import { useShoppingList } from "../hooks/useShoppingList";

const Container = styled.div`
  width: 100%;
  padding: 24px;
`;

const ErrorState = styled.div`
  background: var(--color-danger-light);
  color: var(--color-danger-text);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export function ShoppingList() {
  const {
    items,
    loading,
    error,
    removingItem,
    clearing,
    showClearAllModal,
    showAddModal,
    formData,
    adding,
    showEmailModal,
    email,
    sendingEmail,
    sendingWolt,
    showSuccessModal,
    successMessage,
    nameInputRef,
    emailInputRef,
    setShowAddModal,
    setFormData,
    setEmail,
    setShowEmailModal,
    setShowSuccessModal,
    handleOpenClearConfirm,
    handleCancelClearConfirm,
    handleRemoveItem,
    handleUpdateQuantity,
    handleAddItem,
    handleSendEmail,
    handleWoltOrder,
    handleClearAll,
  } = useShoppingList();

  return (
    <Container>
      <ShoppingListHeader
        itemsCount={items.length}
        onAddClick={() => setShowAddModal(true)}
        onClearClick={handleOpenClearConfirm}
        isClearing={clearing}
      />

      {error && <ErrorState>{error}</ErrorState>}

      <StateDisplay isLoading={loading} isEmpty={items.length === 0} />

      {items.length > 0 && (
        <>
          <ShoppingListTableComponent
            items={items}
            removingItem={removingItem}
            onRemoveItem={handleRemoveItem}
            onQuantityIncrease={(index) =>
              handleUpdateQuantity(index, items[index].quantity + 1)
            }
            onQuantityDecrease={(index) =>
              handleUpdateQuantity(index, items[index].quantity - 1)
            }
          />
          <ShoppingListFooter
            isSendingEmail={sendingEmail}
            isSendingWolt={sendingWolt}
            onEmailClick={() => setShowEmailModal(true)}
            onWoltClick={handleWoltOrder}
          />
        </>
      )}

      <AddItemModal
        isOpen={showAddModal}
        isAdding={adding}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleAddItem}
        onClose={() => setShowAddModal(false)}
        inputRef={nameInputRef}
      />

      <ClearConfirmModal
        isOpen={showClearAllModal}
        isClearing={clearing}
        onConfirm={handleClearAll}
        onCancel={handleCancelClearConfirm}
      />

      <SendEmailModal
        isOpen={showEmailModal}
        isSending={sendingEmail}
        email={email}
        onEmailChange={setEmail}
        onSubmit={handleSendEmail}
        onClose={() => setShowEmailModal(false)}
        inputRef={emailInputRef}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
    </Container>
  );
}
