import { Spinner as BootstrapSpinner } from 'react-bootstrap';

const Spinner = ({ message = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center my-5">
      <BootstrapSpinner
        animation="border"
        variant="primary"
        role="status"
        style={{ width: '3rem', height: '3rem' }}
      >
        <span className="visually-hidden">{message}</span>
      </BootstrapSpinner>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

export default Spinner;