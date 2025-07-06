import AppRouter from './routes/AppRouter';
import { AuthProvider } from './contexts/AuthContext'; 
import { EmployeeProvider } from './contexts/EmployeeContext';

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <AppRouter />
      </EmployeeProvider>
    </AuthProvider>
      
  );
}

export default App;
