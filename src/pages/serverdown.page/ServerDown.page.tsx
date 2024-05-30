import { useEffect } from "react";
import { checkBackendServerIsRunning } from "../../components/global-components/privateRoute/PrivateRoute";
import { useNavigate } from "react-router-dom";

export default function ServerDownPage() {
  const navigate = useNavigate();
  useEffect(() => {
    async function isServerActive() {
      const res = await checkBackendServerIsRunning();
      if (res) navigate("/");
    }
    isServerActive();
  }, []);
  return (
    <div>
      <h1>Server is currently down and unavailable!</h1>
    </div>
  );
}
