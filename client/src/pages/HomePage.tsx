import { Box, Container, Text } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Signup from '../components/Authentication/Signup'
import Login from '../components/Authentication/Login'

function HomePage() {
    return <Container maxW="xl" centerContent>
        <Box
            display="flex"
            justifyContent="center"
            p={3}
            bg="white"
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
        >
            <Text fontSize="4xl">Chat App</Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
            <Tabs variant='soft-rounded' >
                <TabList mb='1em'>
                    <Tab width='50%'>Login</Tab>
                    <Tab width='50%'>Sign Up</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login />
                    </TabPanel>
                    <TabPanel>
                        <Signup />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    </Container >
}

export default HomePage