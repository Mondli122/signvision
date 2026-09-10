// Global Toast Notification Dispatcher & Hook
const TOAST_EVENT = 'signvision_show_toast';

export const toast = {
  success: (message, title = 'Success') => {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, {
      detail: { type: 'success', title, message, id: Date.now() + Math.random() }
    }));
  },
  error: (message, title = 'Error') => {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, {
      detail: { type: 'error', title, message, id: Date.now() + Math.random() }
    }));
  },
  info: (message, title = 'Info') => {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, {
      detail: { type: 'info', title, message, id: Date.now() + Math.random() }
    }));
  },
  warning: (message, title = 'Attention') => {
    window.dispatchEvent(new CustomEvent(TOAST_EVENT, {
      detail: { type: 'warning', title, message, id: Date.now() + Math.random() }
    }));
  }
};
