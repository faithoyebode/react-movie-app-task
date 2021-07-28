import React from 'react';
import { Center, Flex } from '@chakra-ui/react'

const TopBar = () => {
    return (
        <Flex direction="column" justify="center" align={{base: 'center', xl: 'flex-start'}} background="#292929" height={{base: '67px', md: '140px'}}>
            <Center h={{base: '33.58px', md: '60px'}} w={{base: '108px', md: '193px'}} ml={{base: null, xl: '77px'}} border="1px" borderStyle="solid" borderColor="#FFFFFF" color="white">
                MyTestApp
            </Center>
        </Flex>
    )
}

export default TopBar;
