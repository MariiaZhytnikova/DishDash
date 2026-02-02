# SuccessModal Component

A reusable modal component for displaying success and error messages with a consistent design throughout the application.

## Features

- ✅ Success messages with green checkmark icon
- ❌ Error messages with red X icon
- 🎨 Consistent design matching the application theme
- 📱 Responsive and mobile-friendly
- ⌨️ Click outside to close
- 🎯 Customizable title, message, and button text

## Usage

### Success Modal

```tsx
import { useState } from "react";
import { SuccessModal } from "../components/SuccessModal";

function MyComponent() {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    // Perform some action
    setShowSuccess(true);
  };

  return (
    <>
      <button onClick={handleSuccess}>Do Something</button>
      
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Your action was completed successfully!"
      />
    </>
  );
}
```

### Error Modal

```tsx
import { useState } from "react";
import { SuccessModal } from "../components/SuccessModal";

function MyComponent() {
  const [showError, setShowError] = useState(false);

  const handleError = () => {
    try {
      // Perform some action that might fail
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <>
      <button onClick={handleError}>Do Something</button>
      
      <SuccessModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        type="error"
        message="Something went wrong. Please try again."
      />
    </>
  );
}
```

### Custom Title and Button Text

```tsx
<SuccessModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Congratulations!"
  message="You have successfully completed the recipe!"
  buttonText="Close"
/>
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `isOpen` | `boolean` | - | ✅ | Controls whether the modal is visible |
| `onClose` | `() => void` | - | ✅ | Callback function when modal is closed |
| `message` | `string` | - | ✅ | The main message to display |
| `title` | `string` | "Success!" or "Error" | ❌ | Custom title (auto-set based on type) |
| `buttonText` | `string` | "OK" | ❌ | Custom button text |
| `type` | `"success" \| "error"` | "success" | ❌ | Type of modal (changes icon and color) |

## Example: API Request with Success/Error Handling

```tsx
import { useState } from "react";
import { SuccessModal } from "../components/SuccessModal";
import { saveData } from "../api";

function DataForm() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await saveData(data);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to save:", error);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Data saved successfully!"
      />

      <SuccessModal
        isOpen={showError}
        onClose={() => setShowError(false)}
        type="error"
        message="Failed to save data. Please try again."
      />
    </>
  );
}
```

## Styling

The modal uses your application's CSS variables:
- `--color-primary` for button colors
- Success icon: `#22c55e` (green)
- Error icon: `#ef4444` (red)

The modal has a high z-index (`2000`) to ensure it appears above other content.

## Migration from alert()

Replace browser `alert()` calls with the `SuccessModal`:

### Before:
```tsx
alert("Success!");
alert("Error occurred");
```

### After:
```tsx
const [showModal, setShowModal] = useState(false);
const [modalType, setModalType] = useState<"success" | "error">("success");
const [modalMessage, setModalMessage] = useState("");

// For success
setModalType("success");
setModalMessage("Success!");
setShowModal(true);

// For error
setModalType("error");
setModalMessage("Error occurred");
setShowModal(true);

// In JSX:
<SuccessModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  type={modalType}
  message={modalMessage}
/>
```
