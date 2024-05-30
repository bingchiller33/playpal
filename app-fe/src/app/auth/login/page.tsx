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
    const response = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });
    
    
    console.log({ response });
    if (!response?.error) {
      console.log("vailon success");
    }
  };

  return (
    <main>
      <Header />
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={4}>
            <div className={styles["form-container"]}>
              <h2 className={styles["title"]}>Welcome back!</h2>
              <p className="">
                Don't have an account?{" "}
                <a href="/auth/register">
                  <span style={{ color: "#ED154C" }}>
                    Create a new account now
                  </span>
                </a>
              </p>
              <p className="">It's FREE! Take less than a minute</p>
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
                <Button className={`${styles["login_with_google"]} w-100 mt-2`}>
                  <img
                    src="" // Update this path to your logo location
                    alt="Google logo"
                    className={styles["google-logo"]}
                  />
                  Login with Google
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </main>
  );
}
