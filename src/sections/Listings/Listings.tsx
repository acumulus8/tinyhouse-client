import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { Listings as ListingsData } from "./__generated__/Listings";
import { DeleteListing as DeleteListingData, DeleteListingVariables} from "./__generated__/DeleteListing";
import { List, Button, Avatar, Spin, Alert } from "antd";
import "./styles/listings.css"
import { ListingsSkeleton } from "./components";

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`
const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { loading, error, data, refetch } = useQuery<ListingsData>(LISTINGS);

  const [deleteListing, { data: dltListingData, loading: dltListingLoading, error: dltListingError }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);
  
  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  }

  const deleteListingErrorAlert = dltListingError ? (
    <Alert type="error" message="Uh oh, something went wrong" className="listings_alert"/> 
  ) : null;

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <List 
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={listing => (
        <List.Item actions={[<Button onClick={() => handleDeleteListing(listing.id)} type="primary" >Delete</Button>]}>
          <List.Item.Meta title={listing.title} description={listing.address} avatar={<Avatar src={listing.image} shape="square" size={48} />} />
        </List.Item>
      )}
    />
  ) : null;
  
  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error={false} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error/>
      </div>
    )
  }

  return (
    <div className="listings">
      <Spin spinning={dltListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingsList} 
      </Spin>
    </div>
  )
}