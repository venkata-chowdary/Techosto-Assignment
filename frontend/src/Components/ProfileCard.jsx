import React, { useState } from 'react';
import { Card, Button, Modal, Form, Input } from 'antd';
import { HeartOutlined, HeartFilled, EditOutlined, DeleteFilled, MessageOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProfileCard = ({ user, setUsers }) => {
    const [liked, setLiked] = useState(false);
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();

    const toggleHeart = () => {
        setLiked(!liked);
    };

    const showModal = () => {
        setOpen(true);
        form.setFieldsValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
            website: user.website
        });
    };

    const handleOk = () => {
        form.submit();
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const onFinish = (values) => {
        axios
            .put(`http://localhost:5000/api/edit-user-details/${user._id}`, values)
            .then((response) => {
                if (response.status === 200) {
                    setUsers((prevUsers) =>
                        prevUsers.map((u) =>
                            u._id === user._id ? { ...u, ...values } : u
                        )
                    );
                }
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleDelete = () => {
        axios
            .delete(`http://localhost:5000/api/delete-user/${user._id}`)
            .then((response) => {
                if (response.status === 200) {
                    setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
                }
            })
            .catch((error) => {
                console.error('Error deleting user:', error);
            });
    };

    const commonIconStyle = {
        fontSize: '18px',
        color: '#737373',
    };

    const commonParagraphStyle = {
        margin: '0 0 5px 10px',
        color: '#737373',
    };

    const commonNameStyle = {
        marginTop: 0,
        marginBottom: '.5em',
        color: 'rgba(0, 0, 0, .85)',
        fontWeight: '500',
    };

    return (
        <div style={{ margin: '10px' }}>
            <Card
                style={{ width: '100%', borderRadius: 2 }}
                actions={[
                    <Button
                        type="text"
                        icon={
                            liked ? (
                                <HeartFilled
                                    onClick={toggleHeart}
                                    style={{ ...commonIconStyle, color: '#ff0000' }}
                                />
                            ) : (
                                <HeartOutlined
                                    onClick={toggleHeart}
                                    style={{ ...commonIconStyle, color: '#ff0000' }}
                                />
                            )
                        }
                    />,
                    <Button type="text" icon={<EditOutlined style={commonIconStyle} />} onClick={showModal} />,
                    <Button type="text" icon={<DeleteFilled style={commonIconStyle} />} onClick={handleDelete} />,
                ]}
                cover={
                    <div
                        style={{
                            minWidth: '300px',
                            height: '200px',
                            overflow: 'hidden',
                            margin: '0 auto',
                            background: '#f5f5f5',
                        }}
                    >
                        <img
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            alt="avatar"
                            src={`https://api.dicebear.com/9.x/personas/svg?seed=${user.name}`}
                        />
                    </div>
                }
            >
                <h3 style={commonNameStyle}>{user.name}</h3>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <MessageOutlined style={commonIconStyle} />
                        <p style={commonParagraphStyle}>{user.email}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <PhoneOutlined style={commonIconStyle} />
                        <p style={commonParagraphStyle}>{user.phone}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <GlobalOutlined style={commonIconStyle} />
                        <p style={commonParagraphStyle}>{user.website}</p>
                    </div>
                </div>
            </Card>
            <Modal
                open={open}
                title="Edit Profile"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>Ok</Button>
                ]}
                bodyStyle={{
                    paddingTop: '30px',
                    paddingBottom: '35px',
                    marginTop: '20px',
                    borderTop: '1px solid #e8e8e8',
                    borderBottom: '1px solid #e8e8e8',
                }}
                centered
            >
                <Form
                    form={form}
                    name="editUser"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        website: user.website
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your email!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your phone!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Website"
                        name="website"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfileCard;
