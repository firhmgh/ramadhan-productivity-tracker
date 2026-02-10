import { createBrowserRouter } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { DashboardLayout } from "./pages/DashboardLayout";
import { HomePage } from "./pages/HomePage";
import { DailyTrackerPage } from "./pages/DailyTrackerPage";
import { PuasaTrackerPage } from "./pages/PuasaTrackerPage";
import { ZakatPage } from "./pages/ZakatPage";
import { CalendarPage } from "./pages/CalendarPage";
import { AgendaPage } from "./pages/AgendaPage";
import { TargetsPage } from "./pages/TargetsPage";
import { ProfilePage } from "./pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "daily", Component: DailyTrackerPage },
      { path: "puasa", Component: PuasaTrackerPage },
      { path: "zakat", Component: ZakatPage },
      { path: "calendar", Component: CalendarPage },
      { path: "agenda", Component: AgendaPage },
      { path: "targets", Component: TargetsPage },
      { path: "profile", Component: ProfilePage },
    ],
  },
]);
