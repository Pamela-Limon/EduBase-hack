import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import Courses from "@/pages/courses";
import Students from "@/pages/students";
import Attestations from "@/pages/attestations";
import CourseDetail from "@/pages/course-detail";
import StudentDetail from "@/pages/student-detail";
import SubmitWork from "@/pages/submit-work";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cursos" component={Courses} />
      <Route path="/cursos/:id" component={CourseDetail} />
      <Route path="/alumnos" component={Students} />
      <Route path="/alumnos/:id" component={StudentDetail} />
      <Route path="/certificaciones" component={Attestations} />
      <Route path="/enviar-trabajo" component={SubmitWork} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
}

export default App;
