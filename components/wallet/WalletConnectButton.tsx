import { ConnectButton } from '@rainbow-me/rainbowkit';
import BeetsButton from '../button/Button';
import { Box, HStack, Text } from '@chakra-ui/layout';
import Image from 'next/image';
import { ChevronDown } from 'react-feather';
import BeetsSmart from '~/assets/icons/beetx-smarts.svg';

export default function WalletConnectButton() {
    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
                return (
                    <Box>
                        {(() => {
                            if (!mounted || !account || !chain) {
                                return (
                                    <BeetsButton
                                        _hover={{
                                            backgroundColor: 'beets.green',
                                            transform: 'scale(1.1)',
                                        }}
                                        _active={{
                                            backgroundColor: 'beets.green',
                                        }}
                                        onClick={openConnectModal}
                                        type="button"
                                    >
                                        Connect Wallet
                                    </BeetsButton>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <BeetsButton
                                        backgroundColor="red.400"
                                        _hover={{ backgroundColor: 'red.600' }}
                                        onClick={openChainModal}
                                        type="button"
                                    >
                                        Wrong network
                                    </BeetsButton>
                                );
                            }

                            return (
                                <HStack>
                                    <BeetsButton
                                        bg="transparent"
                                        rounded="xl"
                                        fontSize="md"
                                        onClick={openAccountModal}
                                        paddingX="none"
                                        padding="3px"
                                        color="gray.100"
                                        _hover={{
                                            backgroundColor: 'none',
                                            transform: 'scale(1.05)',
                                        }}
                                        _active={{
                                            backgroundColor: 'none',
                                        }}
                                    >
                                        <HStack width="full" height="full" spacing="1">
                                            {/* {account.displayBalance ? ` (${account.displayBalance})` : ''} */}
                                            {/*<Box>{account.ensAvatar}</Box>*/}
                                            <HStack
                                                justifyContent="center"
                                                alignItems="center"
                                                px="2"
                                                height="40px"
                                                rounded="10px"
                                                bg="beets.lightAlpha.200"
                                                width="full"
                                            >
                                                <Image src={BeetsSmart} width="24" alt="your-profile" />
                                                <Text>{account.displayName}</Text>
                                            </HStack>
                                        </HStack>
                                    </BeetsButton>
                                </HStack>
                            );
                        })()}
                    </Box>
                );
            }}
        </ConnectButton.Custom>
    );
}
