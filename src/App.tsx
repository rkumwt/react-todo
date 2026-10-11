import { TodoProvider } from "./contexts/TodoContext";
import MainLayout from "./layouts/MainLayout";
import TodoPage from "./pages/TodoPage";

export default function App() {
  return (
    <TodoProvider>
      <MainLayout>
        <TodoPage />
      </MainLayout>
    </TodoProvider>
  );
}
