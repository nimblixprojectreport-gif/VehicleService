const Button = ({ children, type = 'button', disabled = false, onClick }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 14px',
        border: 'none',
        borderRadius: 8,
        backgroundColor: disabled ? '#9e9e9e' : '#1f2937',
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
};

export default Button;
