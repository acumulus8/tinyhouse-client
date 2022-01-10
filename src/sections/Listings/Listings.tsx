import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { Listings as ListingsData } from "./__generated__/Listings";
import { DeleteListing as DeleteListingData, DeleteListingVariables} from "./__generated__/DeleteListing";

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
  const { data, refetch, loading, error } = useQuery<ListingsData>(LISTINGS);

  const [deleteListing, {loading: dltListingLoading, error: dltListingError }] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);
  
  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  }

  const listings = data ? data.listings : null;

  const listingsList =
    <ul>
    {listings?.map((listing) => {
      return <li key={listing.id}>
        {listing.title}
        <button onClick={() => handleDeleteListing(listing.id)}>Delete!</button>
        </li>
    })}
  </ul>

  
  if (loading) {
    return <h2>...Loading</h2>
  }

  if (error) {
    return <h2>Uh oh! Something went wrong - please try again later!</h2>
  }

  const deleteListingLoadingMsg = dltListingLoading ? "Deleting, hold your horses" : null;
  const deteListingErrorMsg = dltListingError ? "Uh oh - something went wrong. Try again later :*(" : null;


  return (
    <div>
      <h2>{title}</h2>
      {listingsList} 
      {deleteListingLoadingMsg}
      {deteListingErrorMsg}
    </div>
  )
}