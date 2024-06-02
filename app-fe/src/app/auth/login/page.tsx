"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Row, Col } from "react-bootstrap";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default async function Login() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    console.log({ response });
    if (!response?.error) {
      console.log("vailon success");
      router.push("/auth/testAuth");
    }
  };
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/auth/testAuth" });
  };

  return (
    <main>
      <Header />
      <Container fluid
        style={{
          backgroundImage: 'url("https://scontent.fhan3-2.fna.fbcdn.net/v/t1.15752-9/436421699_1612300562942126_2734689648388013401_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFGhc1C5OPqArCOal9mBDFfcVbI3Nr8HopxVsjc2vweimdphGNDEw601zbnCk9IN88HfSUkECClTkoMvCcPNm6l&_nc_ohc=2VqeA9lMY0MQ7kNvgGM8OSX&_nc_ht=scontent.fhan3-2.fna&oh=03_Q7cD1QF1l9oqQ0z0zLLZgL6SM3YCZZk_O3I1hW3E32cwDxs4eg&oe=668379E8")', // Replace with your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Row className="justify-content-center" style={{paddingTop:"50px", paddingBottom:"150px"}}>
          <Col xs={12} md={8} lg={4}>
            <div className={styles["form-container"]}>
              <h2 className={styles["title"]}>Welcome back!</h2>
              <p style={{ fontSize: "0.9rem" }} className="">
                Don't have an account?{" "}
                <a href="/auth/register" style={{ textDecoration: "none" }}>
                  <span style={{ color: "#ED154C" }}>
                    Create a new account now
                  </span>
                </a>
              </p>
              <p style={{ fontSize: "0.9rem" }} className="">
                It's FREE! Take less than a minute
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
                    placeholder="Email"
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

                <Button variant="danger" type="submit" className="w-100 mt-1">
                  Login
                </Button>
                <Button
                  className={`${styles["login_with_google"]} w-100 mt-2`}
                  onClick={handleGoogleSignIn}
                >
                  <img
                    src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" // Update this path to your logo location
                    alt="Google logo"
                    className={styles["google-logo"]}
                  />
                  Login with Google
                </Button>
                <p style={{ fontSize: "0.9rem", textAlign: "center"}} className="mt-3">
                  Forget Password?{" "}
                  <a href="/auth/register" style={{ textDecoration: "none" }}>
                    <span style={{ color: "#ED154C" }}>
                      Click here
                    </span>
                  </a>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </main>
  );
}
