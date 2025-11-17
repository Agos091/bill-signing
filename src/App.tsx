  import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Documents } from './pages/Documents';
import { DocumentDetails } from './pages/DocumentDetails';
import { EditDocument } from './pages/EditDocument';
import { CreateDocument } from './pages/CreateDocument';
import { Settings } from './pages/Settings';
import { AIAssistant } from './pages/AIAssistant';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/documents/:id" element={<DocumentDetails />} />
            <Route path="/documents/:id/edit" element={<EditDocument />} />
            <Route path="/create" element={<CreateDocument />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--tw-bg-white, #fff)',
              color: 'var(--tw-text-gray-900, #111827)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;