import { useEffect, useRef, useState } from "react";
import {
  getShoppingList,
  removeFromShopping,
  clearShopping,
  addToShopping,
  sendShoppingListToEmail,
  createWoltOrder,
} from "../api";
import type { Ingredient } from "../api";

interface FormData {
  name: string;
  quantity: string;
  unit: string;
}

export function useShoppingList() {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: "", quantity: "", unit: "pcs" });
  const [adding, setAdding] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingWolt, setSendingWolt] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [foodoraPosition, setFoodoraPosition] = useState({ x: 40, y: 40 });

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const foodoraButtonRef = useRef<HTMLButtonElement>(null);

  // Load shopping list on mount
  useEffect(() => {
    loadShoppingList();
  }, []);

  // Auto-focus name input when add modal opens
  useEffect(() => {
    if (showAddModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showAddModal]);

  // Auto-focus email input when email modal opens
  useEffect(() => {
    if (showEmailModal && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [showEmailModal]);

  // Initialize Foodora button position at bottom-right
  useEffect(() => {
    setFoodoraPosition({
      x: Math.max(10, window.innerWidth - 260),
      y: Math.max(10, window.innerHeight - 80),
    });
  }, []);

  // Make Foodora button run away from cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const button = foodoraButtonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distance = Math.hypot(
        e.clientX - buttonCenterX,
        e.clientY - buttonCenterY
      );

      // If mouse gets within 150px, move button away
      if (distance < 150) {
        const w = rect.width;
        const h = rect.height;
        const maxX = window.innerWidth - w - 10;
        const maxY = window.innerHeight - h - 10;

        setFoodoraPosition({
          x: Math.random() * Math.max(10, maxX),
          y: Math.random() * Math.max(10, maxY),
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
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
      setItems(items.filter((item) => item.name.toLowerCase() !== name.toLowerCase()));
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

    // Validate quantity is a valid number
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      setError("Please enter a valid quantity");
      return;
    }

    try {
      setAdding(true);
      setError(null);
      // Convert string quantity to number for API
      await addToShopping([
        {
          name: formData.name.trim(),
          quantity: Number(formData.quantity),
          unit: formData.unit,
        },
      ]);

      // Add to local state
      setItems([
        ...items,
        {
          name: formData.name.trim(),
          quantity: Number(formData.quantity),
          unit: formData.unit,
        },
      ]);

      // Reset form and close modal, then show success
      setFormData({ name: "", quantity: "", unit: "pcs" });
      setShowAddModal(false);
      setSuccessMessage("Item added to shopping list! 🛒");
      setShowSuccessModal(true);
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
      await sendShoppingListToEmail(email);
      setShowEmailModal(false);
      setSuccessMessage(`Shopping list sent to ${email}! 📧`);
      setShowSuccessModal(true);
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

      // Check if this is the future implementation placeholder
      if (result.orderId === "FUTURE_IMPLEMENTATION") {
        setSuccessMessage("🚧 This feature is under development.");
        setShowSuccessModal(true);
      } else {
        // Open Wolt order in new tab
        window.open(result.url, "_blank");
        setSuccessMessage("Order created! Check Wolt for details. 🚀");
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error("Create Wolt order error:", e);
      setError((e as Error).message ?? "Failed to create Wolt order");
    } finally {
      setSendingWolt(false);
    }
  };

  const handleClearAll = async () => {
    try {
      setShowClearAllModal(false);
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

  return {
    // State
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
    foodoraPosition,
    // Refs
    nameInputRef,
    emailInputRef,
    foodoraButtonRef,
    // Setters
    setShowAddModal,
    setError,
    setFormData,
    setEmail,
    setShowEmailModal,
    setShowSuccessModal,
    setShowClearAllModal,
    // Handlers
    handleRemoveItem,
    handleUpdateQuantity,
    handleAddItem,
    handleSendEmail,
    handleWoltOrder,
    handleClearAll,
    handleOpenClearConfirm: () => setShowClearAllModal(true),
    handleCancelClearConfirm: () => setShowClearAllModal(false),
  };
}
