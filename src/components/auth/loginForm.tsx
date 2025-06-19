"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import logo from "@/styles/images/logo_barra_superior.png";
import google_sign_in from "@/styles/images/logo_google.png";

const allowedEmail = "jriquelme@utem.cl";

const Login = () => {
  const [googleError, setGoogleError] = useState("");
  const [loading, setLoading] = useState(false); // para mostrar loadingLogin después de login
  const [fadeOut, setFadeOut] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setGoogleError("");
    setFadeOut(false);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        setGoogleError("No se pudo obtener el correo del usuario.");
        return;
      }

      if (user.email !== allowedEmail) {
        setGoogleError("Este correo no está registrado como usuario autorizado en el sistema.");
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL,
        })
      );

      // Aquí activamos el loading para mostrar la pantalla de loadingLogin integrada
      setLoading(true);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof (error as { code: string }).code === "string"
      ) {
        const code = (error as { code: string }).code;

        if (code === "auth/popup-closed-by-user") {
          setGoogleError("El inicio de sesión fue cancelado.");
        } else {
          setGoogleError("Error al iniciar sesión con Google.");
        }
      } else {
        setGoogleError("Ocurrió un error inesperado.");
      }

      console.error("Error en Google Login:", error);
    }
  };

  // Animación fadeOut y redirección cuando loading es true
  useEffect(() => {
    let redirectTimer: ReturnType<typeof setTimeout>;
    let fadeTimer: ReturnType<typeof setTimeout>;

    if (loading) {
      fadeTimer = setTimeout(() => setFadeOut(true), 3000);
      redirectTimer = setTimeout(() => {
        router.push("/admin/inicio");
      }, 10000);
    }

    return () => {
      clearTimeout(redirectTimer);
      clearTimeout(fadeTimer);
    };
  }, [loading, router]);

  // FadeOut para errores
  useEffect(() => {
    if (googleError) {
      setFadeOut(false);
      const fadeTimer = setTimeout(() => setFadeOut(true), 3000);
      const clearTimer = setTimeout(() => setGoogleError(""), 5000);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [googleError]);

  // Inyectar CSS para animación spinner
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Si loading true, mostramos pantalla de carga integrada
  if (loading) {
    return (
      <div style={styles.pageBackground}>
        <div style={styles.loginWrapper}>
          <div style={styles.loginBox}>
            <div style={styles.spinner}></div>
          </div>
          <div style={styles.logoBox}>
            <Image src={logo} alt="Ferretería UTEM" style={styles.logo} />
          </div>
        </div>

        <div
          style={{
            ...styles.successMessageBox,
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 0.8s ease-in-out",
          }}
        >
          <span style={styles.successIcon}>✔</span>
          <span style={styles.successText}>¡Inicio de sesión exitoso!</span>
        </div>
      </div>
    );
  }

  // Si no loading, mostramos el login form normal
  return (
    <div style={styles.pageBackground}>
      <div style={styles.loginWrapper}>
        <div style={styles.loginBox}>
          <h2 style={styles.title}>Accede al sistema de gestión</h2>
          <p style={{ fontSize: "16px", textAlign: "center", color: "#444", marginBottom: "20px" }}>
            Ingresa con tu correo electronico asociado como administrador, vendedor o usuario para acceder a nuestro sistema.
          </p>

          <button
            type="button"
            style={styles.googleButton}
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Image
              src={google_sign_in}
              alt="Continuar con Google"
              style={styles.googleIcon}
              width={24}
              height={24}
            />
            <span style={{ marginLeft: "10px" }}>{loading ? "Autenticando..." : "Continuar con Google"}</span>
          </button>

          {googleError && (
            <p
              style={{
                ...styles.fadeOutMessage,
                ...(fadeOut ? styles.hiddenMessage : {}),
                color: "red",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              {googleError}
            </p>
          )}
        </div>

        <div style={styles.logoBox}>
          <Image src={logo} alt="Ferretería UTEM" style={styles.logo} />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    background: "#e6e0e0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  loginWrapper: {
  display: "flex",
  flexDirection: "row",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
  borderRadius: "10px",
  width: "780px",       // ancho fijo suma de loginBox + logoBox
  minHeight: "450px",   // altura mínima, ajusta según el contenido
},
  loginBox: {
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "390px",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
    fontFamily: '"Montserrat", sans-serif',
  },
  googleButton: {
    marginTop: "10px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    background: "#fff",
    color: "#444",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  googleIcon: {
    display: "inline-block",
    verticalAlign: "middle",
  },
  logoBox: {
    backgroundColor: "#f1f1f1",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "390px",
  },
  logo: {
    maxWidth: "100%",
    maxHeight: "350px",
    objectFit: "contain",
    height: "auto",
    width: "auto",
  },
  fadeOutMessage: {
    opacity: 1,
    transition: "opacity 0.8s ease-in-out",
  },
  hiddenMessage: {
    opacity: 0,
  },

  // Loading styles
  spinner: {
  width: "48px",
  height: "48px",
  border: "6px solid #ccc",
  borderTop: "6px solid #444",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto", // <-- esto centra horizontalmente
  display: "block", // para que margin auto funcione bien en bloque
  },
  successMessageBox: {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "#e6f8e6",
    border: "1px solid #4caf50",
    color: "#2e7d32",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    fontWeight: 500,
    fontFamily: '"Montserrat", sans-serif',
  },
  successIcon: {
    fontSize: "20px",
    marginRight: "8px",
  },
  successText: {
    fontSize: "16px",
  },
};

export default Login;
