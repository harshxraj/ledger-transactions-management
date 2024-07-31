import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();
const apiUrl = "https://ledger-transactions-management-1.onrender.com";

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  console.log(ledgers);

  // Load auth data from local storage on mount
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    if (storedAuth) {
      setAuth(storedAuth);
    }
  }, []);

  // Save auth data to local storage whenever it changes
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // Fetch user data and ledgers when authenticated
  useEffect(() => {
    if (auth) {
      const fetchLedgers = async () => {
        try {
          const response = await axios.get(`${apiUrl}/ledger`, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          console.log(response.data);
          setLedgers(response.data);
        } catch (error) {
          console.error("Error fetching ledgers:", error);
        }
      };
      fetchLedgers();
    }
  }, [auth]);

  // Fetch transactions when a ledger is selected
  // useEffect(() => {
  //   if (selectedLedger) {
  //     const fetchTransactions = async () => {
  //       try {
  //         const response = await axios.get(`/transaction/${selectedLedger.id}`, {
  //           headers: { Authorization: `Bearer ${auth.token}` },
  //         });
  //         setTransactions(response.data);
  //       } catch (error) {
  //         console.error("Error fetching transactions:", error);
  //       }
  //     };
  //     fetchTransactions();
  //   }
  // }, [selectedLedger]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      setAuth(response.data);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  // Logout function
  const logout = () => {
    setAuth(null);
    setLedgers([]);
    setSelectedLedger(null);
    setTransactions([]);
  };

  // Select ledger function
  const selectLedger = (ledger) => {
    setSelectedLedger(ledger);
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        login,
        logout,
        ledgers,
        setLedgers,
        selectLedger,
        selectedLedger,
        transactions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using context
export const useAuth = () => {
  return useContext(AuthContext);
};
