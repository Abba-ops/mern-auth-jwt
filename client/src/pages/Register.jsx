import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Col, Row, Form, Card, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../features/usersApiSlice";
import { setCredentials } from "../features/authSlice";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const [register, { isLoading, isSuccess }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    lastName: "",
    firstName: "",
    confirmPassword: "",
  });

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({
          email,
          lastName,
          password,
          firstName,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        if (isSuccess) {
          navigate("/");
        }
        toast.success(`Welcome ${firstName}`);
      } catch (err) {
        toast.error(err?.data?.error?.message);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center my-5">
        <Col xs={12} md={5}>
          <Card>
            <Card.Header>Registration Form</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                      />
                    </Form.Group>
                  </Col>
                </Row>
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
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="Enter password"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button
                  disabled={isLoading}
                  type="submit"
                  variant="primary"
                  className="mt-3 w-100"
                >
                  {isLoading ? "Loading..." : "Sign Up"}
                </Button>
              </Form>
              <Row className="py-3">
                <Col>
                  Already have an account? <Link to="/login">Login</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
