"use client";
import Avatar from "@/components/Avatar";
import { COLORS } from "@/utils/constants";
import { IoIosArrowBack } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { PiDotsThreeOutline } from "react-icons/pi";
import IconLink from "@/components/IconLink";
import IconButton from "@/components/IconButton";
import NotificationPanel from "@/components/NotificationPanel";
import NotificationIcon from "@/components/NotificationIcon";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { changeSquadImage, changeSquadName, getSquadById } from "./server";
import { NextPageProps } from "@/utils/types";
import { CldUploadWidget } from "next-cloudinary";

const SquadHeader = ({ params }: NextPageProps) => {
  const { id } = params;

  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [newSquadName, setNewSquadName] = useState("");
  const [newSquadImgUrl, setSquadImgUrl] = useState<string>("");

  useEffect(() => {
    const fetchSquad = async () => {
      const squad = await getSquadById(id);
      setSquadImgUrl(squad.img as string);
    };
    fetchSquad();
  }, [id]);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setActiveSection(null);
  };

  const handleSquadNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSquadName.trim()) {
      await changeSquadName(id, newSquadName);
      handleCloseModal();
    }
  };

  const handleSquadImgChange = async (result: any) => {
    const newImageUrl = result?.info?.secure_url;
    console.log(newImageUrl);

    if (newImageUrl) {
      await changeSquadImage(id, newImageUrl);
      setSquadImgUrl(newImageUrl);
      handleCloseModal();
    }
  };

  return (
    <div className="d-flex align-items-center gap-1 py-2">
      <IconLink href="/" className="d-none d-md-block">
        <IoIosArrowBack fill={COLORS.PRIMARY_1} size={28} />
      </IconLink>
      <IconLink href="/my-squad" className="d-block d-md-none">
        <IoIosArrowBack fill={COLORS.PRIMARY_1} size={28} />
      </IconLink>
      <Avatar size={32} initials="S" />
      <h1
        className="ms-2"
        style={{ fontSize: 18, margin: 0, fontWeight: "normal" }}
      >
        Squad Header
      </h1>

      <div className="ms-auto">
        <IconButton>
          <IoCallOutline stroke={COLORS.PRIMARY_1} size={28} />
        </IconButton>
      </div>
      <div className="d-md-none">
        <NotificationIcon />
      </div>
      <IconButton className="me-2" onClick={handleOpenModal}>
        <PiDotsThreeOutline fill={COLORS.PRIMARY_1} size={28} />
      </IconButton>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Squad Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!activeSection && (
            <ul className="list-group">
              <li
                className="list-group-item"
                onClick={() => setActiveSection("changeName")}
              >
                Change Squad Name
              </li>
              <li
                className="list-group-item"
                onClick={() => setActiveSection("changeImage")}
              >
                Change Squad Image
              </li>
            </ul>
          )}
          {activeSection === "changeName" && (
            <form onSubmit={handleSquadNameChange}>
              <div className="mb-3">
                <label
                  htmlFor="squadName"
                  className="form-label"
                  style={{ color: "black" }}
                >
                  Change squad name
                </label>
                <p style={{ color: "black" }}>
                  Changing the name of a group changes it for everyone
                </p>
                <input
                  type="text"
                  className="form-control"
                  id="squadName"
                  placeholder="Enter new squad name"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveSection(null)}
              >
                Back
              </button>
            </form>
          )}
          {activeSection === "changeImage" && (
            <CldUploadWidget
              options={{ sources: ["local", "url"] }}
              signatureEndpoint="/api/sign-image"
              onSuccess={handleSquadImgChange}
            >
              {({ open }) => {
                return <button onClick={() => open()}>Upload an Image</button>;
              }}
            </CldUploadWidget>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SquadHeader;
