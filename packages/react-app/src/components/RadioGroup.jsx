import React from "react";
import { Box, HStack, Input, useRadio, useRadioGroup } from "@chakra-ui/react";

export function RadioCard(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <Input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "blue.600",
          color: "white",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        {typeof props.children === "function" ? props.children(input) : props.children}
      </Box>
    </Box>
  );
}

const RadioGroup = props => {
  const { getRootProps, getRadioProps } = useRadioGroup(props);
  const group = getRootProps();

  const validChildren = React.Children.toArray(props.children).filter(el => React.isValidElement(el));
  const clones = validChildren.map(child => {
    const radioProps = getRadioProps(child.props);
    return React.cloneElement(child, { ...child.props, ...radioProps });
  });

  return <HStack {...group}>{clones}</HStack>;
};

export default RadioGroup;
