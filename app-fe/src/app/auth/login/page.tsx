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

export default async function Login() {

  
  return (
    <main>
      <Header />
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={4}>
            <div className={styles["form-container"]}>
              <h1 className="">Login</h1>
              <Form action={create}>
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
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </main>
  );
}
