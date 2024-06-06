"use client"
import { Button, Container, Modal } from "react-bootstrap";
import { AiOutlineUserAdd } from "react-icons/ai";
import InviteMemberPopup from "./InviteMemberPopup";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { BiCloset } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { ISquadEnrollment } from "@/models/squadEnrollmentModel";
import IconLink from "./IconLink";
import Avatar from "./Avatar";
import { IAccount } from "@/models/account";

const TabMembers = ({ members, membersRecommend }: MembersProps) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  return (
    <Container fluid>
      <div className="" style={{ height: "80%", }}>
        {
          members.map((member) => (
            <div className="d-flex flex-row members-line  mt-2" key={member.accountId.toString()}>
              <div className="">
                <IconLink href="/">
                  {member.accountId.avatar ? (
                    <Avatar size={36} src={member.accountId.avatar} />
                  ) : (
                    <Avatar size={36}
                      initials={member.accountId.username?.[0] ?? "P"}
                    />
                  )}

                </IconLink>

              </div>
              <div className=" members-name d-flex align-items-center">
                <p>{member.accountId.username}</p>
              </div>
            </div>
          ))
        }


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
            <div className="modal-header" style={{ position: 'relative' }}>
              <h2 className=" modalHeader text-uppercase font-all-star">Invite Members</h2>
              <IoMdClose className="closeInvitePopup" onClick={handleClose} />
            </div>

            <div className="modal-body">

              <div className="inviteMemberSearch">
                <form className="d-flex">
                  <input className="searchForm form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                </form>
              </div>

              <div className="inviteMemberFriends">
                <div className="row">
                  <div className="col-1"> <hr /></div>

                  <div className="col-3 text-center">
                    <h5 className="">Friends</h5>
                  </div>
                  <div className="col-8"><hr /></div>
                </div>

                <div className="row mt-2 mb-2">
                  <div className="col-1">
                    <img
                      src="/images/test.jpg"
                      style={{ borderRadius: "50%", height: "3rem" }}
                    />
                  </div>
                  <div className="col-6 invite-name d-flex align-items-center">
                    <p>PanPan</p>
                  </div>

                  <div className="col-3 ">
                    <button className="btn-noBorder">
                      Invite
                    </button>
                  </div>
                </div>

              </div>

              <div className="inviteMemberFriends">
                <div className="row">
                  <div className="col-1"> <hr /></div>

                  <div className="col-3 text-center">
                    <h5 className="">Recommend</h5>
                  </div>
                  <div className="col-8"><hr /></div>
                </div>

                {
                  membersRecommend.map((member) => (
                    <div className="d-flex flex-row mt-2" >
                      <div className="">
                        <IconLink href="/">
                          {member.avatar ? (
                            <Avatar size={36} src={member.avatar} />
                          ) : (
                            <Avatar size={36}
                              initials={member.username?.[0] ?? "P"}
                            />
                          )}

                        </IconLink>

                      </div>
                      <div className=" invite-name d-flex align-items-center">
                        <p>{member.username ?? "no username"}</p>
                      </div>
                      <div>
                      <button className="btn-noBorder">
                      Invite
                    </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </Modal>

      </div>
    </Container>
  );
};

export interface MembersProps {
  members: ISquadEnrollment[];
  membersRecommend: IAccount[];
}

export default TabMembers;
