"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import logo from "@/styles/images/logo_barra_superior.png";
import google_sign_in from "@/styles/images/logo_google.png";
import Swal from "sweetalert2";

const Login = () => {
  const [googleError, setGoogleError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiLoginUrl = process.env.NEXT_PUBLIC_API_LOGIN || "https://api-login.tssw.cl";
  const frontInventarioUrl = process.env.NEXT_PUBLIC_FRONT_INVENTARIO || "https://inventario.tssw.cl";
  const frontVentasUrl = process.env.NEXT_PUBLIC_FRONT_VENTAS || "https://ventas.tssw.cl";
  console.log('Front Facturacion URL:', process.env.NEXT_PUBLIC_FRONT_FACTURACION);

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
        const response = await fetch(`${apiLoginUrl}/auth/verify`, {  // OJO cambiar URL al backend real
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
          // Redirigir a la URL de ventas con el token, No funcionó con localstorage ya que no es mismo dominio en local
          const URLventas = `${frontVentasUrl}/auth/callback?token=${token}`;
          // Front inventario recibe url con token para enviarlo al backend        
          Swal.fire({
            icon: "success",
            title: `<b style='color: #000000'>¡Bienvenido, ${user.displayName || "usuario"}!</b>`,
            html: "<span style='color: #000000'>Inicio de sesión exitoso como Vendedor.</span>",
            showConfirmButton: false,
            timer: 3000,
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
            window.location.href = URLventas;  // Redirigir a ventas con el token
          }, 1000);
        } else if (data.rol === 'Administrador') {
          // Redirigir a la URL de ventas con el token, No funcionó con localstorage ya que no es mismo dominio en local
          const URLinventario = `${frontInventarioUrl}/auth/callback?token=${token}`;
          // Front inventario recibe url con token para enviarlo al backend
          Swal.fire({
            icon: "success",
            title: `<b style='color: #000000'>¡Bienvenido, ${user.displayName || "usuario"}!</b>`,
            html: "<span style='color: #000000'>Inicio de sesión exitoso como Administrador.</span>",
            showConfirmButton: false,
            timer: 3000,
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
            window.location.href = URLinventario;  // Redirigir al inventario con el tokem
          }, 1000);
        } else if (data.rol === 'Superadmin') {
              Swal.fire({
                icon: "question",
                title: `<strong style='color: #000000'>¡Bienvenido, ${user.displayName || "usuario"}!</strong>`,
                html: "<span style='color: #000000; font-size: 1.4rem'>¿A qué sistema deseas ingresar?</span>",
                showCancelButton: true,
                confirmButtonText: "Inventario",
                cancelButtonText: "Ventas",
                background: "#ffffff",
                color: "#2e7d32",
                width: "700px",
                customClass: {
                  popup: "fixed-alert-height",
                  confirmButton: "swal-confirm-btn",
                  cancelButton: "swal-cancel-btn",
                },
                didOpen: () => {
                  /* const bar = document.querySelector<HTMLElement>(
                    ".swal2-timer-progress-bar"
                  );
                  if (bar) bar.style.backgroundColor = "#2e7d32"; */
                  const confirmBtn = Swal.getConfirmButton();
                  const cancelBtn = Swal.getCancelButton();
                  const icon = document.querySelector<HTMLElement>('.swal2-icon');

                  if (confirmBtn) {
                    confirmBtn.style.backgroundColor = "#0149ad";
                    confirmBtn.style.color = "white";
                    confirmBtn.style.transition = "background-color 0.3s ease";
                    confirmBtn.onmouseenter = () => {
                      confirmBtn.style.backgroundColor = "#00265C"; // Cambiar color al pasar el mouse
                    };
                    confirmBtn.onmouseleave = () => {
                      confirmBtn.style.backgroundColor = "#0149ad";
                    };
                  }
                
                  if (cancelBtn) {
                    cancelBtn.style.backgroundColor = "#0149ad";
                    cancelBtn.style.color = "white";
                    cancelBtn.style.transition = "background-color 0.3s ease";
                    cancelBtn.onmouseenter = () => {
                      cancelBtn.style.backgroundColor = "#00265C"; // Cambiar color al pasar el mouse
                    };
                    cancelBtn.onmouseleave = () => {
                      cancelBtn.style.backgroundColor = "#0149ad";
                    };
                  }
                
                  if (icon) {
                    icon.style.color = "#1565c0"; // Cambiar color del ícono (logo)
                  }
                },
              }).then((result) => {
                if (result.isConfirmed) {   //Superadmin ingresa como administrador
                  const URLinventario = `${frontInventarioUrl}/auth/callback?token=${token}`;
                  // Front inventario recibe url con token para enviarlo al backend
                  Swal.fire({
                    icon: "success",
                    title: `<b style='color: #000000'>¡Ingresando al sistema de Inventario!</b>`,
                    showConfirmButton: false,
                    timer: 2000,
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
                    window.location.href = URLinventario;  // Redirigir al inventario con el tokem
                  }, 1000);
                } else if (result.dismiss === Swal.DismissReason.cancel) {  //Superadmin ingresa como vendedor
                  // Redirigir a la URL de ventas con el token, No funcionó con localstorage ya que no es mismo dominio en local
                  const URLventas = `${frontVentasUrl}/auth/callback?token=${token}`;
                  // Front inventario recibe url con token para enviarlo al backend        
                  Swal.fire({
                    icon: "success",
                    title: `<b style='color: #000000'>¡Ingresando al sistema de Ventas!</b>`,
                    showConfirmButton: false,
                    timer: 2000,
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
                    window.location.href = URLventas;  // Redirigir a ventas con el token
                  }, 1000);
                } else if (Swal.DismissReason.backdrop){
                  Swal.fire({
                    icon: "error",
                    title: "<span style='color: #000000'>Operación cancelada</span>",
                    html: "<span style='color: #000000'>No se ha seleccionado ningún sistema.</span>",
                    showConfirmButton: true,
                    background: "#ffffff",
                    color: "#d32f2f",
                    confirmButtonColor: "#d32f2f"
                  });
                  setLoading(false);
                }
              });
        } else {
          setGoogleError("Tu usuario no tiene acceso autorizado.");
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

      // Mensaje de exito de sesión exitoso
      /*setTimeout(() => {
        Swal.fire({ 
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
      }, 1800);*/
    } catch (error: unknown) {
      //setTimeout(() => {
        setLoading(false);
        console.error("Error during Google login:", error);
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
      //}, 1000);
    }
  };

  // Esto va vinculado a lo que se comentó arriba, no se usa
  useEffect(() => {
    if (googleError) {
      Swal.fire({
        icon: "error",
        title: "<span style='color: #000000'>Oops...</span>",
        text: googleError,
        showConfirmButton: false,
        timer: 2000,
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
            <Image src={logo} alt="Construtem" style={styles.logo} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageBackground}>
      <div style={styles.loginWrapper}>
        <div style={styles.loginBox}>
          <h2 style={styles.title}>Accede al sistema Construtem</h2>
          <p style={{ fontSize: "16px", textAlign: "center", color: "#444", marginBottom: "20px" }}>
            Ingresa con tu correo electronico institucional para acceder al sistema correspondiente a tu rol de Construtem.
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
