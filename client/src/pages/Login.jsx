import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Row, Form, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../features/usersApiSlice";
import { setCredentials } from "../features/authSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      if (isSuccess) {
        navigate("/");
      }
      toast.success("Successfully logged in");
    } catch (err) {
      toast.error(err?.data?.error?.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center my-5">
        <Col xs={12} md={5}>
          <Card>
            <Card.Header>Login Form</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="my-2" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </Form.Group>
                <Form.Group className="my-2" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Enter password"
                  />
                </Form.Group>
                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="primary"
                  className="mt-3 w-100"
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </Button>
              </Form>
              <Row className="py-3">
                <Col>
                  New Customer? <Link to="/register">Register</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
