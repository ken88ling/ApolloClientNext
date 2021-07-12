import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_SPEAKERS } from "../graphql/queries";
import Toolbar from "./Toolbar";
import React from "react";
import SpeakerItem from "./SpeakerItem";
import { currentThemeVar } from "../graphql/apolloClient";

export default function SpeakerListItem(props) {
  const { loading, error, data } = useQuery(GET_SPEAKERS);
  const currentTheme = useReactiveVar(currentThemeVar);

  if (loading) return <div className="col-sm6">Loading...</div>;
  if (error) return <div className="col-sm6">Error</div>;

  return (
    <div
      style={
        currentTheme === "dark"
          ? { backgroundColor: "black", color: "white" }
          : { backgroundColor: "white" }
      }
    >
      <Toolbar />
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {data.speakers.datalist.map(
              ({ id, first, last, favorite, fullName }) => {
                return (
                  <SpeakerItem
                    key={id}
                    speakerRec={{ id, first, last, favorite, fullName }}
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
