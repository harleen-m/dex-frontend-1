import { ButtonOptions, ButtonProps } from '@chakra-ui/button';
import { Button as ChakraButton } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode | ReactNode[];
};

export default function BeetsButton({ children, ...buttonOptions }: Props & ButtonOptions & ButtonProps) {
    return (
        <ChakraButton
            bg="beets.green"
            color="gray.500"
            _active={{ backgroundColor: 'beets.green' }}
            _focus={{ outline: 'none' }}
            rounded="xl"
            {...buttonOptions}
            _hover={{
                transform: 'scale(1.02)',
                ...buttonOptions._hover,
            }}
        >
            {children}
        </ChakraButton>
    );
}
