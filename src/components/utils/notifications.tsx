import toast from "react-hot-toast";

// Success
export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    duration: 3000,
  });
};

//  Error
export const showError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    duration: 3000,

  });
};

//  Confirm
export const showConfirm = (
  message: string,
  onConfirm: () => void
) => {
  toast((t) => (
    <div className="flex flex-col gap-3">
      <p className="text-sm">{message}</p>

      <div className="flex justify-end gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-300 text-black"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>

        <button
          className="px-3 py-1 rounded bg-red-500 text-white"
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ));
};
