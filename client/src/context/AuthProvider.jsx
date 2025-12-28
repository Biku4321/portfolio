// // src/context/AuthProvider.jsx
// import { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import { AuthContext } from "./AuthContext";

// const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => localStorage.getItem("token"));

//   const login = (newToken, navigate) => {
//     localStorage.setItem("token", newToken);
//     setToken(newToken);
//     if (navigate) navigate("/admin/dashboard");
//   };

//   const logout = (navigate) => {
//     localStorage.removeItem("token");
//     setToken(null);
//     if (navigate) navigate("/admin/login");
//   };

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       try {
//         const decoded = jwtDecode(storedToken);
//         if (decoded.exp * 1000 < Date.now()) {
//           logout();
//         } else {
//           setToken(storedToken);
//         }
//       } catch {
//         logout();
//       }
//     }
//     console.log(
//       "Token loaded from localStorage:",
//       localStorage.getItem("token")
//     );
//   }, []);

//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
