import AppRouter from './routes/AppRouter';
import { AuthProvider } from './contexts/AuthContext'; 
import { EmployeeProvider } from './contexts/EmployeeContext';
import { UserProvider } from './contexts/UserContext';
import { BadgeCategoryProvider } from './contexts/BadgeCategoryContext';
import { PrizeProvider } from './contexts/PrizeContext';

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <UserProvider>
          <BadgeCategoryProvider>
            <PrizeProvider>
              <AppRouter />
            </PrizeProvider>
          </BadgeCategoryProvider>
        </UserProvider>
      </EmployeeProvider>       
    </AuthProvider>
      
  );
}

export default App;
