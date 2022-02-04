import { exportDB, importInto } from "dexie-export-import";
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
  const [blobText, setBlobText] = useState<string>("");

  async function refreshState() {
    const blob = await exportDB(Database.shared());
    const blobText = await blob.text();
    setBlobText(JSON.stringify(JSON.parse(blobText), null, 2));
  }

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <Fade in={blobText.length > 0}>
      <Container fluid className="py-2 mp-vh-100">
        <Row>
          <Col>
            <ButtonGroup className="w-100">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(blobText);
                }}
              >
                Copy
              </Button>
              <Button
                onClick={async () => {
                  await Database.shared().delete();
                  await Database.shared().open();
                  importInto(Database.shared(), new Blob([blobText]));
                }}
              >
                Apply
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row className="mp-h-100-data-form pt-2">
          <Col>
            <Form.Control
              as="textarea"
              value={blobText}
              onChange={(event) => {
                setBlobText(event.target.value);
              }}
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
