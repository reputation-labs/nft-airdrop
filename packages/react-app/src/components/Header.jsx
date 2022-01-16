import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
      <PageHeader
        title="Rostra"
        subTitle=""
        style={{ cursor: "pointer" }}
      />
  );
}
