// components/maintenance.tsx
"use client";

import Image from "next/image";
import logo from "@/styles/images/logo_barra_superior.png";

const Maintenance = () => {
  return (
    <div style={styles.container}>
      <Image src={logo} alt="Logo Ferretería UTEM" style={styles.logo} />
      <h1 style={styles.message}>Estamos trabajando para usted</h1>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  logo: {
    maxWidth: "60%",
    height: "auto",
    marginBottom: "40px",
  },
  message: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#444",
    fontFamily: '"Montserrat", sans-serif',
  },
};

export default Maintenance;
