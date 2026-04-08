"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistor, { store } from "../redux/store";
import { CheckSquare } from "lucide-react";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center animate-bounce shadow-xl shadow-indigo-100 dark:shadow-none">
              <CheckSquare className="text-white w-10 h-10" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <h2 className="text-2xl font-black tracking-tighter">TMS</h2>
              <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 animate-progress origin-left" />
              </div>
            </div>
          </div>
        } 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
