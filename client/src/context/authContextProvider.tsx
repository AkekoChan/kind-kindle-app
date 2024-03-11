import { useCallback, useState } from "react";
import { AuthContext, AuthContextType } from "./authContext";
import { SignupBody } from "../interfaces/api-body/signup-body";
import { APIHandler } from "../utils/api/api-handler";
import { AuthResponse } from "../interfaces/api-response/auth-reponse";
import { useNavigate } from "react-router";
import { GenericResponse } from "../interfaces/api-response/generic-response";
import toast from "react-hot-toast";
import { User } from "../interfaces/user.interface";
import { SigninBody } from "../interfaces/api-body/signin-body";

interface AuthContextProviderInterface {
  children: React.ReactNode;
}

export const AuthContextProvider = ({
  children,
}: AuthContextProviderInterface) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<Omit<User, "created_at">>();

  const navigate = useNavigate();

  const signin = useCallback(
    (body: SigninBody) => {
      APIHandler<AuthResponse>("/auth/signin", false, "post", body).then(
        (res) => {
          setToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          toast.success(res.data.message, {
            style: {
              background: "#3D3D3D",
              color: "#FAFAFA",
              borderRadius: "12px",
            },
          });
          navigate("/");
        }
      );
    },
    [navigate]
  );

  const signout = () => {
    localStorage.clear();
    setUser(undefined);
    setToken(null);
    navigate("/sign-in");
  };

  const signup = async (body: SignupBody) => {
    APIHandler<AuthResponse>("/auth/signup", false, "post", body).then(
      (res) => {
        setToken(res.data.token);
        navigate("/otp");
        APIHandler<GenericResponse>("/auth/send-otp", false, "post", body).then(
          (res) => {
            setUser({
              name: body.name,
              email: body.email,
            });
            toast.success(res.data.message, {
              style: {
                background: "#3D3D3D",
                color: "#FAFAFA",
                borderRadius: "12px",
              },
            });
          }
        );
      }
    );
  };

  const authContextValue: AuthContextType = {
    signin,
    signout,
    signup,
    token,
    user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
