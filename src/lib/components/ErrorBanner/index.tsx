import React from "react";
import { Alert } from "antd";

interface Props {
  message?: string;
  description?: string
}

export const ErrorBanner = ({
  message = "Uh Oh! Something went wrong :(",
  description = "Looks like something technical went wrong. Please check your connection and/or try again later."
}: Props) => {
  return (
    <Alert 
      banner
      closable
      message={message}
      description={description}
      type="error"
      className="error-banner"
    />
  )
}