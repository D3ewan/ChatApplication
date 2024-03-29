import { ViewIcon } from "@chakra-ui/icons";
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
    IconButton,
    Spinner,
    useColorMode,
} from "@chakra-ui/react";
import { useState } from "react";
import UserBadgeItem from "../UserAvatar/UserBadge";
import UserListItem from "../UserAvatar/UserListItem";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { chatsState, selectedChatState, userState } from "../../recoil/GlobalStates";
import { axiosClient } from "../../utils/axiosClient";
import { UserSchema } from "./GroupChatModal";
import { ChatSchema } from "./MyChats";
import theme from "../DarkMode/theme";

interface MyChatsProps {
    fetchMessages: () => (void);
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
}


const UpdateGroupChatModal: React.FC<MyChatsProps> = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState<string>("");
    const [search, setSearch] = useState<string>("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState<boolean>(false);
    const toast = useToast();
    const setChats = useSetRecoilState(chatsState);
    const [selectedChat, setSelectedChat] = useRecoilState(selectedChatState);
    const user = useRecoilValue(userState);
    const { colorMode } = useColorMode();

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Please Enter Something in search',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-left'
            })
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axiosClient.get(`/api/auth/user?search=${search}`, config);
            // console.log('data', data);
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
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axiosClient.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            // console.log(data._id);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    // console.log(selectedChat);
    const handleAddUser = async (user1: UserSchema) => {
        if (selectedChat && selectedChat.users!.find((u: UserSchema) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axiosClient.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1: UserSchema) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axiosClient.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat({} as ChatSchema) : setSelectedChat(data);
            if (user1._id === user._id)
                setChats(currentChats => currentChats.filter(chat => chat._id !== selectedChat._id));
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: (error as Error).message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <IconButton aria-label=""
                display={{ base: "flex" }}
                icon={<ViewIcon />}
                onClick={onOpen}
                _hover={{ bg: "teal.600" }}
                _focus={{ boxShadow: "outline" }}
            />

            <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent
                    bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                >
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                        bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                    >
                        {selectedChat.chatName}
                    </ModalHeader>

                    <ModalCloseButton />
                    <ModalBody display="flex" //bg={colorMode === 'dark' ? theme.colors.dark.foreground : theme.colors.light.background}
                        flexDir="column" alignItems="center">
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users!.map((u: UserSchema) => (
                                <UserBadgeItem
                                    key={JSON.stringify(u._id)}
                                    user={u}
                                    admin={selectedChat.groupAdmin}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl display='flex'>
                            <Input
                                placeholder="Add User to group"
                                mb={1}
                                bg={colorMode === 'dark' ? theme.colors.dark.background : theme.colors.light.background}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button colorScheme='teal' ml={1} onClick={handleSearch} >Search</Button>
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user: UserSchema) => (
                                <UserListItem
                                    key={JSON.stringify(user._id)}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
