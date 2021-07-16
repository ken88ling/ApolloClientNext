import React from "react";
import { useQuery, NetworkStatus } from "@apollo/client";
import { GET_SESSIONS_CONCAT } from "../graphql/queries";

function SessionsLoadMore() {
  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    GET_SESSIONS_CONCAT,
    {
      variables: {
        afterCursor: "",
        limit: 4,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const loadingMoreSessions = networkStatus === NetworkStatus.fetchMore;

  if (loading && !loadingMoreSessions) {
    return <div className="col-sm6">Loading...</div>;
  }

  if (error === true) {
    return <div className="col-sm6">Error</div>;
  }

  const { datalist } = data.sessionsConcat;
  const { hasNextPage, lastCursor } = data.sessionsConcat.pageInfo;

  return (
    <div>
      {datalist.map((item, index) => {
        return (
          <div className="col-md-12" key={index}>
            {item.id}
            {item.title}
            {item.eventYear}
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
          {loadingMoreSessions ? "Loading..." : "Show More"}
        </button>
      )}
    </div>
  );
}

export default SessionsLoadMore;
