import { Box } from "@chakra-ui/react";

function Tag(props) {
  const { children, color, ...others } = props;
  return (
    <Box as="span" mx="1" p="1" fontWeight="bold" borderRadius="base" bg={color} {...others}>
      {children}
    </Box>
  );
}

export default Tag;
