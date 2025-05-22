
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-md w-full text-center space-y-6 backdrop-blur-sm bg-white/5 p-8 rounded-xl border border-border/30 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="text-9xl font-bold bg-gradient-to-r from-darkblue-600 to-darkyellow-500 bg-clip-text text-transparent">404</div>
          <h1 className="text-2xl font-bold mt-4">Page not found</h1>
          <p className="text-muted-foreground mt-2">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="group" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          
          <Button 
            className="bg-gradient-primary"
            onClick={() => navigate("/")}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
