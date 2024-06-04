"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { create } from "./server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Row, Col } from "react-bootstrap";
import { signIn } from "next-auth/react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default async function Register() {
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const response = await create(formData);
      if (response.status == 0) {
        toast.error(response.response);
      }
      else{
        toast.success(response.response)
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/auth/testAuth" });
  };
  return (
    <main>
      <Header />
      <Container
        fluid
        style={{
          backgroundImage:
            'url("https://scontent.fhan3-2.fna.fbcdn.net/v/t1.15752-9/436421699_1612300562942126_2734689648388013401_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFGhc1C5OPqArCOal9mBDFfcVbI3Nr8HopxVsjc2vweimdphGNDEw601zbnCk9IN88HfSUkECClTkoMvCcPNm6l&_nc_ohc=2VqeA9lMY0MQ7kNvgGM8OSX&_nc_ht=scontent.fhan3-2.fna&oh=03_Q7cD1QF1l9oqQ0z0zLLZgL6SM3YCZZk_O3I1hW3E32cwDxs4eg&oe=668379E8")', // Replace with your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Row
          className="justify-content-center"
          style={{ paddingTop: "50px", paddingBottom: "150px" }}
        >
          <Col xs={12} md={8} lg={4}>
            <div className={styles["form-container"]}>
              <h2 className={styles["title"]}>Welcome back!</h2>
              <p style={{ fontSize: "0.9rem" }} className="">
                Already have an account?{" "}
                <a href="/auth/register" style={{ textDecoration: "none" }}>
                  <span style={{ color: "#ED154C" }}>Login here</span>
                </a>
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  controlId="formEmail"
                  className={styles["form-group-margin"]}
                >
                  <Form.Control
                    className={styles["form-control-custom"]}
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    required
                  />
                </Form.Group>

                <Form.Group
                  controlId="formUsername"
                  className={styles["form-group-margin"]}
                >
                  <Form.Control
                    className={styles["form-control-custom"]}
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    required
                  />
                </Form.Group>

                <Form.Group
                  controlId="formPassword"
                  className={styles["form-group-margin"]}
                >
                  <Form.Control
                    className={styles["form-control-custom"]}
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                  />
                </Form.Group>

                <Form.Group
                  controlId="formRePassword"
                  className={styles["form-group-margin"]}
                >
                  <Form.Control
                    className={styles["form-control-custom"]}
                    type="password"
                    name="re-password"
                    placeholder="Re-enter Password"
                    required
                  />
                </Form.Group>

                <Button variant="danger" type="submit" className="w-100 mt-1">
                  Sign Up
                </Button>
              </Form>
              <div className={styles["social-signup-container"]}>
                <hr className={styles["left-line"]} />
                <span className={styles["social-signup-text"]}>
                  Social Signup
                </span>
                <hr className={styles["right-line"]} />
              </div>
              <Button
                className={`${styles["login_with_google"]} w-100 mt-2`}
                onClick={handleGoogleSignIn}
              >
                <img
                  src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" // Update this path to your logo location
                  alt="Google logo"
                  className={styles["google-logo"]}
                />
                Sign Up with Google
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <ToastContainer />
    </main>
  );
}
