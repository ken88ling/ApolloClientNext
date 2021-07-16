import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_SPEAKERS } from "../graphql/queries";
import Toolbar from "./Toolbar";
import React from "react";
import SpeakerItem from "./SpeakerItem";
import { currentThemeVar, paginationDataVar } from "../graphql/apolloClient";

export default function SpeakerListItem(props) {
  const currentTheme = useReactiveVar(currentThemeVar);
  const paginationData = useReactiveVar(paginationDataVar);
  const { limit, currentPage } = paginationData;
  const { loading, error, data } = useQuery(GET_SPEAKERS, {
    variables: {
      offset: currentPage * limit,
      limit,
    },
  });

  if (error) return <div className="col-sm6">Error</div>;

  return (
    <div
      style={
        currentTheme === "dark"
          ? { backgroundColor: "black", color: "white" }
          : { backgroundColor: "white" }
      }
    >
      <Toolbar totalItemCount={!loading && data.speakers?.pageInfo?.totalItemCount} />
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {loading &&  <div className="col-sm6">Loading...</div>}
            {!loading && data.speakers.datalist.map(
              ({ id, first, last, favorite, fullName, checkBoxColumn }) => {
                return (
                  <SpeakerItem
                    key={id}
                    speakerRec={{
                      id,
                      first,
                      last,
                      favorite,
                      fullName,
                      checkBoxColumn,
                    }}
                  />
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
