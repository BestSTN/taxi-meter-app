function Modal({ open, content, close, price }) {
  return (
    <>
      {open && (
        <div
          className="fixed top-0 bottom-0 left-0 right-0 bg-black/50 flex items-center justify-center z-50"
          onClick={close}
        >
          <div
            className="flex flex-col gap-3 bg-slate-200 p-8 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl font-bold">PRICE (baht)</div>
            <div className="text-8xl font-bold text-red-500">
              {parseFloat(price).toFixed(2)}
            </div>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 border border-red-700 rounded"
              onClick={close}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
