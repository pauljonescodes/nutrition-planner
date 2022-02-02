import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { database, User } from "../data/dexie-database";

const IndexPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    database.users!.toArray().then(setUsers);
  });

  return (
    <Container fluid className="pt-2">
      <Form
        onSubmit={() => {
          database.users!.add({ email, password });
        }}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.email}, {user.password}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default IndexPage;
