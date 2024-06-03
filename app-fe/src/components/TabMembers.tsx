import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { AiOutlineUserAdd } from "react-icons/ai";
import InviteMemberPopup from "./InviteMemberPopup";

const TabMembers = ({ id }: MembersProps) => {

  return (
    <Container>
      <div className="" style={{ height: "80%" }}>
        <div className="row  ">
          <div className="col-2">
            <img
              src="/images/test.jpg"
              style={{ borderRadius: "50%", height: "3rem" }}
            />
          </div>
          <div className="col-8 members-name d-flex align-items-center">
            <p>PanPan</p>
          </div>
          <div className=" mt-2 members-line"></div>
        </div>
      </div>

      <div className="btn-inviteFriend">
        <Button
          style={{
            background: "var(--clr-primary-1)",
            borderColor: "var(--clr-primary-1)",
          }}
        >
          <AiOutlineUserAdd />
          <span className="ms-1">Invite</span>
        </Button>
       
        
      </div>
    </Container>
  );
};

export interface MembersProps {
  id: string;
}

export default TabMembers;
