import React from "react";
import { Skeleton, Divider, Alert } from "antd";
import "../../styles/listingsSkeleton.css"

interface Props {
  title: string;
  error: boolean
}

export const ListingsSkeleton = ({ title, error = false }: Props ) => {
  const errorAlert = error ? <Alert type="error" message="Uh oh, something went wrong" className="listings-skeleton_alert"/> : null;
  
  return (
    <div>
      <h2>{title}</h2>
      {errorAlert}
      <Skeleton active paragraph={{ rows: 1}} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1}} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1}} />
      <Divider />
    </div>
  )
}