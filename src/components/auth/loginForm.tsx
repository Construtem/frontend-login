"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import logo from "@/styles/images/logo_barra_superior.png";
import google_sign_in from "@/styles/images/logo_google.png";
import Swal from "sweetalert2";

const Login = () => {
  const [googleError, setGoogleError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setGoogleError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      if (!user.email) {
        setTimeout(() => {
          setLoading(false);
          setGoogleError("No se pudo obtener el correo del usuario.");
        }, 1800);
        return;
      }

      if (!user.email.endsWith('@utem.cl')) {
        setTimeout(() => {
          setLoading(false);
          setGoogleError("Solo se permiten correos institucionales @utem.cl");
        }, 1800);
        return;
      }

      // Si el correo es válido, se procede a enviar el token al backend
      if (user.email.endsWith('@utem.cl')) {
        const response = await fetch(`http://localhost:8080/auth/verify`, {  // OJO cambiar URL al backend real
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error('Error al verificar el token con el backend');
        }

        // OJO que este rol debe ser creado en la bdd porcia, ahora mismo no funcionará xd
        // Aqui el backend devuelve el rol del usuario
        const data = await response.json(); // { rol: 'vendedor' | 'administrador' | ... }

        if (data.rol === 'Vendedor') {

          Swal.fire({
            icon: "success",
            title: `¡Bienvenido, ${user.displayName || "usuario"}!`,
            text: "Inicio de sesión exitoso como Administrador.",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: "#ffffff",
            color: "#2e7d32",
            width: "700px",
            customClass: {
              popup: "fixed-alert-height",
            },
            didOpen: () => {
              const bar = document.querySelector<HTMLElement>(
                ".swal2-timer-progress-bar"
              );
              if (bar) bar.style.backgroundColor = "#2e7d32";
            },
          });
          setTimeout(() => {
            window.location.href = 'https://ventas.tssw.cl';
          }, 3000);
        } else if (data.rol === 'Administrador') {
          
          Swal.fire({
            icon: "success",
            title: `¡Bienvenido, ${user.displayName || "usuario"}!`,
            text: "Inicio de sesión exitoso como Administrador.",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            background: "#ffffff",
            color: "#2e7d32",
            width: "700px",
            customClass: {
              popup: "fixed-alert-height",
            },
            didOpen: () => {
              const bar = document.querySelector<HTMLElement>(
                ".swal2-timer-progress-bar"
              );
              if (bar) bar.style.backgroundColor = "#2e7d32";
            },
          });

          setTimeout(() => {
            window.location.href = 'https://inventario.tssw.cl';
          }, 3000);
        } else {
          setGoogleError("Tu rol no tiene acceso autorizado.");
          setLoading(false);
          return;
        }
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

      setTimeout(() => {
        Swal.fire({   //Este deberia ir en (if (data.rol === 'vendedor') { ... } else if (data.rol === 'administrador') { ... })
          icon: "success",
          title: "Inicio de sesión exitoso!",
          showConfirmButton: false,
          timer: 4800,
          timerProgressBar: true,
          background: "#ffffff",
          color: "#2e7d32",
          width: "700px",
          customClass: {
            popup: "fixed-alert-height",
          },
          didOpen: () => {
            const bar = document.querySelector<HTMLElement>(".swal2-timer-progress-bar");
            if (bar) bar.style.backgroundColor = "#2e7d32";
          },
        });

        setTimeout(() => {
          router.push("/maintenance");
        }, 5000);
      }, 1800);
    } catch (error: unknown) {
      setTimeout(() => {
        setLoading(false);

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
      }, 1800);
    }
  };

  useEffect(() => {
    if (googleError) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: googleError,
        showConfirmButton: false,
        timer: 4800,
        timerProgressBar: true,
        background: "#ffffff",
        color: "#b71c1c",
        width: "700px",
        customClass: {
          popup: "fixed-alert-height",
        },
        didOpen: () => {
          const bar = document.querySelector<HTMLElement>(".swal2-timer-progress-bar");
          if (bar) bar.style.backgroundColor = "#b71c1c";
        },
      });
    }
  }, [googleError]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .fixed-alert-height {
        height: 368px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .swal2-popup {
        display: flex !important;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      </div>
    );
  }

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
            <span style={{ marginLeft: "10px" }}>
              {loading ? "Autenticando..." : "Continuar con Google"}
            </span>
          </button>
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
    width: "780px",
    minHeight: "450px",
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
  spinner: {
    width: "48px",
    height: "48px",
    border: "6px solid #ccc",
    borderTop: "6px solid #444",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
    display: "block",
  },
};

export default Login;
