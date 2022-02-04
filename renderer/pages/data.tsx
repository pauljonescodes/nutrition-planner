import { exportDB } from "dexie-export-import";
import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Fade,
  Form,
  Row,
} from "react-bootstrap";
import { Database } from "../data/database";

const DataPage = () => {
  const [blobText, setBlobText] = useState<string | undefined>(undefined);

  async function refreshState() {
    const blob = await exportDB(Database.shared());
    const blobText = await blob.text();
    setBlobText(JSON.stringify(JSON.parse(blobText), null, 2));
  }

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <Fade in={blobText !== undefined}>
      <Container fluid className="py-2 mp-vh-100">
        <Row>
          <Col>
            <ButtonGroup className="w-100">
              <Button>Copy</Button>
              <Button>Apply</Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row className="mp-h-100-data-form pt-2">
          <Col>
            <Form.Control
              as="textarea"
              value={blobText}
              spellCheck={false}
              className="h-100"
            />
          </Col>
        </Row>
      </Container>
    </Fade>
  );
};

export default DataPage;
