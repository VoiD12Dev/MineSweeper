const BotonNivel = ({ level, className, texto, setLevel }) => {
  return (
    <button className={`btn ${className}`} onClick={() => setLevel(level)}>
      {texto}
    </button>
  );
};

export default BotonNivel;
