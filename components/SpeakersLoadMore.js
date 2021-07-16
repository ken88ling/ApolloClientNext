import React from "react";
import { useQuery, NetworkStatus } from "@apollo/client";
import { GET_SPEAKERS_CONCAT } from "../graphql/queries";

function SpeakersLoadMore() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
      GET_SPEAKERS_CONCAT,
      {
        variables: {
          afterCursor: '',
          limit: 4,
        },
        notifyOnNetworkStatusChange: true,
      },
  );

  const loadingMoreSpeakers = networkStatus === NetworkStatus.fetchMore;

  if (loading && !loadingMoreSpeakers) {
    return <div className="col-sm6">Loading...</div>;
  }

  if (error === true) {
    return <div className="col-sm6">Error</div>;
  }

  const { datalist } = data.speakersConcat;
  const { hasNextPage, lastCursor } = data.speakersConcat.pageInfo;

  return (
    <div>
      {datalist.map((item, index) => {
        return (
          <div className="col-md-12" key={index}>
            {item.id}
            {item.first}
            {item.last}
          </div>
        );
      })}

      {hasNextPage && (
        <button
          onClick={() => {
            fetchMore({
              variables: {
                afterCursor: lastCursor,
              },
            }).then();
          }}
        >
          {loadingMoreSpeakers ? "Loading..." : "Show More"}
        </button>
      )}
    </div>
  );
}

export default SpeakersLoadMore;
