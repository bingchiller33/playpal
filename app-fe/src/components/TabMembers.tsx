"use client"
import { Button, Container, Modal } from "react-bootstrap";
import { AiOutlineUserAdd } from "react-icons/ai";
import InviteMemberPopup from "./InviteMemberPopup";
import { useState } from "react";

const TabMembers = ({ id }: MembersProps) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container fluid>
      <div className="" style={{ height: "80%" }}>
        
        <div className="row  mt-2">
          <div className="col-1">
            <img
              src="/images/test.jpg"
              style={{ borderRadius: "50%", height: "3rem"}}
            />
          </div>
          <div className="col-8  members-name d-flex align-items-center">
            <p>PanPan</p>
          </div>
          <div className=" mt-2 members-line"></div>
        </div>

      </div>

      <div className="btn-inviteFriend text-center">
        <Button
          onClick={handleShow}
          style={{
            background: "var(--clr-primary-1)",
            borderColor: "var(--clr-primary-1)",
          }}
        >
          <AiOutlineUserAdd />
          <span className="ms-1">Invite</span>
        </Button>

        <Modal size="lg" className="inviteMemberPopup" show={show} onHide={handleClose} animation={false}
          style={{ borderRadius: "15px", }}>
          <div className="custom">
            <Modal.Header closeButton>
              <Modal.Title className=" modalHeader text-uppercase font-all-star">Invite Members</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
           

          </div>
        </Modal>

      </div>
    </Container>
  );
};

export interface MembersProps {
  id: string;
}

export default TabMembers;
