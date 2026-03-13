export default function LoaderButton({ loading, text }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition duration-300 font-semibold text-white flex justify-center items-center"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        text
      )}
    </button>
  );
}
