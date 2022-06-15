import { Box, useTheme } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { Navbar } from '~/components/nav/Navbar';
import { SubNavBar } from '~/components/nav/SubNavBar';
import { useRef } from 'react';
import { useElementScroll } from 'framer-motion';

export function AppContent({ Component, pageProps }: AppProps) {
    const ref = useRef(null);
    const { scrollY } = useElementScroll(ref);
    const theme = useTheme();

    return (
        <Box height="full" className="bg" overflowX="hidden" ref={ref}>
            <Box pt="3" />
            <Navbar scrollY={scrollY} />
            <Box pt="1" />
            <SubNavBar />
            <Box display="flex" justifyContent="center" mt="8">
                <Box
                    width={{ base: 'full', '2xl': theme.breakpoints['2xl'] }}
                    px={{ base: '4', xl: '8' }}
                    pb={{ base: '4', xl: '8' }}
                >
                    <Component {...pageProps} />
                </Box>
            </Box>
        </Box>
    );
}
