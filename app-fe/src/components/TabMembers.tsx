"use client"
import { Button, Container, Modal } from "react-bootstrap";
import { AiOutlineUserAdd } from "react-icons/ai";
import InviteMemberPopup from "./InviteMemberPopup";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";

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
              style={{ borderRadius: "50%", height: "3rem" }}
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
          <div className="custom modal-content">
            <div className="modal-header">
              <h2 className=" modalHeader text-uppercase font-all-star">Invite Members</h2>
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
            </div>

            <div className="modal-body">

              <div className="inviteMemberSearch">
                <form className="d-flex">
                  <input className="searchForm form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                </form>
              </div>

              <div className="inviteMemberFriends">
                <h5 className="mt-2">Friends</h5>

                <div className="row  mt-2">
                  <div className="col-1">
                    <img
                      src="/images/test.jpg"
                      style={{ borderRadius: "50%", height: "3rem" }}
                    />
                  </div>
                  <div className="col-6 members-name d-flex align-items-center">
                    <p>PanPan</p>
                  </div>
                  <div className="col-3 text-center">
                    <button className="btn-noBorder">
                      Invite
                    </button>
                  </div>
                </div>


              </div>

              <div className="inviteMemberSuggested">
                <h5 className="mt-2">Request</h5>

                <div className="row  mt-2">
                  <div className="col-1">
                    <img
                      src="/images/test.jpg"
                      style={{ borderRadius: "50%", height: "3rem" }}
                    />
                  </div>
                  <div className="col-6 members-name d-flex align-items-center">
                    <p>PanPan</p>
                  </div>
                  <div className="col-3 text-center">
                    <button className="btn-noBorder">
                      Invite
                    </button>
                  </div>
                </div>
              </div>


            </div>



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
