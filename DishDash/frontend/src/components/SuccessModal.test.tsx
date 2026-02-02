import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SuccessModal } from "./SuccessModal";

// ========================================================================
// Clean up after each test
// ========================================================================
afterEach(() => {
  cleanup();
});

// ========================================================================
// Helper function to render SuccessModal with default props
// ========================================================================
const renderSuccessModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    message: "Test message",
    ...props,
  };
  return {
    ...render(<SuccessModal {...defaultProps} />),
    props: defaultProps,
  };
};

describe("SuccessModal Component", () => {
  // ======================================================================
  // Rendering Tests - Verify modal displays correctly
  // ======================================================================
  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      // Test that modal is hidden when isOpen=false
      render(
        <SuccessModal
          isOpen={false}
          onClose={vi.fn()}
          message="Test message"
        />
      );

      expect(screen.queryByText("Test message")).not.toBeInTheDocument();
    });

    it("should render when isOpen is true", () => {
      // Test that modal appears when isOpen=true
      renderSuccessModal();

      expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    it("should display the provided message", () => {
      // Test that custom message is displayed correctly
      const customMessage = "Operation completed successfully!";
      renderSuccessModal({ message: customMessage });

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it("should display default success title when no title provided", () => {
      // Test default title for success type
      renderSuccessModal();

      expect(screen.getByText("Success!")).toBeInTheDocument();
    });

    it("should display custom title when provided", () => {
      // Test that custom title overrides default
      const customTitle = "Congratulations!";
      renderSuccessModal({ title: customTitle });

      expect(screen.getByText(customTitle)).toBeInTheDocument();
    });

    it("should display default button text 'OK'", () => {
      // Test default button text
      renderSuccessModal();

      expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    });

    it("should display custom button text when provided", () => {
      // Test custom button text
      const customButtonText = "Close";
      renderSuccessModal({ buttonText: customButtonText });

      expect(
        screen.getByRole("button", { name: customButtonText })
      ).toBeInTheDocument();
    });
  });

  // ======================================================================
  // Success Type Tests - Verify success modal appearance
  // ======================================================================
  describe("Success Type", () => {
    it("should display checkmark icon for success type", () => {
      // Test that success modal shows checkmark (✓)
      renderSuccessModal({ type: "success" });

      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("should display default 'Success!' title for success type", () => {
      // Test default success title
      renderSuccessModal({ type: "success" });

      expect(screen.getByText("Success!")).toBeInTheDocument();
    });

    it("should have green background for success icon", () => {
      // Test that success icon has green background color
      renderSuccessModal({ type: "success" });
      const icon = screen.getByText("✓");

      // Check if icon itself has success styling (it's the styled div)
      expect(icon).toHaveStyle({
        background: "#22c55e",
      });
    });
  });

  // ======================================================================
  // Error Type Tests - Verify error modal appearance
  // ======================================================================
  describe("Error Type", () => {
    it("should display X icon for error type", () => {
      // Test that error modal shows X mark (✕)
      renderSuccessModal({ type: "error" });

      expect(screen.getByText("✕")).toBeInTheDocument();
    });

    it("should display default 'Error' title for error type", () => {
      // Test default error title
      renderSuccessModal({ type: "error" });

      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("should have red background for error icon", () => {
      // Test that error icon has red background color
      renderSuccessModal({ type: "error" });
      const icon = screen.getByText("✕");

      // Check if icon itself has error styling (it's the styled div)
      expect(icon).toHaveStyle({
        background: "#ef4444",
      });
    });

    it("should display custom title with error type", () => {
      // Test custom title works with error type
      const customTitle = "Oops!";
      renderSuccessModal({ type: "error", title: customTitle });

      expect(screen.getByText(customTitle)).toBeInTheDocument();
      expect(screen.queryByText("Error")).not.toBeInTheDocument();
    });
  });

  // ======================================================================
  // Interaction Tests - Verify user interactions work correctly
  // ======================================================================
  describe("User Interactions", () => {
    it("should call onClose when button is clicked", () => {
      // Test that clicking OK button triggers onClose callback
      const { props } = renderSuccessModal();
      const button = screen.getByRole("button", { name: "OK" });

      fireEvent.click(button);

      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when overlay is clicked", () => {
      // Test that clicking outside modal (overlay) triggers onClose
      const { props, container } = renderSuccessModal();
      const overlay = container.firstChild as HTMLElement;

      fireEvent.click(overlay);

      expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it("should not call onClose when modal content is clicked", () => {
      // Test that clicking inside modal content doesn't close it
      const { props } = renderSuccessModal();
      const message = screen.getByText("Test message");

      fireEvent.click(message);

      expect(props.onClose).not.toHaveBeenCalled();
    });

    it("should not call onClose when title is clicked", () => {
      // Test clicking on title doesn't close modal
      const { props } = renderSuccessModal();
      const title = screen.getByText("Success!");

      fireEvent.click(title);

      expect(props.onClose).not.toHaveBeenCalled();
    });

    it("should not call onClose when icon is clicked", () => {
      // Test clicking on icon doesn't close modal
      const { props } = renderSuccessModal();
      const icon = screen.getByText("✓");

      fireEvent.click(icon);

      expect(props.onClose).not.toHaveBeenCalled();
    });
  });

  // ======================================================================
  // Accessibility Tests - Verify modal is accessible
  // ======================================================================
  describe("Accessibility", () => {
    it("should have a button with accessible role", () => {
      // Test that button has proper role
      renderSuccessModal();

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have button with correct text for screen readers", () => {
      // Test button text is accessible
      renderSuccessModal({ buttonText: "Dismiss" });

      expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("should display message text for screen readers", () => {
      // Test that message is readable by screen readers
      const message = "Your data has been saved successfully!";
      renderSuccessModal({ message });

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it("should display title text for screen readers", () => {
      // Test that title is readable by screen readers
      const title = "Action Complete";
      renderSuccessModal({ title });

      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  // ======================================================================
  // Props Combination Tests - Verify different prop combinations work
  // ======================================================================
  describe("Props Combinations", () => {
    it("should work with all custom props for success type", () => {
      // Test success modal with all custom props
      const props = {
        type: "success" as const,
        title: "Great Job!",
        message: "Your recipe has been saved.",
        buttonText: "Continue",
      };
      renderSuccessModal(props);

      expect(screen.getByText(props.title)).toBeInTheDocument();
      expect(screen.getByText(props.message)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: props.buttonText })).toBeInTheDocument();
      expect(screen.getByText("✓")).toBeInTheDocument();
    });

    it("should work with all custom props for error type", () => {
      // Test error modal with all custom props
      const props = {
        type: "error" as const,
        title: "Something Went Wrong",
        message: "Please try again later.",
        buttonText: "Retry",
      };
      renderSuccessModal(props);

      expect(screen.getByText(props.title)).toBeInTheDocument();
      expect(screen.getByText(props.message)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: props.buttonText })).toBeInTheDocument();
      expect(screen.getByText("✕")).toBeInTheDocument();
    });

    it("should work with minimal props", () => {
      // Test modal with only required props
      const onClose = vi.fn();
      render(
        <SuccessModal isOpen={true} onClose={onClose} message="Done!" />
      );

      expect(screen.getByText("Done!")).toBeInTheDocument();
      expect(screen.getByText("Success!")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    });
  });

  // ======================================================================
  // Re-render Tests - Verify modal updates correctly
  // ======================================================================
  describe("Re-rendering", () => {
    it("should update when message changes", () => {
      // Test that modal content updates when props change
      const { rerender } = render(
        <SuccessModal isOpen={true} onClose={vi.fn()} message="First message" />
      );

      expect(screen.getByText("First message")).toBeInTheDocument();

      rerender(
        <SuccessModal isOpen={true} onClose={vi.fn()} message="Second message" />
      );

      expect(screen.queryByText("First message")).not.toBeInTheDocument();
      expect(screen.getByText("Second message")).toBeInTheDocument();
    });

    it("should update when type changes from success to error", () => {
      // Test that icon and title update when type changes
      const { rerender } = render(
        <SuccessModal
          isOpen={true}
          onClose={vi.fn()}
          message="Test"
          type="success"
        />
      );

      expect(screen.getByText("✓")).toBeInTheDocument();
      expect(screen.getByText("Success!")).toBeInTheDocument();

      rerender(
        <SuccessModal
          isOpen={true}
          onClose={vi.fn()}
          message="Test"
          type="error"
        />
      );

      expect(screen.getByText("✕")).toBeInTheDocument();
      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.queryByText("✓")).not.toBeInTheDocument();
    });

    it("should hide when isOpen changes to false", () => {
      // Test that modal disappears when isOpen changes to false
      const { rerender } = render(
        <SuccessModal isOpen={true} onClose={vi.fn()} message="Test" />
      );

      expect(screen.getByText("Test")).toBeInTheDocument();

      rerender(
        <SuccessModal isOpen={false} onClose={vi.fn()} message="Test" />
      );

      expect(screen.queryByText("Test")).not.toBeInTheDocument();
    });
  });
});
