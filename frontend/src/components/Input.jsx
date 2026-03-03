const Input = ({ label, id, type = 'text', register, error, ...rest }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} style={{ display: 'block', marginBottom: 6 }}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        {...(register || {})}
        {...rest}
        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
      />
      {error && <small style={{ color: '#c62828' }}>{error}</small>}
    </div>
  );
};

export default Input;
