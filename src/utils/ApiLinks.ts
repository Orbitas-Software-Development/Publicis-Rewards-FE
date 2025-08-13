let API_URL = '';

const env = import.meta.env.MODE;

switch (env) {
  case 'development':
    API_URL = 'https://localhost:7156/api';
    break;
  case 'production':
    API_URL = 'https://publicis-rewards-be.onrender.com/api';
    break;
  case 'testing':
    API_URL = 'https://alienrealty-backend-e9f2c9grecgjcjbz.centralus-01.azurewebsites.net/api';
    break;
  default:
    API_URL = 'https://localhost:5001/api';
}

export { API_URL };
