import { GqlPoolApr } from '~/apollo/generated/graphql-codegen-generated';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Button,
    ButtonGroup,
    Box,
    Flex,
    Text,
} from '@chakra-ui/react';
import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import numeral from 'numeral';

interface Props {
    data: GqlPoolApr;
}

function AprTooltip({ data }: Props) {
    return (
        <Popover trigger="hover">
            <Flex>
                <Text fontWeight={'semibold'} mr={1}>
                    {numeral(data.total).format('0.00%')}
                </Text>
                <PopoverTrigger>
                    <a>
                        <StarsIcon />
                    </a>
                </PopoverTrigger>
            </Flex>

            <PopoverContent bg="black">
                {data.items.map((item, index) => {
                    return (
                        <Box key={index}>
                            <Text>
                                {item.title} {numeral(item.apr).format('0.00%')}
                            </Text>
                            {item.subItems?.map((subItem, subItemIndex) => (
                                <Text key={subItemIndex}>
                                    {subItem.title} {numeral(subItem.apr).format('0.00%')}
                                </Text>
                            ))}
                        </Box>
                    );
                })}
            </PopoverContent>
        </Popover>
    );
}

export default AprTooltip;