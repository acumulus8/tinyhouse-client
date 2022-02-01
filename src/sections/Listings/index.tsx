import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Layout, List, Typography, Affix } from "antd";
import { ListingCard, ErrorBanner } from "../../lib/components";
import { LISTINGS } from "../../lib/graphql/queries";
import { Listings as ListingsData, ListingsVariables } from "../../lib/graphql/queries/Listings/__generated__/Listings";
import { ListingsFilter } from "../../lib/graphql/globalTypes";
import { ListingsFilters, ListingsPagination, ListingsSkeleton } from "./components";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 8;

export const Listings = () => {
	const [filter, setFilter] = useState<ListingsFilter>(ListingsFilter.PRICE_LOW_TO_HIGH);
	const [page, setPage] = useState<number>(1);
	const params = useParams();
	const locationRef = useRef(params.location);

	const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
		// skip: locationRef.current !== params.location && page !== 1,
		variables: {
			location: params.location || null,
			filter,
			limit: PAGE_LIMIT,
			page,
		},
	});

	useEffect(() => {
		setPage(1);
	}, [params.location]);

	if (loading) {
		return (
			<Content className="listings">
				<ListingsSkeleton />
			</Content>
		);
	}

	if (error) {
		return (
			<Content className="listings">
				<ErrorBanner
					description={`
            We either couldn't find anything matching your search or have encountered an error.
            If you're searching for a unique location, try searching again with more common keywords.
          `}
				/>
				<ListingsSkeleton />
			</Content>
		);
	}

	const listings = data ? data.listings : null;
	const listingsRegion = listings ? listings.region : null;
	const listingsRegionElement = listingsRegion ? (
		<Title level={3} className="listings__title">
			Results for "{listingsRegion}"
		</Title>
	) : null;
	const listingsSectionElement =
		listings && listings.result.length ? (
			<div>
				<Affix offsetTop={64}>
					<div>
						<ListingsPagination total={listings.total} page={page} limit={PAGE_LIMIT} setPage={setPage} />
						<ListingsFilters filter={filter} setFilter={setFilter} />
					</div>
				</Affix>
				<List
					grid={{
						gutter: 8,
						lg: 4,
						sm: 2,
						xs: 1,
					}}
					dataSource={listings.result}
					renderItem={(listing) => (
						<List.Item>
							<ListingCard listing={listing} />
						</List.Item>
					)}
				/>
			</div>
		) : (
			<div>
				<Paragraph>
					It appears that no listings have yet been createde for <Text mark>{listingsRegion}</Text>
				</Paragraph>
				<Paragraph>
					Be the first person to create a <Link to="/host">listing in this area</Link>!
				</Paragraph>
			</div>
		);

	return (
		<Content className="listings">
			{listingsRegionElement}
			{listingsSectionElement}
		</Content>
	);
};
