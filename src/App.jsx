import { AppProvider, useApp } from "./store.jsx";
import { LangProvider } from "./lang.jsx";
import { FormView } from "./components/FormView.jsx";
import { Home } from "./components/Home.jsx";
import { LeadDetail } from "./components/LeadDetail.jsx";
import { LeadsPage } from "./components/LeadsPage.jsx";
import { IdleOverlay, Toast } from "./components/Overlays.jsx";
import { PinGate } from "./components/PinGate.jsx";
import { Success } from "./components/Success.jsx";

const SCREENS = { home: Home, form: FormView, success: Success, pin: PinGate, leads: LeadsPage, lead: LeadDetail };

function Screen() {
  const { view } = useApp();
  const Current = SCREENS[view] || Home;
  return <Current />;
}

export default function App() {
  return (
    <LangProvider>
      <AppProvider>
        <Screen />
        <Toast />
        <IdleOverlay />
      </AppProvider>
    </LangProvider>
  );
}
