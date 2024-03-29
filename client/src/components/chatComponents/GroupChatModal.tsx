import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
} from "@chakra-ui/react";
import { useState } from "react";
import UserBadgeItem from "../UserAvatar/UserBadge";
import UserListItem from "../UserAvatar/UserListItem";
import { axiosClient } from "../../utils/axiosClient";
import mongoose from "mongoose";
import { chatsState, userState } from "../../recoil/GlobalStates"
import { useRecoilState, useRecoilValue } from "recoil";

interface GroupChatModalProps {
    children: React.ReactNode;
}

export interface UserSchema {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    pic?: string;
    users?: UserSchema[];
    isAdmin: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    token?: string;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ children }) => {

    const user = useRecoilValue(userState);
    const [chats, setChats] = useRecoilState(chatsState);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState<string>();
    const [selectedUsers, setSelectedUsers] = useState<UserSchema[]>([]);
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState<UserSchema[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();

    const handleGroup = (userToAdd: UserSchema) => {
        if (selectedUsers && selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers!, userToAdd]);
    };

    const handleSearch = async (query: React.ReactNode) => {
        setSearch(query as string);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user!.token}`,
                },
            };
            const { data } = await axiosClient.get(`/api/auth/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const handleDelete = (delUser: UserSchema) => {
        setSelectedUsers(selectedUsers!.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user!.token}`,
                },
            };
            const users = selectedUsers.map((u) => u._id);
            const { data } = await axiosClient.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(users),
                },
                config
            );
            // console.log(data);
            setChats!([data, ...chats]);
            onClose();
            toast({
                title: "New Group Chat Created!",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        } catch (error) {
            toast({
                title: "Failed to Create the Chat!",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: John, Piyush, Jane"
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers && selectedUsers!.map((u) => (
                                <UserBadgeItem
                                    key={JSON.stringify(u._id)}
                                    admin={user}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}
                                />
                            ))}
                        </Box>
                        {loading ? (
                            // <ChatLoading />
                            <div>Loading...</div>
                        ) : (
                            searchResult
                                ?.slice(0, 4)
                                .map((usr) => (
                                    <UserListItem
                                        key={JSON.stringify(usr._id)}
                                        user={usr}
                                        handleFunction={() => handleGroup(usr)}
                                    />
                                ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit} colorScheme="blue">
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GroupChatModal;
