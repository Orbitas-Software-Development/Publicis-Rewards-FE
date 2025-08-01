import AppRouter from './routes/AppRouter';
import { AuthProvider } from './contexts/AuthContext'; 
import { EmployeeProvider } from './contexts/EmployeeContext';
import { UserProvider } from './contexts/UserContext';
import { BadgeCategoryProvider } from './contexts/BadgeCategoryContext';
import { PrizeProvider } from './contexts/PrizeContext';
import { BadgeAssignmentProvider } from './contexts/BadgeAssignmentContext';
import { RedemptionProvider } from './contexts/RedemptionContext';

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <UserProvider>
          <BadgeCategoryProvider>
            <PrizeProvider>
               <BadgeAssignmentProvider>
                  <RedemptionProvider>
                    <AppRouter />
                  </RedemptionProvider>  
              </BadgeAssignmentProvider>
            </PrizeProvider>
          </BadgeCategoryProvider>
        </UserProvider>
      </EmployeeProvider>       
    </AuthProvider>
      
  );
}

export default App;
