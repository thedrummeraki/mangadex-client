import { APIProvider, AuthProvider, RootProvider } from "config/providers";
import { AppRouter } from "routes";

function App() {
  return (
    <RootProvider>
      <APIProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </APIProvider>
    </RootProvider>
  );
}

export default App;
