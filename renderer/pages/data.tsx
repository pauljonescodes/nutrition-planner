import { exportDB, importInto } from "dexie-export-import";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Fade,
  Form,
  Modal,
  Overlay,
  Row,
  Tooltip,
} from "react-bootstrap";
import { Database } from "../data/database";

const DataPage = () => {
  const [blobText, setBlobText] = useState<string>("");
  const [showImportedModal, setShowApplyModal] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const copyTooltipTarget = useRef(null);

  async function refreshState() {
    const blob = await exportDB(Database.shared());
    const blobText = await blob.text();
    setBlobText(JSON.stringify(JSON.parse(blobText), null, 4));
  }

  useEffect(() => {
    refreshState();
  }, []);

  return (
    <Fragment>
      <Fade in={blobText.length > 0}>
        <Container fluid className="py-2 mp-vh-100">
          <Row>
            <Col>
              <Row>
                <Col>
                  <Button
                    className="w-100"
                    ref={copyTooltipTarget}
                    onClick={() => {
                      navigator.clipboard.writeText(blobText);
                      setShowCopiedTooltip(true);
                      setTimeout(function () {
                        setShowCopiedTooltip(false);
                      }, 1000);
                    }}
                  >
                    Copy
                  </Button>
                  <Overlay
                    target={copyTooltipTarget.current}
                    show={showCopiedTooltip}
                    placement="bottom"
                  >
                    {(props) => <Tooltip {...props}>Copied</Tooltip>}
                  </Overlay>
                </Col>
                <Col>
                  <Button
                    className="w-100"
                    onClick={async () => {
                      setShowApplyModal(true);
                    }}
                  >
                    Apply
                  </Button>
                </Col>
              </Row>
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
      <Modal
        show={showImportedModal}
        centered
        onHide={() => setShowApplyModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Apply this data?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Importing drops the database first, which cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              setShowApplyModal(false);
              await Database.shared().delete();
              await Database.shared().open();
              importInto(Database.shared(), new Blob([blobText]));
            }}
          >
            Yes, I'm sure
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default DataPage;
