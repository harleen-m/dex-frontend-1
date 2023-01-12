import { GridItem, Grid, Text } from '@chakra-ui/react';

export interface GaugeActionCardProps {
  heading: string;
}

export function GaugeActionCard1(props: GaugeActionCardProps) {
  return (
    <GridItem
      bg="vertek.slatepurple.900"
      boxShadow="0 0 10px #5BC0F8, 0 0 20px #4A4AF6"
      borderRadius="25px"
      maxW="550px"
      color="white"
    >
      <Grid h="100%" paddingX="2" paddingY="2">
        <GridItem mt="2">
          <Text fontSize="1.2rem" fontWeight="bold" textAlign="center">
            {props.heading}
          </Text>
        </GridItem>
        <GridItem mt="3">
          <Text alignItems="center" fontSize="1.5rem" justifyContent="center" textAlign="center">
            Date
          </Text>
        </GridItem>
        <GridItem mt="-1">
          <Text alignItems="center" fontSize="1rem" justifyContent="center" textAlign="center">
            Days
          </Text>
        </GridItem>
      </Grid>
    </GridItem>
  );
}
