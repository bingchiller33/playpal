"use client";
import Avatar from "@/components/Avatar";
import { COLORS } from "@/utils/constants";
import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { PiDotsThreeOutline } from "react-icons/pi";
import IconLink from "@/components/IconLink";
import IconButton from "@/components/IconButton";
import NotificationPanel from "@/components/NotificationPanel";
import NotificationIcon from "@/components/NotificationIcon";
import { WithId } from "@/utils/types";
import { ISquad } from "@/models/squadModel";
import { Col, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { changeSquadImage, changeSquadName, getSquadById } from "./server";
import { NextPageProps } from "@/utils/types";
import { CldUploadWidget } from "next-cloudinary";
import { RiPencilFill } from "react-icons/ri";

const SquadHeader = (props: SquadHeaderProp) => {
    const { id } = props.params;

    const [showModal, setShowModal] = useState(false);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [newSquadName, setNewSquadName] = useState(props.squad.name || "");
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
            <Avatar size={32} src={props.squad.img} initials="S" />
            <h1
                className="ms-2"
                style={{ fontSize: 18, margin: 0, fontWeight: "normal" }}
            >
                {props.squad.name || "My Squad"}
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

            <Modal
                size="lg"
                className="inviteMemberPopup"
                show={showModal}
                onHide={handleCloseModal}
                animation={false}
                style={{ borderRadius: "15px" }}
            >
                <div className="custom modal-content">
                    <div
                        className="modal-header"
                        style={{ position: "relative" }}
                    >
                        <h2 className=" modalHeader text-uppercase font-all-star">
                            Invite Members
                        </h2>
                        <IoMdClose
                            className="closeInvitePopup"
                            onClick={handleCloseModal}
                        />
                    </div>

                    <div className="modal-body">
                        <h2>General</h2>
                        <hr />
                        <Row>
                            <Col md={3}>
                                <div className="d-flex align-items-center flex-column">
                                    <Avatar
                                        size={75}
                                        initials="S"
                                        src={props.squad.img}
                                    />
                                    <CldUploadWidget
                                        options={{ sources: ["local", "url"] }}
                                        signatureEndpoint="/api/sign-image"
                                        onSuccess={handleSquadImgChange}
                                    >
                                        {({ open }) => {
                                            return (
                                                <button
                                                    className="mt-2 btn btn-noBorder d-flex align-items-center gap-2"
                                                    onClick={() => open()}
                                                    style={{
                                                        background:
                                                            "var(--clr-primary-1)",
                                                    }}
                                                >
                                                    <RiPencilFill />

                                                    <span className="text-white">
                                                        Change
                                                    </span>
                                                </button>
                                            );
                                        }}
                                    </CldUploadWidget>
                                </div>
                            </Col>
                            <Col md={9}>
                                {" "}
                                <div className="flex-grow-1">
                                    <h3>Squad Name</h3>
                                    <div className="d-flex gap-2 align-items-center ">
                                        <input
                                            type="text"
                                            className="pp-form-input searchForm p-2 flex-grow-1"
                                            id="squadName"
                                            placeholder="Enter new squad name"
                                            value={newSquadName}
                                            onChange={(e) =>
                                                setNewSquadName(e.target.value)
                                            }
                                        />

                                        <button
                                            className="btn btn-noBorder "
                                            style={{
                                                background:
                                                    "var(--clr-primary-1)",
                                            }}
                                        >
                                            <span
                                                className="text-white"
                                                onClick={handleSquadNameChange}
                                            >
                                                Save
                                            </span>
                                        </button>
                                    </div>
                                    <p
                                        style={{
                                            fontStyle: "italic",
                                            opacity: 0.8,
                                        }}
                                    >
                                        Changing the name of a group changes it
                                        for everyone
                                    </p>
                                </div>
                            </Col>
                        </Row>
                        <div className="d-flex gap-3"></div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export interface SquadHeaderProp extends NextPageProps {
    squad: WithId<ISquad>;
}

export default SquadHeader;
