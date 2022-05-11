import { Box, Text, Container, Heading, VStack, useTheme, Flex, Button } from '@chakra-ui/react';
import { ChevronsDown } from 'react-feather';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TokenSelect from '~/components/token-select/TokenSelect';
import { useGetTokenPricesQuery } from '~/apollo/generated/graphql-codegen-generated';
import TokenInput from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';

function TradeCard() {
    const { data, loading, error } = useGetTokenPricesQuery();
    const [showTokenSelect, setShowTokenSelect] = useState(false);

    const toggleTokenSelect = () => {
        setShowTokenSelect(!showTokenSelect);
    };

    const theme = useTheme();
    return (
        <Card title="Market Swap" position="relative" height="md" shadow="lg">
            <VStack spacing="2" padding="4" width="full">
                <Box position="relative" width="full" onClick={toggleTokenSelect}>
                    <TokenInput label="Sell" />
                    <Button
                        justifyContent="center"
                        backgroundColor="beets.gray.600"
                        alignItems="center"
                        rounded="lg"
                        border="4px"
                        padding="1"
                        borderColor="beets.gray.500"
                        position="absolute"
                        bottom="-37px"
                        left="calc(50% - 20px)"
                        zIndex="2"
                        role="group"
                        _hover={{ borderColor: 'beets.green.500', cursor: 'pointer' }}
                        _active={{ backgroundColor: 'beets.gray.600' }}
                    >
                        <Box
                            marginTop="1px"
                            color="beets.gray.200"
                            css={{
                                transform: 'rotate(360deg)',
                                transition: 'transform linear .15s',
                            }}
                            _groupHover={{
                                color: 'beets.green.500',
                                cursor: 'pointer',
                                transform: 'rotate(180deg)',
                                transition: 'all linear .15s',
                            }}
                            _groupFocus={{ color: 'beets.green.500', cursor: 'pointer' }}
                        >
                            <ChevronsDown size={24} color="currentColor" />
                        </Box>
                    </Button>
                </Box>
                <TokenInput label="Buy" />
            </VStack>
            <AnimatePresence>{showTokenSelect && <TokenSelect />}</AnimatePresence>
        </Card>
    );
}
export default TradeCard;
